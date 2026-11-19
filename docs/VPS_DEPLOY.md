# Partner courier admin — VPS deploy

| Branch | GitHub environment | Partner portal URL | Courier API (`VITE_API_BASE_URL`) |
|--------|-------------------|--------------------|-----------------------------------|
| `test` | `test` | https://staging-courier-partner.kabluxe.com | https://staging-api-courier.kabluxe.com/api/v1 |
| `main` | `production` | https://courier-partner.kabluxe.com | https://courier-api.kabluxe.com/api/v1 |

Push (or merge) to `test` / `main` runs [.github/workflows/deploy.yml](../.github/workflows/deploy.yml): `npm ci` → `npm run build` → rsync `dist/` to `/home/deploy/kabluxe-partner-courier-admin` on the shared API droplet. Docker nginx serves that directory (see `kabluxe_backend_op` `courier-partner-vhosts.conf`).

## One-time setup

1. **DNS** (same A record as the ride/courier API droplet for each env)
   - `staging-courier-partner.kabluxe.com` → test droplet
   - `courier-partner.kabluxe.com` → production droplet

2. **GitHub environments** on `Kablux/Kablux-partner-courier-admin`
   - `test` and `production` with `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `VITE_API_BASE_URL`
   - SSH credentials match `Supa-admin-dashboard` (same VPS).

3. **kabluxe_backend_op**
   - Deploy nginx changes (`courier-partner-vhosts.conf`, compose volume, cert bootstrap).
   - On each droplet: `mkdir -p /home/deploy/kabluxe-partner-courier-admin` (owned by `deploy`)
   - Issue certs (after DNS propagates), e.g.:
     ```bash
     docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
       -d staging-courier-partner.kabluxe.com --agree-tos -m YOUR@EMAIL --non-interactive
     ```
     Repeat for `courier-partner.kabluxe.com` on production.

4. **Kabluxe-courier-backend CORS**
   - Append the partner portal origins to `CORS_ALLOWED_ORIGINS` on test and production:
     - `https://staging-courier-partner.kabluxe.com`
     - `https://courier-partner.kabluxe.com`

5. **Promote code**
   - Merge deploy workflow to `test`, confirm the staging URL loads and partner login works.
   - Promote `test` → `main`; confirm production URL.

## Verify

- Staging: open https://staging-courier-partner.kabluxe.com, log in against staging courier API.
- Production: open https://courier-partner.kabluxe.com, log in against production courier API.