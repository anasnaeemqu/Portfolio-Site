# replit.md

## Overview

This is a personal portfolio website for a mobile developer (iOS & Flutter). It's a full-stack TypeScript application with a React frontend and Express backend, backed by PostgreSQL. The app displays a developer's profile, skills, projects, work experience, education, and includes a contact form. All portfolio content is stored in the database and served via API endpoints — nothing is hardcoded in the UI. The database is auto-seeded with default portfolio data on first run.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) — single-page app with a home page and 404 fallback
- **State/Data fetching**: TanStack React Query for server state management. Custom hooks (`use-portfolio`, `use-skills`, `use-projects`, `use-experiences`, `use-educations`, `use-profile`) wrap fetch calls and validate responses with Zod
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives, styled via Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Animations**: Framer Motion for page/section entrance animations
- **Forms**: React Hook Form with Zod validation via `@hookform/resolvers`
- **SEO**: Client-side `document.title` and meta tag manipulation (no SSR)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (run via `tsx`)
- **API Design**: REST endpoints defined in `shared/routes.ts` as a typed API contract (method, path, Zod input/response schemas). Both client and server import from this shared definition
- **Database**: PostgreSQL via `node-postgres` (pg) with Drizzle ORM
- **Schema**: Defined in `shared/schema.ts` using Drizzle's `pgTable` helpers. Tables: `profiles`, `skills`, `projects`, `experiences`, `educations`, `contactMessages`
- **Storage Layer**: `server/storage.ts` implements `IStorage` interface with `DatabaseStorage` class — all DB access goes through this layer
- **Auto-seeding**: `server/routes.ts` seeds the database with default portfolio data if no profile exists
- **Dev Server**: Vite dev server is integrated as Express middleware during development (HMR via `server/vite.ts`)
- **Production**: Client is built to `dist/public`, server is bundled with esbuild to `dist/index.cjs`

### Shared Code (`shared/`)
- `schema.ts` — Drizzle table definitions, Zod insert schemas, and TypeScript types (used by both client and server)
- `routes.ts` — API route contract with paths, methods, Zod input/output schemas, and helper functions like `buildUrl`

### Build Process
- `script/build.ts` handles production builds: Vite builds the client, esbuild bundles the server
- Server dependencies in an allowlist are bundled to reduce cold start times; others are treated as external

### Key Scripts
- `npm run dev` — Development with HMR
- `npm run build` — Production build
- `npm run start` — Run production build
- `npm run db:push` — Push Drizzle schema to PostgreSQL
- `npm run check` — TypeScript type checking

## External Dependencies

### Database
- **PostgreSQL** — Required. Connection via `DATABASE_URL` environment variable. Used with Drizzle ORM and `node-postgres` driver
- **Drizzle Kit** — Schema migrations via `drizzle-kit push` (migrations output to `./migrations`)
- **connect-pg-simple** — PostgreSQL session store (available but session auth not actively used for the portfolio)

### Key NPM Packages
- **Frontend**: React, Vite, Wouter, TanStack React Query, Framer Motion, shadcn/ui (Radix UI + Tailwind CSS + class-variance-authority), React Hook Form, Zod, Lucide icons
- **Backend**: Express 5, Drizzle ORM, pg (node-postgres), Zod
- **Shared**: drizzle-zod (generates Zod schemas from Drizzle tables)

### Replit-specific
- `@replit/vite-plugin-runtime-error-modal` — Runtime error overlay in development
- `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-dev-banner` — Dev-only Replit integration plugins

### Fonts (External CDN)
- Google Fonts: Space Grotesk, Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter