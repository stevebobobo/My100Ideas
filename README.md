# My100Ideas

My100Ideas is a cloud-friendly web application for recording ideas, following their progress, and selectively sharing them as part of a portfolio or course.

This repository currently contains the initial application foundation only. It intentionally includes no real idea records.

## Architecture

- **Next.js + React + TypeScript** for the web application
- **Supabase** placeholders for PostgreSQL, authentication, and future file storage
- **Cloudflare Pages** compatible static export
- **GitHub** for source control and deployment integration

## Project structure

```text
src/
  app/                 Next.js pages and global styles
  lib/supabase/        Supabase browser client
  types/               Application models
supabase/
  migrations/          Database schema and row-level security
```

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and enter the public URL and anonymous key from a Supabase project.

3. Start the development server:

   ```bash
   npm run dev
   ```

The landing page builds without Supabase credentials. Credentials become necessary only when a feature calls `getSupabaseBrowserClient()`.

## Database setup

Create a Supabase project and apply the SQL migration in `supabase/migrations`. The migration creates the `ideas` table, status and visibility enums, rating constraints, timestamps, indexes, and row-level security policies.

Do not put a Supabase service-role key in this application or in Cloudflare Pages. Browser features must use the public anonymous key and rely on row-level security.

## Cloudflare Pages

Connect this GitHub repository to Cloudflare Pages and use:

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node.js version | `22` or newer |

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables when Supabase-backed features are enabled.

## Current scope

- Responsive placeholder landing page
- Cloudflare-compatible static build
- Supabase client placeholder
- Initial `Idea` TypeScript model
- Initial PostgreSQL schema with access policies

Authentication, administration screens, public idea pages, uploads, and real idea content are intentionally deferred.
