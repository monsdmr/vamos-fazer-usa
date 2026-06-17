import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity, BarChart2, DollarSign, Eye, Globe, Lock, Map,
  Monitor, RefreshCw, ShoppingCart, Smartphone, Tablet,
  UserCheck, Wifi, Zap,
} from "lucide-react";

export const Route = createFileRoute("/painel")({
  component: Painel,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type KPI = { visitors: number; leads: number; purchases: number; revenue: number; active_now: number };
type FunnelData = { page_view: number; lead_submitted: number; purchase: number };
type SourceRow = { source: string; visitors: number; leads: number };
type CampaignRow = { campaign: string; visitors: number; leads: number };
type GeoRow = { country: string; count: number };
type DeviceRow = { device: string; count: number };
type ActiveSession = {
  session_id: string; last_event: string; last_event_type: string; first_seen: string;
  country: string | null; device: string; utm_source: string | null;
  utm_campaign: string | null; page_location: string | null;
};
type Lead = {
  session_id: string; created_at: string; name: string | null;
  email: string | null; phone: string | null; country: string | null;
  utm_source: string | null; utm_campaign: string | null;
};
type EventRow = {
  id: number; created_at: string; event_type: string; session_id: string;
  country: string | null; device: string; utm_source: string | null; value: number | null;
};
type LivePayload = {
  now: string; kpi: KPI; funnel: FunnelData;
  by_source: SourceRow[]; by_campaign: CampaignRow[];
  by_country: GeoRow[]; by_device: DeviceRow[];
  recent_leads: Lead[]; active_sessions: ActiveSession[]; recent_events: EventRow[];
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const PANEL_KEY_STORE = "panel_key";

function fmtDuration(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function fmtMoney(v: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
}

function flag(code: string | null): string {
  if (!code || code.length !== 2 || code === "?") return "🌐";
  try { return String.fromCodePoint(...code.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0))); }
  catch { return "🌐"; }
}

function pct(num: number, den: number): string {
  return den ? `${((num / den) * 100).toFixed(1)}%` : "—";
}

function pagePath(loc: string | null): string {
  if (!loc) return "—";
  try { return new URL(loc).pathname || "/"; }
  catch { return loc.slice(0, 30); }
}

const EV_BADGE: Record<string, string> = {
  page_view:      "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  lead_submitted: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  purchase:       "bg-amber-500/15 text-amber-300 ring-amber-500/30",
};
const EV_LABEL: Record<string, string> = {
  page_view: "Visualizou", lead_submitted: "Lead enviado", purchase: "Comprou",
};

function DevIcon({ d }: { d: string }) {
  if (d === "mobile") return <Smartphone className="h-3.5 w-3.5" />;
  if (d === "tablet") return <Tablet className="h-3.5 w-3.5" />;
  return <Monitor className="h-3.5 w-3.5" />;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
function Painel() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [data, setData] = useState<LivePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const keyRef = useRef("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(PANEL_KEY_STORE);
      if (saved) { keyRef.current = saved; setAuthed(true); }
    } catch { /* */ }
  }, []);

  const fetchLive = useCallback(async () => {
    if (!keyRef.current) return;
    try {
      const r = await fetch(`/api/live?key=${encodeURIComponent(keyRef.current)}`, {
        headers: { "x-panel-key": keyRef.current },
      });
      if (r.status === 401) {
        setError("Senha incorreta.");
        setAuthed(false);
        keyRef.current = "";
        try { sessionStorage.removeItem(PANEL_KEY_STORE); } catch { /* */ }
        return;
      }
      if (!r.ok) { setError(`Erro ${r.status} ao carregar.`); return; }
      setData(await r.json() as LivePayload);
      setError(null);
    } catch { setError("Falha de rede."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetchLive();
    const id = setInterval(fetchLive, 5000);
    const onVis = () => { if (document.visibilityState === "visible") fetchLive(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
  }, [authed, fetchLive]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    const v = pwInput.trim();
    if (!v) return;
    keyRef.current = v;
    try { sessionStorage.setItem(PANEL_KEY_STORE, v); } catch { /* */ }
    setError(null);
    setAuthed(true);
  };

  // ---- Login ----------------------------------------------------------------
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
              <Lock className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Painel do funil</h1>
              <p className="text-xs text-slate-400">Acesso restrito</p>
            </div>
          </div>
          <input
            type="password" autoFocus
            value={pwInput} onChange={(e) => setPwInput(e.target.value)}
            placeholder="Senha do painel"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:ring-2 ring-emerald-500/40"
          />
          {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}
          <button type="submit" className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // ---- Dashboard ------------------------------------------------------------
  const nowMs = data ? new Date(data.now).getTime() : Date.now();
  const kpi = data?.kpi ?? { visitors: 0, leads: 0, purchases: 0, revenue: 0, active_now: 0 };
  const funnel = data?.funnel ?? { page_view: 0, lead_submitted: 0, purchase: 0 };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <span className="text-base font-semibold">Painel do funil</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-semibold text-emerald-400">{kpi.active_now}</span> online agora
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              {data ? fmtTime(data.now) : "…"}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6">
        {error && (
          <div className="rounded-lg border border-rose-900/50 bg-rose-950/30 px-4 py-2 text-sm text-rose-300">{error}</div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <KpiCard icon={<Wifi className="h-4 w-4" />}         label="Online agora"    value={kpi.active_now}         accent="emerald" />
          <KpiCard icon={<Eye className="h-4 w-4" />}          label="Visitantes hoje" value={kpi.visitors}            accent="sky" />
          <KpiCard icon={<UserCheck className="h-4 w-4" />}    label="Leads hoje"      value={kpi.leads}               accent="violet" />
          <KpiCard icon={<ShoppingCart className="h-4 w-4" />} label="Vendas hoje"     value={kpi.purchases}           accent="amber" />
          <KpiCard icon={<DollarSign className="h-4 w-4" />}   label="Receita hoje"    value={fmtMoney(kpi.revenue)}   accent="green" />
        </div>

        {/* Funnel */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-300">Funil de conversão (hoje)</h2>
          <div className="space-y-3">
            {([
              { label: "Visitantes",  count: funnel.page_view,      gradient: "from-sky-600/80 to-sky-400/80" },
              { label: "Leads",       count: funnel.lead_submitted,  gradient: "from-violet-600/80 to-violet-400/80" },
              { label: "Compras",     count: funnel.purchase,        gradient: "from-amber-600/80 to-amber-400/80" },
            ] as const).map((step, i, arr) => {
              const top = arr[0].count || 1;
              const prev = i > 0 ? arr[i - 1].count : step.count;
              return (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="w-24 shrink-0 text-xs text-slate-400">{step.label}</div>
                  <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-slate-800/60">
                    <div
                      className={`flex h-full items-center justify-end rounded-md bg-gradient-to-r ${step.gradient} px-3 text-xs font-semibold text-white transition-all duration-500`}
                      style={{ width: `${Math.max((step.count / top) * 100, step.count > 0 ? 4 : 0)}%` }}
                    >
                      {step.count}
                    </div>
                  </div>
                  <div className="w-14 shrink-0 text-right text-xs text-slate-500">
                    {i === 0 ? "100%" : pct(step.count, prev)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
            <span>Visitante → Lead: <strong className="text-slate-300">{pct(funnel.lead_submitted, funnel.page_view)}</strong></span>
            <span>Lead → Compra: <strong className="text-slate-300">{pct(funnel.purchase, funnel.lead_submitted)}</strong></span>
            <span>Geral (visit. → compra): <strong className="text-slate-300">{pct(funnel.purchase, funnel.page_view)}</strong></span>
          </div>
        </section>

        {/* Sources + Campaigns */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TrafficTable
            title="Fontes de tráfego"
            icon={<Globe className="h-4 w-4 text-slate-400" />}
            rows={(data?.by_source ?? []).map((r) => ({ label: r.source, visitors: r.visitors, leads: r.leads }))}
          />
          <TrafficTable
            title="Campanhas"
            icon={<BarChart2 className="h-4 w-4 text-slate-400" />}
            rows={(data?.by_campaign ?? []).map((r) => ({ label: r.campaign, visitors: r.visitors, leads: r.leads }))}
          />
        </div>

        {/* Geo + Device */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <BreakdownCard
            title="Países"
            icon={<Map className="h-4 w-4 text-slate-400" />}
            rows={(data?.by_country ?? []).map((r) => ({ label: `${flag(r.country)} ${r.country || "?"}`, value: r.count }))}
            total={kpi.visitors || 1}
          />
          <BreakdownCard
            title="Dispositivos"
            icon={<Smartphone className="h-4 w-4 text-slate-400" />}
            rows={(data?.by_device ?? []).map((r) => ({
              label: r.device,
              value: r.count,
              icon: <DevIcon d={r.device} />,
            }))}
            total={kpi.visitors || 1}
          />
        </div>

        {/* Active sessions */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-300">Sessões ativas agora</h2>
            </div>
            <span className="text-xs text-slate-500">{data?.active_sessions.length ?? 0} (últimos 10 min)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/70 text-slate-500">
                  <th className="px-4 py-2 font-medium">Dispositivo</th>
                  <th className="px-4 py-2 font-medium">Local</th>
                  <th className="px-4 py-2 font-medium">Último evento</th>
                  <th className="px-4 py-2 font-medium">Página</th>
                  <th className="px-4 py-2 font-medium">Duração</th>
                  <th className="px-4 py-2 font-medium">Fonte</th>
                </tr>
              </thead>
              <tbody>
                {!data?.active_sessions.length && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Ninguém ativo no momento.</td></tr>
                )}
                {(data?.active_sessions ?? []).map((s) => {
                  const online = nowMs - new Date(s.last_event).getTime() < 30_000;
                  return (
                    <tr key={s.session_id} className="border-b border-slate-800/40 hover:bg-slate-800/20">
                      <td className="px-4 py-2.5">
                        <span className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${online ? "bg-emerald-400" : "bg-amber-400"}`} />
                          <DevIcon d={s.device} />
                          <span className="capitalize text-slate-300">{s.device}</span>
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">
                        {s.country ? `${flag(s.country)} ${s.country}` : "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ${EV_BADGE[s.last_event_type] ?? "bg-slate-500/15 text-slate-300 ring-slate-500/30"}`}>
                          {EV_LABEL[s.last_event_type] ?? s.last_event_type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-slate-400">
                        {pagePath(s.page_location)}
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">
                        {fmtDuration(nowMs - new Date(s.first_seen).getTime())}
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">
                        {s.utm_source || "direto"}
                        {s.utm_campaign ? <span className="text-slate-600"> · {s.utm_campaign}</span> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent leads */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-violet-400" />
              <h2 className="text-sm font-semibold text-slate-300">Leads recentes</h2>
            </div>
            <span className="text-xs text-slate-500">{data?.recent_leads.length ?? 0} hoje</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/70 text-slate-500">
                  <th className="px-4 py-2 font-medium">Horário</th>
                  <th className="px-4 py-2 font-medium">Nome</th>
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Telefone</th>
                  <th className="px-4 py-2 font-medium">País</th>
                  <th className="px-4 py-2 font-medium">Fonte / Campanha</th>
                </tr>
              </thead>
              <tbody>
                {!data?.recent_leads.length && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Nenhum lead ainda hoje.</td></tr>
                )}
                {(data?.recent_leads ?? []).map((l, i) => (
                  <tr key={`${l.session_id}-${i}`} className="border-b border-slate-800/40 hover:bg-slate-800/20">
                    <td className="px-4 py-2.5 font-mono text-slate-500">{fmtTime(l.created_at)}</td>
                    <td className="px-4 py-2.5 text-slate-200">{l.name ?? <span className="text-slate-600">—</span>}</td>
                    <td className="px-4 py-2.5 text-slate-300">{l.email ?? <span className="text-slate-600">—</span>}</td>
                    <td className="px-4 py-2.5 text-slate-300">{l.phone ?? <span className="text-slate-600">—</span>}</td>
                    <td className="px-4 py-2.5 text-slate-400">
                      {l.country ? `${flag(l.country)} ${l.country}` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400">
                      {l.utm_source || "direto"}
                      {l.utm_campaign ? <span className="text-slate-600"> · {l.utm_campaign}</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Event stream */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-3">
            <Activity className="h-4 w-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-slate-300">Stream de eventos (últimos 40)</h2>
          </div>
          <div className="divide-y divide-slate-800/50">
            {!data?.recent_events.length && (
              <p className="px-5 py-10 text-center text-xs text-slate-500">Sem eventos ainda hoje.</p>
            )}
            {(data?.recent_events ?? []).map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 px-5 py-2.5 text-xs hover:bg-slate-800/20">
                <span className="w-16 shrink-0 font-mono text-slate-500">{fmtTime(ev.created_at)}</span>
                <span className={`shrink-0 rounded-md px-2 py-0.5 font-medium ring-1 ${EV_BADGE[ev.event_type] ?? "bg-slate-500/15 text-slate-300 ring-slate-500/30"}`}>
                  {EV_LABEL[ev.event_type] ?? ev.event_type}
                </span>
                <span className="shrink-0"><DevIcon d={ev.device} /></span>
                <span className="text-slate-400">
                  {ev.country ? `${flag(ev.country)} ${ev.country}` : "—"}
                </span>
                <span className="text-slate-600">
                  {ev.utm_source ? `via ${ev.utm_source}` : "direto"}
                </span>
                {ev.value ? (
                  <span className="ml-auto font-semibold text-amber-400">{fmtMoney(ev.value)}</span>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <p className="pb-8 text-center text-[11px] text-slate-600">
          {data ? `Atualizado ${fmtTime(data.now)} · atualiza a cada 5s` : "Carregando…"}
        </p>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
const ACCENTS: Record<string, string> = {
  emerald: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
  sky:     "text-sky-400 bg-sky-500/10 ring-sky-500/20",
  amber:   "text-amber-400 bg-amber-500/10 ring-amber-500/20",
  violet:  "text-violet-400 bg-violet-500/10 ring-violet-500/20",
  green:   "text-green-400 bg-green-500/10 ring-green-500/20",
};

function KpiCard({ icon, label, value, accent }: {
  icon: React.ReactNode; label: string; value: string | number; accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg ring-1 ${ACCENTS[accent]}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-0.5 text-xs text-slate-400">{label}</div>
    </div>
  );
}

function TrafficTable({ title, icon, rows }: {
  title: string; icon: React.ReactNode;
  rows: Array<{ label: string; visitors: number; leads: number }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold text-slate-300">{title}</h2>
      </div>
      {!rows.length ? (
        <p className="text-xs text-slate-500">Sem dados ainda.</p>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800/70 text-slate-500">
              <th className="pb-2 text-left font-medium">Nome</th>
              <th className="pb-2 text-right font-medium">Visitantes</th>
              <th className="pb-2 text-right font-medium">Leads</th>
              <th className="pb-2 text-right font-medium">Conv.</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 10).map((r) => (
              <tr key={r.label} className="border-b border-slate-800/30">
                <td className="max-w-[140px] truncate py-1.5 text-slate-300">{r.label}</td>
                <td className="py-1.5 text-right text-slate-400">{r.visitors}</td>
                <td className="py-1.5 text-right text-slate-400">{r.leads}</td>
                <td className="py-1.5 text-right text-slate-400">{pct(r.leads, r.visitors)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function BreakdownCard({ title, icon, rows, total }: {
  title: string; icon: React.ReactNode;
  rows: Array<{ label: string; value: number; icon?: React.ReactNode }>;
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold text-slate-300">{title}</h2>
      </div>
      {!rows.length ? (
        <p className="text-xs text-slate-500">Sem dados ainda.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-3 text-xs">
              <div className="flex w-32 shrink-0 items-center gap-1.5 text-slate-300">
                {r.icon}
                <span className="capitalize">{r.label}</span>
              </div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500/60 transition-all duration-500"
                  style={{ width: `${(r.value / total) * 100}%` }}
                />
              </div>
              <div className="w-8 shrink-0 text-right text-slate-400">{r.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
