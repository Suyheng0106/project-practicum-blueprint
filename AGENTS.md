# Agent Instructions

This is a solo Bachelor capstone monorepo. The student's planning documents in `context/` are the source of truth. Read the relevant ones before doing any work.

## Context, in reading order

1. `README.md`: project summary and current progress
2. `context/phase-01/`: the problem, users and domain terms
3. `context/phase-02/`: scope (MoSCoW matrix) and user journeys
4. `context/phase-03/`: tech stack, architecture, database design and API contracts
5. `context/phase-04/`: screens and design tokens
6. `context/phase-05/` to `context/phase-08/`: implementation, testing and thesis records, once they exist

## Rules

- Never edit anything in `template/`. It belongs to the advisor.
- Only build features listed in the MoSCoW matrix, following its priority rules. Won't-Haves and unlisted features need a scope change entry first.
- Implement endpoints exactly as the API contracts specify. If a contract must change, update the contract document first.
- An endpoint must pass in the API test collection (`api-specs/`) before any screen uses it.
- Use the domain terms from Phase 1.1 for names in code, the database and the UI.
- Never commit secrets. Real values go in git-ignored `.env` files; keep `.env.example` up to date.
- After finishing a task, update the matching tracker in `context/` and the Progress section of `README.md`.

## Stack and commands

- **Backend:** Node.js (v22.x), Express (v4.x), TypeScript (v5.x), Prisma ORM (v5.x)
- **Database:** PostgreSQL 16 (via Docker Compose)
- **Clients:** Flutter (v3.41.x) with Dart (Candidate Mobile) & React (v18.x) + Vite + TypeScript (Employer Web Portal)
- **Authentication:** JWT with bcrypt (`Authorization: Bearer <token>`)
- **API Spec & Testing:** Postman collection in `api-specs/`
- **Conventions:** API on port 8000, route prefix `/api/v1`, health check `GET /api/v1/health`

### Planned Commands (from Phase 5 onward)
- **Start database:** `docker compose up -d`
- **Backend install:** `cd backend && npm install`
- **Database migrate & seed:** `cd backend && npx prisma migrate dev && npx prisma db seed`
- **Run API (port 8000):** `cd backend && npm run dev`
- **Run API tests:** Execute Postman collection in `api-specs/`
- **Employer web portal install:** `cd web && npm install`
- **Run employer web portal:** `cd web && npm run dev`
- **Mobile client install:** `cd mobile && flutter pub get`
- **Run mobile client:** `cd mobile && flutter run`
