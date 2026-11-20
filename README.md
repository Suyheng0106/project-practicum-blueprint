# DevPath

Bachelor of Computer Science — Individual Capstone

| | |
|---|---|
| Student | [STUDENT INPUT: name and student ID] |
| Advisor | [STUDENT INPUT] |
| Term | [STUDENT INPUT] |
| Pitch | DevPath connects IT and Computer Science candidates with entry-level tech roles, automatically analyzing their technical skill gaps to match them exclusively with beginner IT and software opportunities. |

First time here? Read the guide: [template/README.md](template/README.md)

## Progress

Update this section whenever you work on a phase. Your advisor reads it to follow your progress.

| | |
|---|---|
| Now working on | Phase 6 — Frontend Client & Integration |
| Blockers | None |
| Last updated | 2026-11-20 |

| Phase | Planned due | Status | Submitted on |
|---|---|---|---| 
| 1. Domain & Problem Teardown | | Submitted | 2026-10-16 |
| 2. Scope, Logic & MoSCoW | | Submitted | 2026-10-16 |
| 3. Architecture, ERD & API Planning | | Submitted | 2026-11-03 |
| 4. UI/UX & Figma Design | | Submitted | 2026-11-17 |
| 5. Backend Core & API Implementation | | Submitted | 2026-11-20 |
| 6. Frontend Client & Integration | | In progress | |
| 7. QA, Bug Fixes & Test Report | | Not started | |
| 8. Code Freeze, Final Report & Defense | | Not started | |

Status values: Not started · In progress · Submitted · Rework needed

## Links

| Item | Link |
|---|---|
| Figma file | https://www.figma.com/design/otuXkH2lhb0nVRzsNo5uY7?node-id=13-2 |
| Figma prototype | https://www.figma.com/proto/otuXkH2lhb0nVRzsNo5uY7?node-id=13-2&scaling=scale-down |
| Alpha demo video | |
| Thesis | |
| Defense slides | |

## How to Run

1. **Start Database:**
   ```bash
   docker compose up -d
   ```
2. **Install Backend Dependencies:**
   ```bash
   cd backend && npm install
   ```
3. **Run Migrations & Seed Initial Data:**
   ```bash
   cd backend && npx prisma migrate dev && npx prisma db seed
   ```
4. **Start Backend API (Port 8000):**
   ```bash
   cd backend && npm run dev
   # Or build and start: npm run build && npm start
   ```
5. **Run Automated API Verification Suite (41 Tests):**
   ```bash
   cd backend && npx ts-node tests/api_verification.ts
   ```
6. **Check Service Health:**
   ```bash
   curl http://localhost:8000/api/v1/health
   ```

## Repository Layout

| Path | Contents |
|---|---|
| `template/` | Guide and phase templates from the advisor (do not edit) |
| `context/` | My completed phase documents and evidence |
| `backend/` | Backend code |
| `mobile/` | Client app code (Candidate) |
| `web/` | Web portal code (Employer) |
| `api-specs/` | API test collection |
| `AGENTS.md` | Instructions for AI coding assistants |
