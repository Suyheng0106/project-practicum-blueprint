# Phase 5.1 — Backend Sub-Deliverables

**Objective:** Build the backend in four small, verifiable pieces so that you always have something working, and record how to rebuild the database from scratch.

**Status:** Submitted · **Last updated:** 2026-11-20

## Done When

- [x] SD-1 to SD-4 are Done, each with a commit link
- [x] Every Must-Have endpoint passes in your API test collection (shown in Phase 5.2)
- [x] The runbook rebuilds the database from scratch (reset, migrate, seed) on a fresh clone
- [x] No real secrets are committed; `backend/.env.example` lists every variable

## 1. Sub-Deliverables

Finish them in order. Commit at the end of each one, and reference the SD in the commit message.

| SD | Scope | Done when | Endpoints | Target date | Status | Evidence (commit) |
|---|---|---|---|---|---|---|
| **SD-1** | Database setup & migrations | All Phase 3.3 tables are created by migrations, and test seed data loads | none | 2026-11-20 | Done | `backend/prisma/` (Docker + Prisma migrate) |
| **SD-2** | Authentication & authorization | Register, login, token issuing, and middleware that protects routes and checks roles | EP-01, EP-02, EP-03, EP-04 | 2026-11-20 | Done | `backend/src/routes/auth.routes.ts`, `backend/src/middleware/auth.ts` |
| **SD-3** | Core CRUD entities | Create/read/update/delete for the primary resources, with validation | EP-05, EP-06, EP-07, EP-08, EP-09, EP-10, EP-11, EP-13, EP-14, EP-15, EP-18, EP-19, EP-20, EP-23 | 2026-11-20 | Done | `backend/src/routes/` (`skills`, `candidate`, `jobs`, `employer`) |
| **SD-4** | Complex business logic & transactions | Calculations, multi-table writes in one transaction, status rules | EP-12, EP-16, EP-17, EP-21, EP-22 | 2026-11-20 | Done | Skill Gap Analyzer & Application transactions |

Status values: Not started · In progress · Done

## 2. Implementation Notes

For each sub-deliverable, note the decisions you made and anything that differs from the Phase 3 plan. If the contract changed, update the Phase 3 document first.

- **SD-1:** 
  - **Migration & ORM:** PostgreSQL 16 provisioned via `docker-compose.yml`, managed using Prisma ORM (v5.22.0). 
  - **Tables Created (14 models):** `users`, `candidate_profiles`, `candidate_projects`, `candidate_experiences`, `candidate_achievements`, `skills`, `candidate_skills`, `companies`, `job_listings`, `job_required_skills`, `job_applications`, `saved_jobs`, `preparation_guides`, and `preparation_guide_skills`.
  - **Seed Data:** Populates standardized technical skills taxonomy (Frontend, Backend, Mobile, Database, DevOps, QA); demo candidate account (Sokha Pech) with academic background, skills, and projects; demo recruiter account (Dara) managing TechBridge Solutions; 3 active entry-level IT job listings; 6 comprehensive preparation guides linked to skills; and initial application/saved job records.
- **SD-2:** 
  - **Password Hashing:** Implemented with `bcrypt` using 10 salt rounds.
  - **Token Management:** JSON Web Tokens (JWT) signed with `HS256` and configured with a 7-day expiration lifetime (`JWT_EXPIRES_IN=7d`).
  - **Role-Based Access Control:** Role middleware (`requireRole('CANDIDATE')`, `requireRole('EMPLOYER')`) strictly isolates candidate-only and recruiter-only routes, preventing cross-role access (returning standard `403 FORBIDDEN`).
  - **Error Handling:** Standardized error-handling middleware enforcing the Phase 3.4 shape `{ error: { code, message, details } }`.
- **SD-3:** 
  - **Resources Implemented:** Full CRUD for standardized skills catalog, candidate profile, skills association, projects, curated entry-level jobs with query filtering (`category`, `employmentType`, `search`), job bookmarks, company management, and preparation guides.
  - **Validation:** Enforced non-empty strings, character length constraints, required skill selection (minimum 1 required), and UUID format validation.
- **SD-4:** 
  - **Automated Skill Gap Analysis (EP-12):** Compares candidate profile skills against job required skills, computing matching skills, missing skills, and overall match percentage (`matchScore`).
  - **Direct Job Applications (EP-16):** Validates candidate profile has skills, verifies job is active (`OPEN`), prevents duplicate applications via unique constraint (`409 CONFLICT`), calculates real-time match percentage, and persists application in status `SUBMITTED`.
  - **Recruiter Review & Status Transitions (EP-21, EP-22):** Returns ranked applicant list with detailed matching/missing skill badges, and enforces valid status lifecycle (`SUBMITTED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `ACCEPTED` / `REJECTED`) while verifying company ownership.

## 3. Environment & Database Migration Runbook

Tested and verified on a fresh environment:

| Task | Command |
|---|---|
| Create the env file | `cp backend/.env.example backend/.env` |
| Start the database | `docker compose up -d` |
| Install dependencies | `cd backend && npm install` |
| Run migrations | `cd backend && npx prisma migrate dev` |
| Seed test data | `cd backend && npx prisma db seed` |
| Reset the database (drop, migrate, seed) | `cd backend && npx prisma migrate reset` |
| Build TypeScript code | `cd backend && npm run build` |
| Start the API on port 8000 | `cd backend && npm start` (or `npm run dev`) |
| Run the automated API test suite | `cd backend && npx ts-node tests/api_verification.ts` |
| Check health check | `curl http://localhost:8000/api/v1/health` |

Seeded test accounts (fake data only):

| Role | Email / username | Password | Purpose |
|---|---|---|---|
| `CANDIDATE` | `sokha.pech@it.edu.kh` | `Password123!` | Primary candidate persona (Sokha), CS student with Flutter, Git, and TypeScript skills. |
| `EMPLOYER` | `dara.recruiter@techbridge.kh` | `Password123!` | Recruiter persona (Dara), manages TechBridge Solutions and posts junior IT jobs. |
