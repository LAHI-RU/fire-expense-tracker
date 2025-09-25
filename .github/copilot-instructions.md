# Copilot Instructions for Fire Expense Tracker

## Project Overview

- **Stack:** Next.js (App Router), React, TypeScript, MySQL, pnpm
- **Purpose:** Track expenses, incomes, employees, and projects with analytics and voice input features.
- **Architecture:**
  - `app/` contains Next.js pages and API routes (RESTful, file-based routing)
  - `components/` holds reusable UI and form components, including voice input widgets
  - `lib/` provides utility modules (e.g., `auth.ts`, `mysql.ts`)
  - `scripts/` contains SQL for DB schema and seed data

## Key Patterns & Conventions

- **API routes:** Located in `app/api/*`, use RESTful conventions (CRUD for resources like employees, expenses, etc.)
- **Data access:** Use `lib/mysql.ts` for DB queries; avoid direct DB calls in UI components
- **Forms:** UI forms (e.g., `expense-form.tsx`, `employee-form.tsx`) use controlled components and may support voice input
- **Type safety:** Shared types in `types/` and explicit TypeScript interfaces throughout
- **Styling:** Global styles in `app/globals.css` and `styles/globals.css`; component styles via CSS modules or inline
- **State:** Prefer React hooks (`hooks/`) for local state and effects

## Developer Workflows

- **Install:** `pnpm install`
- **Dev server:** `pnpm dev` (Next.js)
- **DB setup:** Run SQL scripts in `scripts/` (see README)
- **Environment:** Configure `.env.local` for DB credentials
- **Testing:** No dedicated test folder; manual testing via dev server
- **Debugging:** Use browser dev tools and inspect API route responses

## Integration Points

- **Voice input:** Components like `voice-input.tsx`, `voice-textarea.tsx` integrate speech recognition
- **Authentication:** Handled via API routes in `app/api/auth/*` and utilities in `lib/auth.ts`
- **Analytics:** Dashboard and charts in `app/analytics/` and `components/analytics-charts.tsx`

## Examples

- To add a new resource (e.g., "budgets"), create API routes in `app/api/budgets/`, UI forms in `components/`, and update DB schema in `scripts/`
- For DB queries, import and use functions from `lib/mysql.ts` in API routes only
- For new UI features, build in `components/` and compose in `app/*/page.tsx`

## References

- See `README.md` for setup, build, and deployment details
- SQL schema and seed: `scripts/01-create-database-schema.sql`, `scripts/02-seed-initial-data.sql`
- Authentication: `app/api/auth/*`, `lib/auth.ts`
- Analytics: `app/analytics/`, `components/analytics-charts.tsx`
- Voice input: `components/voice-input.tsx`, `components/voice-textarea.tsx`

---

For unclear patterns or missing documentation, ask for clarification or request examples from maintainers.
