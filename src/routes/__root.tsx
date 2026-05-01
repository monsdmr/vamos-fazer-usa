import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" },
      { name: "theme-color", content: "#0e2a3a" },
      { name: "format-detection", content: "telephone=no" },
      // Strip Referer header from ALL outbound navigations / requests so that
      // Digistore (and any other external endpoint) cannot see the originating
      // domain of the ad / funnel. URL query params (utm_*, fbclid, gclid, etc.)
      // are still passed through explicitly when we build outbound links.
      { name: "referrer", content: "no-referrer" },
      { title: "American System" },
      { name: "description", content: "American System" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "American System" },
      { property: "og:description", content: "American System" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "American System" },
      { name: "twitter:description", content: "American System" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e8db73f2-6b50-4e62-8e13-7b6945af8ffc" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e8db73f2-6b50-4e62-8e13-7b6945af8ffc" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Warm up VSL player network connections from any page
      { rel: "preconnect", href: "https://scripts.converteai.net", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://cdn.converteai.net", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://images.converteai.net", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://m3u8.vturb.net", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://api.vturb.com.br" },
      { rel: "preconnect", href: "https://www.googletagmanager.com" },
    ],
    scripts: [
      // Device fingerprint — must run BEFORE GTM so the hash is available for
      // any subsequent dataLayer event (form_start, begin_checkout, etc.).
      {
        children: `(function(){try{if(typeof window==='undefined'||typeof sessionStorage==='undefined')return;var existing=sessionStorage.getItem('device_fingerprint');var fp=existing;if(!fp){var d={screen:(screen.width+'x'+screen.height+'x'+screen.colorDepth),timezone:(Intl.DateTimeFormat().resolvedOptions().timeZone||''),language:(navigator.language||''),platform:(navigator.platform||''),cores:(navigator.hardwareConcurrency||''),memory:(navigator.deviceMemory||''),touchPoints:(navigator.maxTouchPoints||0),userAgent:(navigator.userAgent||'')};var s=[d.screen,d.timezone,d.language,d.platform,d.cores,d.memory,d.touchPoints,d.userAgent].join('|');var h=0;for(var i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}fp=Math.abs(h).toString(36);sessionStorage.setItem('device_fingerprint',fp);}window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'fingerprint_ready',device_fingerprint:fp});}catch(e){}})();`,
      },
      {
        children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P249W95K');`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Google Tag Manager (noscript) — must be in <body> per HTML5 spec */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P249W95K"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
