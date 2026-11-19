# Partner courier admin

Web portal for courier partners (teams, orders, wallet). Built with React, Vite, and MUI.

## URLs

| Branch | Environment | Portal |
|--------|-------------|--------|
| `test` | Staging | https://staging-courier-partner.kabluxe.com |
| `main` | Production | https://courier-partner.kabluxe.com |

API base (`VITE_API_BASE_URL`): see [docs/VPS_DEPLOY.md](docs/VPS_DEPLOY.md).

## Local development

```bash
cp .env.development.example .env.development.local
npm ci
npm run dev
```

## Deploy

Push to `test` or `main` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Production merges must come from `test` only.

See [docs/VPS_DEPLOY.md](docs/VPS_DEPLOY.md) for DNS, TLS, GitHub secrets, and CORS on the courier API.