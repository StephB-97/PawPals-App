# Deploy PawPals frontend to Vercel

This guide matches the team assignment: ship the **Next.js app** in [`web/`](https://github.com/StephB-97/PawPals-App/tree/main/web) to Vercel. The repo is [StephB-97/PawPals-App](https://github.com/StephB-97/PawPals-App).

## Before you start (git)

```bash
git checkout develop && git pull origin develop
git checkout -b feature/vercel-deploy
```

Use branch `feature/vercel-deploy` (or another feature branch) for any config changes, then open a PR into **`develop`** (not `main`), per team workflow.

## Vercel setup

1. Create a free account at [vercel.com](https://vercel.com).
2. **Add New Project** → connect GitHub → select **PawPals-App**.
3. **Root Directory:** set to **`web`** (the Next.js app is not at the repo root).
4. Framework: Vercel should auto-detect **Next.js**.
5. **Environment variables:** in Vercel → Project → **Settings → Environment Variables**, add every variable from your local `web/.env`, using **production** values from Stephanie (see `web/.env.example` for names).
   - Include at least: `DATABASE_URL`, `REDIS_URL`, Clerk keys, `NEXT_PUBLIC_*` keys, `AI_SERVICE_URL`, Cloudinary/Mapbox as your app uses them.
6. Deploy.

Suggested optional variable (see `.env.example`):

- `NEXT_PUBLIC_APP_URL` — your live site URL, e.g. `https://pawpals-app.vercel.app` (no trailing slash).

## Clerk (required for sign-in on the live URL)

In the [Clerk dashboard](https://dashboard.clerk.com):

- Add your **Vercel production URL** (and preview URLs if you use them) to **allowed origins / redirect URLs** as Clerk documents for Next.js hosted apps.

Until this is done, auth can fail or redirect incorrectly on production.

## FastAPI CORS (coordinate with backend)

The AI service reads:

- **`ALLOWED_ORIGINS`** — comma-separated list, e.g. `http://localhost:3000,https://your-project.vercel.app`
- **`ALLOWED_ORIGIN_REGEX`** (optional) — e.g. `https://.*\.vercel\.app` for all Vercel preview deployments (use only if your team accepts that pattern).

Local Docker: set these in a **repo-root** `.env` file used by `docker compose`, or export before `docker compose up`. The compose file passes them into the `ai-service` container.

Whoever deploys FastAPI to AWS (or elsewhere) should set the same values there so any **browser → AI service** calls work. (Today, most AI calls go **Next.js server → AI service**, which does not rely on CORS; CORS still matters for direct browser calls and future features.)

## After deploy — smoke test

On the live URL (e.g. `https://…vercel.app`):

- [ ] Landing page loads  
- [ ] Sign up / sign in (Clerk)  
- [ ] Dashboard after login  
- [ ] Discover, events, matches routes load (even if some are placeholders)  

## When you are done

1. Post the **live URL** in the group chat.  
2. `git push` your branch and open a **PR into `develop`**.

Do **not** push directly to `main`.

## Repo changes in this branch (for reviewers)

- **`web/package.json`** — `postinstall`: `prisma generate` so Vercel installs Prisma Client during `npm install`.  
- **`ai-service/app/main.py`** — configurable CORS + mounts the **bio** router so `/ai/generate-bio` is registered.  
- **`docker-compose.yml`** — passes `ALLOWED_ORIGINS` / `ALLOWED_ORIGIN_REGEX` into `ai-service`.  
- **`web/.env.example`** — notes for Vercel/production variables.
