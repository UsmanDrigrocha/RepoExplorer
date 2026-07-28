# Repo Explorer

A full-stack GitHub repository explorer. Search any GitHub user, browse their
repositories, and drill into a repo's languages and recent commit history —
built on top of the public [GitHub REST API](https://docs.github.com/en/rest).

Built as a take-home engineering exercise to demonstrate external API
integration, backend design (caching, rate-limit handling, validation), and
clean UI implementation on top of Next.js.

## Demo

**Demo:** [Watch the demo video](https://github.com/UsmanDrigrocha/RepoExplorer/raw/main/RepoExplorerDemo.mp4)

## Features

- 🔍 Debounced, keyboard-navigable user search with a live results dropdown
- 🧑 User profile page — avatar, bio, followers/following, company, location
- 📦 Repository grid with sorting (updated / created / pushed / name) and pagination
- 📊 Per-repo language breakdown (stacked bar, GitHub-style language colors)
- 📜 Paginated recent commit history per repo
- ⚡ Server-side response caching (in-memory LRU, 60s TTL) to conserve GitHub's rate limit
- 🚦 Rate-limit-aware error handling — GitHub's `x-ratelimit-*` headers are parsed and forwarded
- 🧵 Request validation with Zod on every API route
- 🌙 Light/dark theme (system-aware, toggleable)
- 💥 Proper loading, empty, 404, and error states on every route
- 🧪 Unit + component tests (Vitest + Testing Library)
- 🐳 Dockerfile for containerized deployment
- ⚙️ CI pipeline (lint, format check, test, build) via GitHub Actions

## Tech stack

| Layer      | Choice                                           |
| ---------- | ------------------------------------------------ |
| Framework  | Next.js 16 (App Router, Turbopack)               |
| Language   | TypeScript                                       |
| Styling    | Tailwind CSS v4 + shadcn/ui (Base UI primitives) |
| Data       | TanStack Query (client), native `fetch` (server) |
| Validation | Zod                                              |
| Testing    | Vitest, Testing Library                          |
| Icons      | lucide-react                                     |

## Architecture

This app deliberately has **two layers** talking to GitHub, not one, to
demonstrate a real backend-for-frontend (BFF) pattern rather than calling a
third-party API straight from the browser:

```
Browser (client components)
   │  fetch("/api/github/...")
   ▼
Next.js Route Handlers            ← our backend
   │  - Zod-validate query params
   │  - Check in-memory LRU cache
   │  - Normalize errors → {error:{message,kind}}
   │  - Forward GitHub rate-limit headers
   ▼
lib/github/client.ts (server-only)
   │  - Adds auth header if GITHUB_TOKEN is set
   │  - Zod-validates GitHub's response shape
   ▼
GitHub REST API
```

Server Components (e.g. `app/users/[username]/page.tsx`) call
`lib/github/client.ts` **directly** for the first paint — no HTTP round-trip
to our own API needed during SSR. Client Components (search-as-you-type,
"load more" pagination, sort changes) go through `/api/github/*` via
TanStack Query hooks in `src/hooks/use-github.ts`. Both paths share the same
validated GitHub client and cache, so there's one source of truth for
correctness and one place rate limits are enforced.

### Key directories

```
src/
├── app/
│   ├── api/github/            # Backend route handlers (the "API" in the assignment)
│   │   ├── search/users/
│   │   ├── users/[username]/
│   │   ├── users/[username]/repos/
│   │   └── repos/[owner]/[repo]/{,languages,commits}/
│   ├── users/[username]/      # User profile page (SSR)
│   └── users/[username]/[repo]/  # Repo detail page (SSR)
├── lib/
│   ├── github/
│   │   ├── client.ts          # Server-only GitHub API client
│   │   ├── schemas.ts         # Zod schemas / types for GitHub payloads
│   │   ├── cache.ts           # In-memory LRU response cache
│   │   ├── errors.ts          # GithubApiError — one error shape for the app
│   │   ├── params.ts          # Query-param validation helpers
│   │   └── respond.ts         # Consistent JSON success/error envelopes
│   ├── api/fetcher.ts         # Client-side fetch wrapper for /api/github/*
│   ├── format.ts              # Number/date formatting helpers
│   └── language-colors.ts     # GitHub-style language color map
├── hooks/use-github.ts        # TanStack Query hooks (search, user, repos, commits, languages)
└── components/
    ├── features/               # Feature components (search bar, repo card, commit list, ...)
    ├── layout/                 # Header, footer, theme toggle
    └── ui/                     # shadcn/ui primitives
```

### API surface

All routes return `{ data: ... }` on success or `{ error: { message, kind } }`
on failure (`kind` ∈ `not_found | rate_limited | validation | upstream | unknown`),
with `x-ratelimit-*` and `x-cache: HIT|MISS` response headers.

| Route                                               | Description                         |
| --------------------------------------------------- | ----------------------------------- |
| `GET /api/github/search/users?q=&page=`             | Search GitHub users                 |
| `GET /api/github/users/:username`                   | User profile                        |
| `GET /api/github/users/:username/repos?sort=&page=` | User's public repos (sort/paginate) |
| `GET /api/github/repos/:owner/:repo`                | Repo details                        |
| `GET /api/github/repos/:owner/:repo/languages`      | Repo language byte counts           |
| `GET /api/github/repos/:owner/:repo/commits?page=`  | Repo commit history (paginated)     |

### Design decisions

- **Caching**: a process-local LRU cache (60s TTL) sits in front of every
  GitHub call. GitHub's unauthenticated limit is 60 requests/hour/IP, so
  avoiding redundant calls (re-viewing a profile, re-running the same search)
  matters more here than raw latency. At real scale this would move to Redis
  so it's shared across serverless instances — see Future improvements.
- **Rate-limit handling**: `x-ratelimit-remaining` is read from every GitHub
  response; a 403 with `remaining: 0` is mapped to our own `429` with a
  `Retry-After` header, so the client can show a clear "try again in Xs"
  message instead of a generic failure.
- **Validation everywhere**: both the query params coming into our routes and
  the JSON coming back from GitHub are parsed through Zod schemas. If GitHub
  ever changes its response shape, we fail loudly with a `422` instead of
  shipping `undefined`s into the UI.
- **SSR + CSR split**: initial page loads are server-rendered directly from
  the GitHub client (fast first paint, works without JS), while pagination,
  sorting, and search are client-side against our own API (no full page
  reload).

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
git clone <your-fork-url>
cd github-api-app
npm install
cp .env.example .env.local   # optional — see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable       | Required | Description                                                                                      |
| -------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `GITHUB_TOKEN` | No       | A GitHub personal access token (no scopes needed). Raises the rate limit from 60/hr to 5,000/hr. |

Create a token at <https://github.com/settings/tokens> if you plan to demo
this heavily — the app works without one, just with a much lower ceiling
before you start seeing `429`s.

### Scripts

```bash
npm run dev            # start dev server (Turbopack)
npm run build          # production build
npm run start           # run the production build
npm run lint             # ESLint
npm run format            # Prettier --write
npm run format:check      # Prettier --check
npm test                    # run unit/component tests (Vitest)
npm run test:coverage       # tests with coverage report
```

### Docker

```bash
docker build -t repo-explorer .
docker run -p 3000:3000 -e GITHUB_TOKEN=your_token repo-explorer
```

## Deployment

Recommended on Vercel (zero-config for Next.js, matches the
`output: "standalone"` build). To deploy your own copy:

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add `GITHUB_TOKEN` as an environment variable (optional but recommended).
4. Deploy.

The included `Dockerfile` also works on any container platform (Render,
Railway, Fly.io, etc.) if you'd rather not use Vercel.

**Live demo:** _add your deployment URL here_

## Future improvements

- Move the response cache to Redis (Upstash) so it's shared across
  serverless instances instead of being per-instance/per-cold-start.
- Add OAuth so authenticated users get a much higher personal rate limit
  automatically, instead of relying on a shared server-side token.
- Repo detail: contributor list, README preview, release history.
- E2E tests (Playwright) covering the search → profile → repo flow.
- OpenAPI/Swagger spec for the `/api/github/*` surface.
