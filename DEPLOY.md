# VPS Deploy

This project is designed to run on a VPS with:

- `nginx` as the reverse proxy
- `pm2` as the process manager
- `next start` behind `127.0.0.1:3001`

## 1. Server Environment

Create the production env file on the server:

```bash
cd /home/guven_admin/apps/sitecreator/current
nano .env.production.local
```

Use the values from `.env.production.example`.

Important:

- `AUTH_URL` should match the real HTTPS domain.
- `AUTH_TRUST_HOST=true` is required behind `nginx`.
- `NEXT_PUBLIC_*` values are baked in during `npm run build`.

## 2. PM2

This repo includes `ecosystem.config.cjs`.

Start or reload:

```bash
cd /home/guven_admin/apps/sitecreator/current
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
```

Make PM2 persistent:

```bash
pm2 startup
pm2 save
```

## 3. Nginx

Example server block:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name sitecreator.az www.sitecreator.az;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 4. GitHub Secrets

Add these GitHub repository secrets:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_PRIVATE_KEY`

Optional GitHub repository variables:

- `DEPLOY_SSH_PORT`
- `DEPLOY_PATH`
- `DEPLOY_BRANCH`

Defaults used by the workflow:

- port: `22`
- path: `/home/guven_admin/apps/sitecreator/current`
- branch: `main`

## 5. Workflow Behavior

The pipeline is defined in `.github/workflows/pipeline.yml`.

On every PR to `main`:

- `npm ci`
- `npm run lint`
- `npm run test`

On every push to `main`:

- run the same checks
- SSH into the VPS
- `git pull --ff-only`
- `npm ci`
- `npm run build`
- `pm2 startOrReload ecosystem.config.cjs --update-env`
- `pm2 save`
