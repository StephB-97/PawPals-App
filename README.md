# 🐾 PawPals

**A pet social discovery platform where pets find their next best friend.**

PawPals helps pet owners discover nearby pets for socialization through swipe-based and map-based discovery, AI-powered pet profiles, and community events.

---

## Team

| Name | Role |
|------|------|
| Stephanie Bernades | 
| Isabella Koletic | 
| Leo Zheng |
| Erina Khondakar |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript |
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend API | Next.js API Routes + FastAPI (Python) |
| Database | PostgreSQL + PostGIS |
| ORM | Prisma |
| Cache | Redis |
| Authentication | Clerk |
| Image Hosting | Cloudinary |
| Maps | Mapbox GL JS |
| AI | OpenAI API + pgvector |
| Containers | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Deployment | Vercel (frontend) + AWS (backend) |

---

## Getting Started (For Team Members)

Follow these steps exactly. If you get stuck, message Stephanie.

### Prerequisites

You need these installed on your computer before starting:

- **Git** — you probably already have this. Check with `git --version`
- **Node.js 18+** — download from https://nodejs.org (use the LTS version)
- **Docker Desktop** — download from https://www.docker.com/products/docker-desktop
- **A code editor** — VS Code recommended: https://code.visualstudio.com

### Step 1: Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/PawPals-App.git
cd PawPals-App
```

### Step 2: Switch to the develop branch

We never work directly on `main`. All work happens on `develop` or feature branches.

```bash
git checkout develop
```

### Step 3: Set up environment variables

The `.env.example` file has all the variable names you need. Copy it to create your own `.env` file:

```bash
cd web
cp .env.example .env
cd ..
```

Stephanie will share the real API keys in the group chat. Paste them into your `web/.env` file. **Never commit your `.env` file to Git.**

### Step 4: Start the backend services

Make sure Docker Desktop is open and running (whale icon in your menu bar). Then from the project root:

```bash
docker compose up
```

Wait until you see these messages in the terminal:
- `database system is ready to accept connections` — Postgres is running
- `Ready to accept connections` — Redis is running
- `Uvicorn running on http://0.0.0.0:8000` — AI service is running

**Leave this terminal open.** These services need to stay running.

### Step 5: Set up the database

Open a **new terminal window** and run:

```bash
cd PawPals-App/web
npm install
npx prisma migrate dev
npx prisma generate
```

This installs dependencies and creates all the database tables.

### Step 6: Start the frontend

In that same terminal:

```bash
npm run dev
```

Open your browser and go to:
- **http://localhost:3000** — the PawPals app
- **http://localhost:8000/docs** — the AI service API docs

If both pages load, you're all set!

### Stopping everything

- `Ctrl+C` in the terminal running `npm run dev` to stop Next.js
- `Ctrl+C` in the terminal running `docker compose up` to stop the backend services

### Starting again next time

Every time you sit down to work:

```bash
# Terminal 1 — start backend services
cd PawPals-App
docker compose up

# Terminal 2 — start frontend
cd PawPals-App/web
npm run dev
```

---

## How We Work

### Branching

- **`main`** — production-ready code. Never push directly to this.
- **`develop`** — integration branch. All feature branches merge here.
- **Feature branches** — where you do your work.

### Creating a feature branch

Always create your branch from `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

Example branch names:
- `feature/landing-page`
- `feature/pet-form`
- `feature/swipe-mode`
- `feature/event-board`

### Making commits

Write clear commit messages that say what you did:

```bash
git add .
git commit -m "Add pet creation form with breed dropdown"
git push origin feature/your-feature-name
```

### Opening a Pull Request

1. Push your branch to GitHub
2. Go to the repo on GitHub
3. Click "Compare & pull request"
4. Set the base branch to **develop** (not main)
5. Write a short description of what you built
6. Request a review from any team member 
7. Wait for approval before merging

### Weekly deadlines

- PRs must be submitted by **(We need to set a deadline for the weekly tasks)**
- We merge and review during our **(we need to pick a day a week to assign tasks for the week)**

---

## Project Structure

```
PawPals-App/
├── docker-compose.yml          # Starts Postgres, Redis, AI service
├── .gitignore
├── README.md
│
├── web/                         # Next.js application
│   ├── src/
│   │   ├── app/                 # Pages and API routes
│   │   │   ├── (auth)/          # Sign-in / sign-up pages
│   │   │   ├── dashboard/       # Home after login
│   │   │   ├── discover/        # Swipe + Map modes
│   │   │   ├── events/          # Community events
│   │   │   ├── profile/         # Owner + pet profiles
│   │   │   └── api/             # Backend API routes
│   │   ├── components/          # Reusable UI components
│   │   ├── lib/                 # Utilities (Prisma, Redis, etc.)
│   │   └── hooks/               # Custom React hooks
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── public/                  # Static assets
│   ├── Dockerfile
│   └── package.json
│
└── ai-service/                  # FastAPI AI microservice
    ├── app/
    │   ├── main.py              # FastAPI entry point
    │   ├── routers/             # API endpoints
    │   ├── services/            # Business logic
    │   └── models/              # Data schemas
    ├── Dockerfile
    └── requirements.txt
```

---

## Useful Commands

| Command | What it does | Run from |
|---------|-------------|----------|
| `docker compose up` | Starts Postgres, Redis, AI service | Project root |
| `docker compose down` | Stops all backend services | Project root |
| `npm run dev` | Starts Next.js dev server | `web/` |
| `npx prisma studio` | Opens visual database browser | `web/` |
| `npx prisma migrate dev --name describe_change` | Creates a new database migration | `web/` |
| `npx prisma generate` | Regenerates TypeScript types after schema changes | `web/` |
| `npx eslint .` | Runs the linter to check code quality | `web/` |

---

## Troubleshooting

**"docker compose up" fails or nothing starts**
- Make sure Docker Desktop is open and running
- Try `docker compose down` then `docker compose up` again

**"Cannot connect to database" or port 5432 errors**
- Make sure `docker compose up` is running in another terminal
- Check that nothing else is using port 5432: `lsof -i :5432`

**Prisma commands fail**
- Make sure you're in the `web/` folder, not the project root
- Make sure Docker is running (Prisma needs the database)

**"Module not found" errors in Next.js**
- Run `npm install` in the `web/` folder
- Run `npx prisma generate` if the error mentions Prisma

**AI service not responding at localhost:8000**
- Check the Docker terminal for error messages
- Try `docker compose down` then `docker compose up --build` to rebuild

**Git says I can't push to develop or main**
- You need to work on a feature branch. See the "How We Work" section above.
