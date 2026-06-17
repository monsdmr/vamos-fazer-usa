import type { VercelRequest, VercelResponse } from "@vercel/node";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PANEL_PASSWORD = process.env.PANEL_PASSWORD;
const ACTIVE_WINDOW_MIN = 10;

function getKey(req: VercelRequest): string | null {
  const h = req.headers["x-panel-key"];
  if (typeof h === "string" && h) return h;
  const q = req.query.key;
  if (typeof q === "string" && q) return q;
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sbGet(path: string): Promise<any[]> {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SERVICE_KEY as string,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "count=none",
      // Request up to 5 000 rows; change Max Rows in Supabase API settings if needed
      Range: "0-4999",
    },
  });
  if (!r.ok) throw new Error(`supabase ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
}

function parseDevice(ua: string | null): string {
  if (!ua) return "desktop";
  const l = ua.toLowerCase();
  if (/mobile|android|iphone|ipod|windows phone/.test(l)) return "mobile";
  if (/ipad|tablet/.test(l)) return "tablet";
  return "desktop";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function groupBy<T extends Record<string, any>>(arr: T[], key: keyof T): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const item of arr) {
    const k = String(item[key] ?? "__null__");
    (out[k] ??= []).push(item);
  }
  return out;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!SUPABASE_URL || !SERVICE_KEY || !PANEL_PASSWORD) {
    res.status(500).json({ error: "server not configured" });
    return;
  }
  if (getKey(req) !== PANEL_PASSWORD) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).toISOString();
  const activeSince = new Date(now.getTime() - ACTIVE_WINDOW_MIN * 60_000).toISOString();

  try {
    const cols = [
      "id", "created_at", "event_type", "session_id",
      "user_agent", "page_location",
      "country", "state", "city",
      "utm_source", "utm_medium", "utm_campaign", "utm_content", "adset", "adname",
      "email", "phone", "user_name", "firstname", "lastname", "lead_state",
      "order_id", "value", "currency", "product_name",
    ].join(",");

    const events = await sbGet(
      `events?select=${cols}&created_at=gte.${startOfDay}&order=created_at.desc`
    );

    // Split by event type
    const pageViews = events.filter((e) => e.event_type === "page_view");
    const leadEvents = events.filter((e) => e.event_type === "lead_submitted");
    const purchaseEvents = events.filter(
      (e) => e.order_id != null || (e.value != null && Number(e.value) > 0)
    );

    // KPIs
    const uniqueVisitors = new Set(pageViews.map((e) => e.session_id)).size;
    const uniqueLeads = new Set(leadEvents.map((e) => e.session_id)).size;
    const uniquePurchases = new Set(purchaseEvents.map((e) => e.session_id)).size;
    const revenue = purchaseEvents.reduce((s, e) => s + (Number(e.value) || 0), 0);

    // Active sessions (last N min)
    const recentEvents = events.filter((e) => e.created_at >= activeSince);
    const activeNow = new Set(recentEvents.map((e) => e.session_id)).size;

    // Active session list for the live table
    const bySession = groupBy(events, "session_id");
    const activeSessions = Array.from(new Set(recentEvents.map((e) => e.session_id)))
      .map((sid) => {
        const sess = bySession[sid] ?? [];
        const last = sess[0];            // sorted desc → first = latest
        const first = sess[sess.length - 1];
        return {
          session_id: sid,
          last_event: last.created_at,
          last_event_type: last.event_type,
          first_seen: first.created_at,
          country: last.country ?? null,
          device: parseDevice(last.user_agent),
          utm_source: first.utm_source ?? null,
          utm_campaign: first.utm_campaign ?? null,
          page_location: last.page_location ?? null,
        };
      })
      .sort((a, b) => new Date(b.last_event).getTime() - new Date(a.last_event).getTime());

    // Traffic sources
    const sourceMap: Record<string, { visitors: Set<string>; leads: Set<string> }> = {};
    for (const e of events) {
      const src = e.utm_source || "direto";
      if (!sourceMap[src]) sourceMap[src] = { visitors: new Set(), leads: new Set() };
      if (e.event_type === "page_view") sourceMap[src].visitors.add(e.session_id);
      if (e.event_type === "lead_submitted") sourceMap[src].leads.add(e.session_id);
    }
    const bySource = Object.entries(sourceMap)
      .map(([source, d]) => ({ source, visitors: d.visitors.size, leads: d.leads.size }))
      .sort((a, b) => b.visitors - a.visitors);

    // Campaigns
    const campMap: Record<string, { visitors: Set<string>; leads: Set<string> }> = {};
    for (const e of pageViews) {
      const c = e.utm_campaign || "(sem campanha)";
      if (!campMap[c]) campMap[c] = { visitors: new Set(), leads: new Set() };
      campMap[c].visitors.add(e.session_id);
    }
    for (const e of leadEvents) {
      const c = e.utm_campaign || "(sem campanha)";
      if (!campMap[c]) campMap[c] = { visitors: new Set(), leads: new Set() };
      campMap[c].leads.add(e.session_id);
    }
    const byCampaign = Object.entries(campMap)
      .map(([campaign, d]) => ({ campaign, visitors: d.visitors.size, leads: d.leads.size }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 20);

    // Geo
    const countryMap: Record<string, Set<string>> = {};
    for (const e of pageViews) {
      const c = e.country || "?";
      (countryMap[c] ??= new Set()).add(e.session_id);
    }
    const byCountry = Object.entries(countryMap)
      .map(([country, s]) => ({ country, count: s.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Device
    const devMap: Record<string, Set<string>> = {};
    for (const e of pageViews) {
      const d = parseDevice(e.user_agent);
      (devMap[d] ??= new Set()).add(e.session_id);
    }
    const byDevice = Object.entries(devMap)
      .map(([device, s]) => ({ device, count: s.size }))
      .sort((a, b) => b.count - a.count);

    // Recent leads
    const recentLeads = leadEvents.slice(0, 50).map((e) => ({
      session_id: e.session_id,
      created_at: e.created_at,
      name:
        e.user_name ||
        [e.firstname, e.lastname].filter(Boolean).join(" ") ||
        null,
      email: e.email ?? null,
      phone: e.phone ?? null,
      country: e.country ?? null,
      utm_source: e.utm_source ?? null,
      utm_campaign: e.utm_campaign ?? null,
    }));

    // Live event stream
    const recentEventsStream = events.slice(0, 40).map((e) => ({
      id: e.id,
      created_at: e.created_at,
      event_type: e.event_type,
      session_id: e.session_id,
      country: e.country ?? null,
      device: parseDevice(e.user_agent),
      utm_source: e.utm_source ?? null,
      value: e.value != null ? Number(e.value) : null,
    }));

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
      now: now.toISOString(),
      kpi: {
        visitors: uniqueVisitors,
        leads: uniqueLeads,
        purchases: uniquePurchases,
        revenue,
        active_now: activeNow,
      },
      funnel: {
        page_view: uniqueVisitors,
        lead_submitted: uniqueLeads,
        purchase: uniquePurchases,
      },
      by_source: bySource,
      by_campaign: byCampaign,
      by_country: byCountry,
      by_device: byDevice,
      recent_leads: recentLeads,
      active_sessions: activeSessions,
      recent_events: recentEventsStream,
    });
  } catch (e) {
    res.status(502).json({ error: "upstream", detail: String(e).slice(0, 300) });
  }
}
