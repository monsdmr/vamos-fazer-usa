import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir para o início
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
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
