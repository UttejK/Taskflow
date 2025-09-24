# TaskFlow — Modern Project & Task Management App

A modern **task management application** built with **Next.js, TypeScript, Tailwind CSS, and shadcn/ui**.  
TaskFlow helps you organize projects, manage tasks on a Kanban board, and track progress with a clean, responsive UI.

---

## 🚀 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router) + [TypeScript](https://www.typescriptlang.org/)
- **UI / Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + Radix Primitives
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (client state) + [TanStack Query](https://tanstack.com/query) (server state)
- **Database & ORM**: [Prisma](https://www.prisma.io/) + PostgreSQL (SQLite for local dev)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Charts**: [Recharts](https://recharts.org/) (for dashboards/analytics)
- **Auth**: JWT-based (future: NextAuth or Supabase optional)

---

## 📌 Features (Planned)

- ✅ User authentication (JWT)
- ✅ Create and manage projects
- ✅ Kanban board with drag-and-drop tasks
- ✅ Task details (description, priority, due date, tags)
- ✅ Responsive, mobile-first UI
- 🌙 Dark / Light theme support
- 📅 Calendar view for tasks
- 📊 Dashboard with charts & analytics
- 🗂 Comments, attachments, subtasks
- 🔄 Optimistic updates for smooth UX
- 🔒 Secure API with validation and access control

---

## 🛠️ Project Structure (high-level)

```

/src
/app          → Next.js routes (App Router)
/components   → Reusable UI (Button, Modal, Card, etc.)
/features     → Domain features (projects, tasks, calendar, auth)
/hooks        → Reusable React hooks
/lib          → Utils (API client, date helpers)
/services     → API service wrappers
/store        → Zustand store
/types        → TypeScript interfaces & models
/prisma
schema.prisma → Database schema

```

---

## 🗃️ Database Models (simplified)

- **User** → id, name, email, avatar, settings
- **Project** → id, ownerId, title, description, color
- **Column** → id, projectId, title, position
- **Task** → id, projectId, columnId, title, description, priority, tags, dueDate, assigneeId
- **Comment** → id, taskId, authorId, body
- **Attachment** → id, taskId, url, filename, size

---

## 📦 Getting Started

### Prerequisites

- Node.js (>=18)
- PostgreSQL (or SQLite for dev)
- Package manager: npm / yarn / pnpm

### Setup

```bash
# Clone repo
git clone https://github.com/your-username/taskflow.git
cd taskflow

# Install dependencies
npm install

# Setup database
npx prisma migrate dev

# Run dev server
npm run dev
```

App runs at `http://localhost:3000`

---

## 🔧 Development Notes

- Uses **shadcn/ui** for accessible, themeable components.
- **Zustand** handles local state (UI, modals, preferences).
- **TanStack Query** manages server data (projects, tasks).
- **Optimistic UI** updates make drag & drop snappy.
- Long task lists are **virtualized** for performance.

---

## 📅 Roadmap

- [ ] User authentication (basic JWT)
- [ ] Kanban board (MVP)
- [ ] Task modal with details
- [ ] Calendar integration
- [ ] Dashboard & charts
- [ ] File uploads (attachments)
- [ ] Comments & subtasks
- [ ] Team collaboration (invite users to projects)
- [ ] Deploy on Vercel + Railway/Supabase

---

## 🧪 Testing

- **Unit tests**: Jest + React Testing Library
- **E2E tests**: Cypress

Run tests:

```bash
npm run test
```

---

## 🚀 Deployment

Planned targets:

- **Frontend + API** → [Vercel](https://vercel.com/)
- **Database** → [Railway](https://railway.app/) / [Supabase](https://supabase.com/)
- **File storage** → S3-compatible storage (TBD)

---

## 📸 Screenshots (coming soon)

- Kanban Board
- Task Detail Modal
- Dashboard Charts

---

## 📝 License

MIT License — free to use, modify, and distribute.

---

## 🙌 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query/latest)
- [@dnd-kit](https://dndkit.com/)
- [Prisma](https://www.prisma.io/)
