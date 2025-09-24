# Project structure — Modern Project/Task Management App

(Next.js + TypeScript + Tailwind + shadcn/ui + Prisma)

Below is a practical, interview-friendly **reference blueprint** you can keep beside you while building. It lists folders, pages, components, hooks, API routes, Prisma models, DB columns, and other foundation pieces you’ll use repeatedly. No code — just a clean, actionable map.

---

# 1 — Top-level folder layout

```
/ (repo root)
├─ README.md
├─ next.config.js
├─ package.json
├─ tsconfig.json
├─ tailwind.config.js
├─ prisma/
│   ├─ schema.prisma
│   └─ migrations/
├─ .env
├─ public/
│   ├─ icons/
│   └─ images/
├─ src/
│   ├─ app/                    # Next.js App Router (or /pages if using pages router)
│   │   ├─ layout.tsx
│   │   ├─ globals.css
│   │   ├─ page.tsx            # dashboard / root
│   │   └─ (other routes)/
│   ├─ components/
│   ├─ features/
│   ├─ hooks/
│   ├─ lib/
│   ├─ services/
│   ├─ prisma/                 # prisma client wrapper
│   ├─ styles/
│   └─ types/
└─ scripts/
```

---

# 2 — Pages / Routes (App Router style)

```
/
  - GET: Dashboard overview (charts, recent activity)
  - show sample project on first-time

/projects
  - GET: Projects list
  /[projectId]
    - GET: Project page (board view)
    /board                      # Kanban board
    /calendar                   # Calendar view
    /settings                   # Project-level settings

/tasks
  /[taskId]                     # Task detail (modal or page)

/auth
  /login
  /register
  /forgot-password

/profile
  - user settings, theme controls

/api
  /auth/*                       # register/login/refresh
  /projects/*
  /columns/*
  /tasks/*
  /comments/*
  /attachments/*
  /analytics/*
```

---

# 3 — Components (atomic → composite)

Organize inside `src/components/` by domain or atomic/composite:

## Atomic / primitives

- `Button/`

  - Button.tsx (shadcn wrapper)

- `Icon/` (re-export lucide icons used)
- `Input/` (TextInput, Textarea)
- `Select/`, `MultiSelect/`
- `Avatar/`
- `Badge/` (TagBadge)
- `Tooltip/`
- `Modal/` (Dialog)
- `Toast/` / `useToast` (shadcn pattern)
- `Skeleton/` (for lazy loading)
- `Spinner/`

## Molecules / small composites

- `TaskCard/`

  - task card preview (compact)
  - props: `task`, `onOpen`

- `ColumnHeader/`

  - title, count, add task button, column menu (edit/delete)

- `TaskForm/`

  - create/edit fields (title, desc, tags, assignee, dueDate, priority, estimate)

- `TagPill/`
- `PriorityPill/`
- `UserAvatarList/` (assignees)
- `ConfirmDialog/`

## Organisms / pages

- `Board/`

  - `ColumnList` (horizontal scroll container)
  - `Column` (droppable), contains `TaskList`
  - `TaskList` (virtualized when needed)

- `TaskDetailPanel/` (right slideover) or `TaskModal/`
- `ProjectHeader/` (title, actions, switch view)
- `ProjectListItem/`
- `DashboardCards/` (small widgets)
- `CalendarView/` (monthly/weekly)
- `Analytics/Charts` (line, pie, bar components) — use Recharts/Visx
- `ProfileMenu/` (theme toggle, logout)
- `AuthForms/` (login/register)

## Utility or UI wrappers for shadcn

- `ShadcnButton` etc. — keep consistent design tokens & props.

---

# 4 — Features area (domain directory)

Use `src/features/` to group domain logic & components:

```
src/features/
  projects/
    ProjectList.tsx
    ProjectPage.tsx
    ProjectBoard/
      Board.tsx
      Column.tsx
      TaskCard.tsx
      TaskModal.tsx
  tasks/
    TaskForm.tsx
    TaskDetail.tsx
  calendar/
    CalendarView.tsx
  analytics/
    DashboardCharts.tsx
  auth/
    LoginForm.tsx
    RegisterForm.tsx
```

---

# 5 — Hooks (reusable logic)

Place in `src/hooks/`:

- `useAuth()` — auth state & helpers
- `useUser()` — current user data
- `useProjects()` — fetch & cache projects
- `useProject(projectId)` — project-specific store
- `useTasks()` / `useTask(taskId)` — task CRUD & optimistic updates
- `useDragDrop()` — drag & drop helpers wrapping @dnd-kit
- `useDebounce()` — utility
- `useViewport()` — responsive helpers
- `useModal()` — modal state helper
- `useToast()` — for notifications

---

# 6 — Services & API clients

`src/services/`:

- `apiClient.ts` — fetch wrapper with JWT handling, refresh tokens, error handling
- `auth.service.ts` — login/register/logout
- `projects.service.ts` — projects CRUD & prefetch helpers
- `columns.service.ts` — column reorder / CRUD
- `tasks.service.ts` — task CRUD/move/bulk reorder
- `comments.service.ts` — comments CRUD
- `attachments.service.ts` — upload / delete
- `analytics.service.ts` — aggregated endpoints (for charts)

Use React Query / TanStack Query for data fetching and caching (recommended).

---

# 7 — State management

Two-level approach:

1. **React Query (TanStack)** — server state: projects, tasks, columns, analytics. Use for caching, invalidation, background refetch.
2. **Zustand or local Context** — client-only, ephemeral UI state:

   - currentProjectId
   - openTaskId
   - UI preferences (sidebar collapsed)
   - drag state (if needed)

Keep optimistic updates in services; rollback on error.

---

# 8 — DB Schema (Prisma) — models + fields

