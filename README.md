# EduPulse LMS — Production-Ready SaaS Frontend

A modern, production-grade Learning Management System frontend built with:

- Next.js (App Router)
- TypeScript (strict)
- TailwindCSS
- shadcn/ui
- Jotai (auth state, persisted)
- RTK Query (server data layer)
- Axios (API client)
- Zod + React Hook Form (forms/validation)
- Recharts (analytics-ready)

## Highlights

- Role-based dashboards for ADMIN, INSTRUCTOR, STUDENT
- Protected routes and auth persistence (cookies + Jotai)
- Centralized API layer with RTK Query and axiosBaseQuery
- Feature-based modular architecture
- Cursor-based pagination pattern (merge + serializeQueryArgs)
- SaaS-grade UI with reusable shadcn components
- Clean loading, empty, and error states

## Folder Structure

```
src/
├─ app/
│  ├─ admin/
│  │  ├─ dashboard/page.tsx
│  │  └─ categories/page.tsx
│  ├─ instructor/
│  │  ├─ dashboard/page.tsx
│  │  ├─ courses/page.tsx
│  │  └─ courses/new/page.tsx
│  ├─ student/
│  │  ├─ dashboard/page.tsx
│  │  └─ courses/page.tsx
│  ├─ auth/
│  │  ├─ login/page.tsx
│  │  └─ register/page.tsx
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ ui/…
│  └─ layout/
│     ├─ DashboardShell.tsx
│     └─ RoleGuard.tsx
├─ features/
│  ├─ auth/
│  │  └─ authApi.ts
│  ├─ courses/
│  │  └─ coursesApi.ts
│  ├─ categories/
│  │  └─ categoriesApi.ts
│  ├─ analytics/
│  │  └─ analyticsApi.ts
│  ├─ enrollments/
│  │  └─ enrollmentsApi.ts
│  └─ users/
│     └─ usersApi.ts
├─ hooks/
│  └─ useAuth.ts
├─ lib/
│  ├─ axiosBaseQuery.ts
│  └─ store.ts
├─ redux/
│  └─ api/baseApi.ts
├─ state/
│  └─ auth.ts (Jotai persisted atom)
├─ types/
│  ├─ api.type.ts
│  └─ category.type.ts
└─ middleware.ts
```

## Environment

- NEXT_PUBLIC_API_URL: Base URL of the backend API (e.g., https://your-api.com/api/v1)
- Cookies used:
  - accessToken (JWT access)
  - role (user role)

## Setup

- Node.js 18+ recommended
- Install dependencies:

```bash
npm install
```

- Development:

```bash
npm run dev
```

- Typecheck + Lint:

```bash
npx tsc --noEmit && npm run lint
```

- Production build:

```bash
npm run build
```

## Auth Flow

- Login and refresh return a fixed response: `{ success, message, data }`
- Client unpacks `data` and persists:
  - Jotai atom: `authAtom` stores `user`
  - Cookies: `accessToken`, `role`
- Protected navigation:
  - RoleGuard gate-keeps pages with cookie fallback
  - Middleware guards route segments

## API Layer

- RTK Query baseApi for feature endpoints (`features/*/…Api.ts`)
- axiosBaseQuery:
  - Automatically attaches `Authorization` from cookies
  - Handles 401 by calling `/users/refresh-token` and retrying
  - Keeps server data in RTK Query cache only (no Redux slices)

## Cursor Pagination Pattern (Courses)

- Backend response:
  - `{ success: true, message: "...", data: { data: Course[], nextCursor } }`
- Client endpoint `getCoursesCursor`:
  - `transformResponse` unwraps `ApiResponse.data`
  - `serializeQueryArgs` keys cache by stable filters (limit/category/status)
  - `merge` appends unique items and updates `nextCursor`
  - `forceRefetch` when cursor changes
- UI supports "Load More" and is ready for infinite scroll

## Features

- Admin:
  - Categories: table, create/edit/delete dialogs
  - Analytics: summary, revenue, top courses (Recharts-ready)
- Instructor:
  - Courses: create, list with filters, publish/unpublish
- Student:
  - Courses: listing with category filter, enroll

## UI/UX

- shadcn/ui components (Button, Card, Table, Dialog, Dropdown, Select, Badge)
- Loading spinners and skeleton-ready
- Empty and error states
- Responsive layout and SaaS-grade dashboards

## Conventions

- Feature-based modular structure
- Server data via RTK Query only
- Global app state via Jotai (auth)
- Strict TypeScript and Zod validation
- Clean, minimal files; no unused boilerplate

## Scripts

- `npm run dev`: Start dev server
- `npm run build`: Production build
- `npm run lint`: ESLint

## Notes

- Middleware deprecation warning suggests migrating to `proxy` when ready
- Turbopack is used by Next.js 16+
