# Deploy no Vercel

Este projeto é um funil 100% front-end (sem backend, sem banco, sem secrets).
Pode ser publicado no Vercel como site estático em poucos passos.

## 1. Subir para o GitHub
1. Crie um repositório novo no GitHub.
2. Faça push deste projeto para lá.

## 2. Importar no Vercel
1. Acesse https://vercel.com/new
2. Selecione o repositório.
3. **Framework Preset**: deixe em "Other" (o `vercel.json` já cuida da config).
4. Clique em **Deploy**.

O `vercel.json` já define:
- `buildCommand`: `vite build`
- `outputDirectory`: `dist/client`
- `installCommand`: `bun install`
- Rewrite SPA: todas as rotas caem no `index.html` (necessário porque cada página VSL/upsell é uma rota separada do TanStack Router).
- Cache imutável de 1 ano para `/assets/*`.

## 3. Variáveis de ambiente / Secrets
**Nenhuma.** O projeto não usa `.env`, não chama API privada, não tem chave de banco.
Os únicos endpoints externos são:
- Player vturb (`scripts.converteai.net`) — público
- Checkout Digistore (`checkout-ds24.com`) — link público

Portanto **nenhum dado sensível é exposto** no deploy do Vercel.

## 4. Domínio próprio
Em **Project Settings → Domains**, adicione seu domínio e siga as instruções de DNS.

## 5. Atualizações
Cada push na branch `main` (ou a que você configurar) gera deploy automático.
