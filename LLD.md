# Low-Level Design (LLD)

## Tech Stack (recommended)

- Frontend: React + TypeScript, Vite or Next.js (app/router optional)
- Styling: Tailwind CSS + CSS variables for theming
- State: Zustand (simple) or Redux Toolkit (scale)
- Drag & Drop: @dnd-kit (modern, accessible)
- Charts: Recharts or Visx (for dashboard)
- Backend: Node.js + Express + Prisma
- DB: PostgreSQL (SQLite for dev)
- Auth: JWT + refresh tokens (or Supabase Auth)
- Testing: Jest + React Testing Library; Cypress for E2E

---

## Data Model (Prisma-like / JSON)

### User

```ts
type User = {
  id: string; // uuid
  name: string;
  email: string;
  passwordHash?: string; // if self-hosted
  avatarUrl?: string;
  createdAt: string;
  settings: {
    theme: "light" | "dark" | "system";
  };
};
```

### Project

```ts
type Project = {
  id: string;
  ownerId: string; // user id
  title: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt?: string;
};
```

### Column (Kanban column)

```ts
type Column = {
  id: string;
  projectId: string;
  title: string; // e.g., Backlog, Todo, Doing, Done
  position: number; // ordering
};
```

### Task / Card

```ts
type Task = {
  id: string;
  projectId: string;
  columnId?: string; // for Kanban
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  tags: string[]; // tag ids or names
  assigneeId?: string;
  dueDate?: string;
  estimateMinutes?: number;
  attachments?: Attachment[];
  commentsCount?: number;
  subtasks?: Subtask[];
  position: number; // ordering inside column
  createdAt: string;
  updatedAt?: string;
};
```

### Comment, Attachment, Subtask (brief)

```ts
type Comment = {
  id: string;
  taskId: string;
  authorId: string;
  body: string;
  createdAt: string;
};
type Attachment = { id: string; url: string; filename: string; size: number };
type Subtask = {
  id: string;
  taskId: string;
  title: string;
  done: boolean;
  position: number;
};
```

---

## API Design (REST examples)

### Auth

- `POST /api/auth/register` {name,email,password} → 201 + {user, token}
- `POST /api/auth/login` {email,password} → 200 + {token, refreshToken}
- `POST /api/auth/refresh` {refreshToken} → 200 + {token}

### Projects

- `GET /api/projects` → \[Project]
- `POST /api/projects` {title, description} → Project
- `GET /api/projects/:id` → Project + columns + tasks
- `PATCH /api/projects/:id` → Project
- `DELETE /api/projects/:id`

### Columns

- `POST /api/projects/:projId/columns` {title, position} → Column
- `PATCH /api/columns/:id` {title, position} → Column
- `DELETE /api/columns/:id`

### Tasks

- `POST /api/projects/:projId/tasks` {title, columnId, position, ...} → Task
- `PATCH /api/tasks/:id` {...} → Task
- `PATCH /api/tasks/:id/move` {toColumnId, toPosition} → Task (for efficient move)
- `DELETE /api/tasks/:id`
- `GET /api/tasks/:id/comments` etc.

Responses should include minimal/necessary data to avoid overfetching. Provide endpoints for bulk moves/ordering to reduce chattiness.

---

## Frontend Architecture

### Folder structure (suggested)

```
/src
  /components    // reusable UI components (Button, Modal, Card)
  /features
    /projects
      /ProjectBoard
      /ProjectList
    /tasks
      TaskCard.tsx
      TaskDetail.tsx
    /calendar
  /hooks
  /lib           // api clients, utils (date helper)
  /store         // Zustand or Redux slices
  /pages         // route-level components
  /styles        // global styles, tailwind config
  /services      // api service wrappers
```

### Component tree (Project Board)

```
ProjectPage
 ├─ BoardHeader (project title, actions)
 ├─ BoardToolbar (filters, search, view toggle)
 ├─ Board (horizontal scroll)
    ├─ Column (draggable droppable)
        ├─ ColumnHeader (title, count, menu)
        ├─ TaskList (droppable area)
            ├─ TaskCard (draggable)
                ├─ Badge (tags)
                ├─ PriorityIndicator
```

### State management

- Use local component state for ephemeral UI.
- Global store for user, current project, global filters, selected task modal.
- Keep optimistic UI for drag-drop and updates; rollback if API fails.

Zustand store example:

```ts
type Store = {
  user?: User;
  projects: Project[];
  currentProject?: Project;
  openTaskId?: string | null;
  setOpenTask: (id?: string) => void;
  moveTask: (
    taskId: string,
    toColumnId: string,
    toPos: number
  ) => Promise<void>;
  // ...fetch & sync actions
};
```

---

## Drag & Drop Behavior (detailed)

