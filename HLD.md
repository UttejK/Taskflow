# High-Level Design (HLD)

## Goal

A fast, responsive task management app with:

- Kanban (drag & drop), List & Calendar views
- Task cards with tags, priority, due date, attachments, comments
- Project-level organization, dashboards, filters
- Polished UI/UX: animations, accessible components, theme support
- Persistent storage + optional realtime-lite updates

## System Components

1. **Frontend (React + TypeScript)**

   - Routes: / (dashboard), /projects/\:id, /calendar, /auth, /settings
   - State: local component state + global store (Zustand or Redux Toolkit)
   - UI: component library (Radix primitives + Tailwind + custom components)

2. **Backend API (Node.js/Express or Next.js API routes)**

   - RESTful JSON API + JWT auth (or Supabase/Firebase if you want BaaS)

3. **Database**

   - Postgres or SQLite (dev) via Prisma (ORM)

4. **File Storage** (optional)

   - S3-compatible or cloud storage for attachments OR Base64 small files for MVP

5. **Optional Realtime**

   - WebSocket / Pusher / Supabase Realtime for multi-user boards (nice to have)

6. **Infrastructure**

   - Vercel for frontend / backend, or Netlify + Heroku, CI via GitHub Actions

## Non-Functional Requirements

- Responsive (mobile → desktop)
- Smooth animation (use transform/opacity)
- Accessible (keyboard nav for Kanban, ARIA roles)
- Secure (JWT, input validation, rate limit)
- Testable (unit + E2E)

---
