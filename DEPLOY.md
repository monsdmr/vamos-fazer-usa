# Guia de Deploy Rápido

Este projeto roda em **TanStack Start + Cloudflare Workers**. O deploy padrão é via Lovable (botão Publish), mas se precisar fazer deploy em outro lugar (caso a Lovable esteja fora do ar), siga abaixo.

## Pré-requisitos

```bash
bun install      # ou: npm install
bun run build    # gera o bundle em /dist
```

---

## Opção 1 — Cloudflare Workers (mais compatível, recomendado)

O projeto já vem com `wrangler.jsonc` configurado.

```bash
# Instale o wrangler globalmente (uma vez)
npm install -g wrangler

# Login na sua conta Cloudflare
wrangler login

# Build + deploy
bun run build
wrangler deploy
```

Pronto. Depois é só conectar seu domínio no painel da Cloudflare.

---

## Opção 2 — Site estático (Netlify / Vercel / GitHub Pages / qualquer host)

Como o projeto **não tem backend** (só páginas + player vturb), dá para servir como HTML puro.

### Passo 1 — Buildar como estático

Edite `vite.config.ts` para gerar SSG (Static Site Generation):

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    pages: [
      { path: "/" },
      { path: "/vsl" },
      { path: "/upsell1" },
      { path: "/upsell2" },
      { path: "/upsell3" },
    ],
  },
});
```

### Passo 2 — Build e deploy

```bash
bun run build
# A pasta /dist/client contém o site estático
```

Faça upload da pasta `dist/client` para:
- **Netlify**: arraste a pasta em https://app.netlify.com/drop
- **Vercel**: `npx vercel deploy dist/client --prod`
- **Cloudflare Pages**: `wrangler pages deploy dist/client`
- **GitHub Pages**: copie para a branch `gh-pages`

---

## Opção 3 — Domínio próprio direto na Lovable

Mais simples se Lovable estiver no ar:
1. Clique em **Publish** (canto superior direito)
2. Em **Project Settings → Domains**, conecte seu domínio
3. Configure os DNS conforme as instruções mostradas

---

## Estrutura das rotas

| Rota | Arquivo |
|------|---------|
| `/` | `src/routes/index.tsx` (formulário de verificação) |
| `/vsl` | `src/routes/vsl.tsx` (vídeo principal — botão libera em 21:01) |
| `/upsell1` | `src/routes/upsell1.tsx` (botão libera em 3:40) |
| `/upsell2` | `src/routes/upsell2.tsx` (botão libera em 1:43) |
| `/upsell3` | `src/routes/upsell3.tsx` (botão libera em 2:32) |

## Trocar links dos botões

Os botões de checkout estão hardcoded em cada arquivo de rota. Procure por `centerpag.com` ou `href=` para localizar e trocar.

## Variáveis de ambiente

Este projeto **não usa nenhuma variável de ambiente**. Não há `.env`, não há secrets, nada para configurar — só buildar e subir.