- Use `@dnd-kit/core` for accessibility + mobile support.
- On drag start: create a drag overlay (rendering the task card as overlay).
- On drag end: compute `toColumnId` and `toPosition`. Optimistically update local state (reorder arrays), then call `POST /api/tasks/:id/move`.
- If API returns error: rollback to previous ordering and show toast.

Edge cases:

- Moving between projects: confirm if allowed.
- Large boards: virtualize lists (react-window) to avoid rendering 1000s of cards.

---

## Task Detail Modal (UX)

- Open on click (modal or right-side panel on wider screens)
- Tabs: Details | Comments | Activity | Attachments
- Inline editing: clicking field turns it into input; save on blur or Enter
- Autosave drafts: debounce saves to server; cancel button reverts
- Accessibility: focus trap inside modal; Esc closes; keyboard shortcuts (N for new task)

---

## Performance Considerations

- Virtualize long lists (react-window) inside columns when > \~50 items.
- Memoize TaskCard; pass primitive props only.
- Use CSS transform/opacity for hover/drag animations. Avoid animating box-shadow.
- Use code-splitting: load calendar & charts lazily.
- Debounce search and filter operations client-side.
- Batch reorder updates — use a single API call for multiple reorder ops when dragging many.

---

## Security

- Validate all user inputs server-side.
- Sanitize rich text (if supporting HTML in description/comments) — use markdown + sanitization.
- Rate-limit sensitive endpoints (auth, file uploads).
- Secure file upload: scan or restrict file types & sizes.

---

## Accessibility (must-haves)

- Kanban: columns and tasks accessible via keyboard (arrow keys to navigate cards, Enter to open details).
- Proper ARIA roles: `role="list"`, `role="listitem"`, `aria-grabbed` while dragging.
- Focus management: move focus to modals and back after close.
- Color contrast and theme toggle.

---

## Testing Plan

- **Unit tests** for components (Jest + React Testing Library).

  - TaskCard rendering, inline edit behavior, priority indicator.

- **Integration tests** for store/actions (moveTask optimistic updates).
- **E2E tests** (Cypress) for:

  - Full flow: create project → add columns → create tasks → drag & drop → open task modal → add comment
  - Responsive flows (mobile create/edit)

- **Performance tests**: Lighthouse checks, interactions trace on low-end CPU.

---

## CI / CD & Deployment

- GitHub Actions:

  - Run lint, tests, build on PR.
  - Deploy to Vercel (frontend) + Render/Heroku for API.

- Environment:

  - NODE_ENV, DATABASE_URL, JWT_SECRET in secrets

- Backups + migrations with Prisma migrations.

---

## Example Sequence: Create → Drag → Persist

1. User creates Task in Column A (POST /api/tasks) → returns task with id & position.
2. User drags Task to Column B:

   - Frontend: optimistic update (remove from A, insert into B at pos)
   - Frontend: call `PATCH /api/tasks/:id/move` {toColumnId, toPosition}
   - Backend: updates `task.columnId`, reorders positions for tasks in both columns (transaction)
   - Backend returns updated tasks if needed; frontend reconciles.

---

## Minimal MVP Feature List (2-week build)

- Auth (email+password or mock)
- Create/List Projects
- Kanban board with 3 columns + create tasks
- Drag & drop reorder + move (optimistic)
- Task detail modal with description and tags
- Responsive layout + theme toggle
- Basic unit tests and deployment

## Mid & Polish (1–3 months)

- Calendar view & sync (drag to date)
- Comments, attachments, subtasks
- Dashboard charts (activity, completion rate)
- Invite/share project (permissions)
- E2E tests, accessibility audit, performance optimizations

---

## Example API Responses (small)

**GET /api/projects/\:id**

```json
{
  "project": { "id": "p1", "title": "Website Redesign", "color": "#6EE7B7" },
  "columns": [
    { "id": "c1", "title": "Backlog", "position": 0 },
    { "id": "c2", "title": "Todo", "position": 1 },
    { "id": "c3", "title": "Doing", "position": 2 }
  ],
  "tasks": [
    {
      "id": "t1",
      "title": "Hero design",
      "columnId": "c2",
      "position": 0,
      "priority": "high"
    },
    {
      "id": "t2",
      "title": "Set up analytics",
      "columnId": "c1",
      "position": 0,
      "priority": "medium"
    }
  ]
}
```

---

## Design / UI Hints to Show Off Skills

- Use a balanced type scale, clear hierarchy, and subtle shadows (static).
- Micro-interactions: add animation when a card is dropped (scale/flash) using transform.
- Consistent spacing & card sizes; show hover affordances.
- Use color tokens for priority and tag palettes; keep palette accessible.
- Provide onboarding tour (small) or sample project on first load to demo flows.

---
