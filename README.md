# Rafithub — Gym Website & Operations Platform

Next.js 14 (App Router, TypeScript) marketing website and full-stack gym operations platform for **Rafithub** (Kochadai, Madurai), backed by **Neon** (`postgres`, `auth`, `object-storage`, `realtime`) and **Prisma**.

## Implemented Features (Phases 1–4 & 6)

- **Public Marketing Site** (DB-backed via Prisma + cached Server Components):
  - `/` (Hero, Stats, BMI/Calorie Calculator with trial handoff, Plans, Trainers showcase, Gallery preview, Testimonials)
  - `/membership` (Active plans, PT add-ons, Enquire/Join form — defaults to `ENQUIRY` mode)
  - `/trainers` & `/trainers/[id]` (Preserves existing slugs including `/trainers/rajith` and `/trainers/sophiea`)
  - `/classes` (Class catalog + weekly schedule), `/gallery`, `/about`, `/contact` (with FAQs & Lead Capture), `/services`, `/privacy`, `/terms`
  - SEO: Canonical URLs normalized to `https://www.rafithub.com`, `robots.ts` (disallows `/admin/` and `/login`), dynamic `sitemap.ts`, JSON-LD `HealthClub` structured data from `SiteSettings`
- **Authentication & RBAC (`/login`, `/admin`)**:
  - **Neon Auth** (Managed Better Auth via `@neon/auth`) + Postgres `User` role mapping (`OWNER`, `ADMIN`, `RECEPTIONIST`, `TRAINER`)
  - Protected `/admin` routes via Next.js middleware + server-side `requireStaff()` checks on every page and Server Action
  - In-app password change form under `/admin/settings#change-password`
- **Admin CMS & Operations (`/admin`)**:
  - **Dashboard (`/admin`)**: Active/expired/new member KPIs, expiring in 7 days (with 1-click `wa.me` reminders), birthdays today, today/month revenue, Recharts analytics (6-month revenue, member growth, peak-hour check-ins), live leads feed (`@neon/realtime` when configured)
  - **Members (`/admin/members`, `/admin/members/[id]`)**: Search/filter/paginate, CRUD with optional S3 photo upload, soft delete, CSV dry-run + import, CSV export, assign/renew/freeze/unfreeze memberships, body measurements, and QR check-in pass
  - **Attendance Desk (`/admin/attendance`)**: Fast desk lookup & QR/code scanner input (`RAFITHUB:RH-0001` or `RH-0001`), automatic blocks on `EXPIRED` / `FROZEN` / `CANCELLED` members, check-out tracking
  - **Payments & Receipts (`/admin/payments`, `/admin/receipts/[paymentId]`)**: Manual Cash/UPI/Card collection, balance due tracking, CSV export, printable Save-PDF receipts, optional Resend receipt email
  - **Leads Pipeline (`/admin/leads`)**: Kanban + List views, WhatsApp links, follow-up notes, 1-click Convert to Member
  - **Website CMS (`/admin/cms`, `/admin/plans`, `/admin/trainers`, `/admin/classes`)**: Edit gym details, SEO, hero, stats, testimonials, gallery items, FAQs, plans, trainers, and class schedules with instant revalidation
  - **Reports & Audit (`/admin/reports`, `/admin/settings`)**: Financial/retention breakdown, staff user roles, audit logs
  - **Daily Expiry Cron (`/api/cron/expiry`)**: Configured in `vercel.json` (`0 3 * * *`) to auto-expire memberships and send expiry emails

> **Phase 5 (Online Razorpay Checkout)** is intentionally on hold until Razorpay KYC approval; `SiteSettings.checkoutMode` defaults to `ENQUIRY`.

## Local Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env.local` using `.env.example` (set `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`, `NEON_AUTH_COOKIE_SECRET`, `OWNER_EMAIL`, `OWNER_INITIAL_PASSWORD`).
3. Push schema & seed initial records + Owner account:
   ```bash
   npx prisma db push
   npx tsx --env-file=.env.local prisma/seed.ts
   ```
4. Optionally provision Neon managed object-storage & realtime keys after logging into Neon CLI:
   ```bash
   npx neon@latest login
   npx neon@latest deploy
   ```
5. Run checks & dev server:
   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run dev
   ```