Put in `prisma/schema.prisma`. Example model skeleton:

```prisma
model User {
  id          String    @id @default(uuid())
  name        String
  email       String    @unique
  password    String?   // nullable if using OAuth
  avatarUrl   String?
  settings    Json?
  createdAt   DateTime  @default(now())
  projects    Project[] @relation("UserProjects")
  comments    Comment[]
}

model Project {
  id          String   @id @default(uuid())
  ownerId     String
  title       String
  description String?
  color       String?    // theme color
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  columns     Column[]
  tasks       Task[]    // optional denormalization for queries
  owner       User      @relation(fields: [ownerId], references: [id])
}

model Column {
  id        String  @id @default(uuid())
  projectId String
  title     String
  position  Int
  tasks     Task[]
  project   Project @relation(fields: [projectId], references: [id])
}

model Task {
  id           String    @id @default(uuid())
  projectId    String
  columnId     String?
  title        String
  description  String?
  priority     String?   // enum preferred
  position     Int
  tags         String[]  // or a relation table Tag <-> Task
  assigneeId   String?
  dueDate      DateTime?
  estimateMins Int?
  attachments  Attachment[]
  comments     Comment[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  project      Project   @relation(fields: [projectId], references: [id])
  column       Column?   @relation(fields: [columnId], references: [id])
}

model Comment {
  id        String  @id @default(uuid())
  taskId    String
  authorId  String
  body      String
  createdAt DateTime @default(now())
  task      Task     @relation(fields: [taskId], references: [id])
  author    User     @relation(fields: [authorId], references: [id])
}

model Attachment {
  id        String @id @default(uuid())
  taskId    String
  url       String
  filename  String
  size      Int
  task      Task   @relation(fields: [taskId], references: [id])
}
```

**Notes**

- Consider a `Tag` model if you want tag metadata (color, owner). Tagging as `String[]` is simpler for MVP.
- Use enums for `priority` (low, medium, high, urgent) if possible.
- Add indexes (e.g., on `projectId`, `columnId`, `assigneeId`) for performance.

---

# 9 — API routes (Next.js /app/api or /pages/api)

Examples (path → purpose):

```
/api/auth/register        POST
/api/auth/login           POST
/api/auth/refresh         POST

/api/projects             GET, POST
/api/projects/:id         GET, PATCH, DELETE

/api/projects/:id/columns POST
/api/columns/:id          PATCH, DELETE

/api/projects/:id/tasks   POST
/api/tasks/:id            GET, PATCH, DELETE
/api/tasks/:id/move       PATCH   (toColumnId, position)

/api/tasks/:id/comments   POST
/api/comments/:id         DELETE

/api/attachments/upload   POST (signed url or direct upload)
```

Implementation tips:

- Return minimal payloads for list endpoints (avoid overfetch).
- Provide `GET /api/projects/:id?include=columns,tasks` convenience param for single-page load.
- Make `move` endpoint atomic: adjust positions in both source and target columns in a DB transaction.

---

# 10 — UI / Design tokens (Tailwind + shadcn)

- `tailwind.config.js`:

  - extend color palette with project tokens (primary, accent, danger, success)
  - set CSS variables for light/dark tokens if you want runtime theming

- `src/styles/`:

  - `tokens.css` (CSS variables for spacing, radii, shadows)
  - `typography.css` (type scale)

- Use shadcn/ui components for primitives (Dialog, Tabs, Toast, etc.). Wrap them to fit tokens.

Example tokens (semantic):

- `--color-bg`
- `--color-surface`
- `--color-primary`
- `--color-muted`
- `--radius-base`
- spacing scale: xs, sm, md, lg

---

# 11 — UX Patterns & Keyboard Shortcuts

- Keyboard: `n` → new task, `f` → focus search, `/` → quick search, `esc` → close modals
- Drag & Drop keyboard accessibility: arrow keys to move selected task (implement with @dnd-kit accessible utilities)
- Focus management: modal opens focus on first field; return focus on close

---

# 12 — Testing layout

- `src/__tests__/components/TaskCard.test.tsx` (Jest + RTL)
- `cypress/` for e2e:

  - `projects.spec.ts` (create project, add task, drag & drop)
  - `auth.spec.ts` (login+logout flow)

- Add a `test` script to package.json and a CI job to run tests.

---

# 13 — Dev tooling / Scripts

- `yarn dev` — Next dev
- `yarn build` — Next build
- `yarn prisma:migrate`
- `yarn lint` — ESLint + Prettier
- `yarn test` — jest
- `yarn cypress` — e2e

---

# 14 — Deployment quick notes

- Use Vercel: Next + shadcn fits well.
- Store DB (Postgres) on Railway / Supabase / Render.
- Store environment variables in Vercel: DATABASE_URL, NEXTAUTH_URL (if using NextAuth), JWT_SECRET, S3 keys.
- Use GitHub Actions if you need custom CI (run tests, lints, then deploy).

---

# 15 — README / Portfolio talking points (short bullets to copy)

- Tech used: Next.js, TypeScript, Tailwind, shadcn/ui, Prisma, Postgres, @dnd-kit, Recharts
- Key engineering highlights: optimistic drag-and-drop, virtualized columns, accessible keyboard nav, theme & design system, charts & analytics
- What you engineered: component library, API contract, DB schema & migrations, CI/CD, testing (unit + E2E)
- UX highlights: responsive board, micro-interactions, accessible DnD, smooth mobile experience

---

If you want, next I can:

- produce a **copy-paste Prisma schema** (ready for your `schema.prisma`) with enums and relations,
- or a **detailed component list** with props (TypeScript interfaces) for TaskCard, Column, Board, TaskModal, etc., to copy straight into your project planning.

Which of those two should I produce for you now?
