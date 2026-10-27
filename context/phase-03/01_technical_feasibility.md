# Phase 3.1 — Tech Stack & Feasibility

**Objective:** Choose a tech stack that fits your Must-Have features and that you can deliver alone, list the external services those features need, and plan for what could go wrong.

**Status:** In Progress · **Last updated:** 2026-10-27

## Done When

- [x] Every stack layer has a choice, a version and a reason
- [x] Every external service has a fallback
- [x] Your stack is written in `AGENTS.md`

## 1. Tech Stack Selection & Justification

Guiding questions: What do your Must-Have features need (mobile or web, scheduled jobs, real-time updates)? What have you already used? Is the documentation good? Can you finish it alone in the time you have?

| Layer | Your choice (with version) | Alternative considered | Why this choice |
|---|---|---|---|
| **Backend language & framework** | Node.js (v22.x) with Express (v4.x) and TypeScript (v5.x) | Python (v3.13) + FastAPI, Dart Frog | I already know Dart from Flutter, and TypeScript works very similarly (same syntax, async/await, and classes). Express is lightweight and simple, making it easy to build the required `/api/v1` routes without getting slowed down by complicated setup. |
| **Database** | PostgreSQL 16 (via Docker) with Prisma ORM (v5.x) | SQLite, MongoDB | SkillBridge needs tables linked together (Students, Skills, Jobs, Applications, Companies). PostgreSQL handles these links reliably. Prisma lets me query the database with clean code instead of complex SQL, making it easy to calculate missing skills (F-03) and quickly reset demo data. |
| **Mobile Client (Candidate)** | Flutter (v3.41.x) with Dart | React Native / Expo | I already know Flutter, so I can build a polished mobile app quickly. Since our candidate persona Sokha searches for jobs on his phone, a mobile app is the most natural fit. |
| **Web Portal Client (Employer)** | React (v18.x) with Vite and TypeScript (v5.x) | Flutter Web, Next.js | Recruiters work on laptops/desktops where web portals are standard for posting jobs and reviewing applicants. Using React with Vite is lightweight, fast to build, and shares TypeScript with our Node.js backend. |
| **Authentication** | JSON Web Tokens (JWT) with bcrypt | Firebase Auth, Supabase Auth | It runs completely inside our app without relying on third-party services like Firebase. Supports role-based claims (`CANDIDATE` and `EMPLOYER`) and works 100% offline during my defense presentation with no network risk. |
| **API testing tool** | Postman (v11.x) | Bruno, Insomnia | It has an easy visual interface to test all endpoints before building mobile and web screens. I can easily save and export the test collection into `api-specs/` for my advisor to review. |
| **Hosting / running locally** | Local Node.js runtime (API on port 8000) & Docker Compose (PostgreSQL 16) | SQLite without Docker, Cloud PaaS (Render) | Docker lets me run PostgreSQL with a single command (`docker compose up -d`) without messy installations on my laptop. Node runs the API directly on port 8000. |

## 2. Third-Party Service Dependencies

Only list services your features really need (e.g. cloud storage, maps, SMS, payment gateway, push notifications). API keys go in a git-ignored `.env` file, never in Git.

| Service | Purpose | Provider | Free-tier limit | Fallback if it fails |
|---|---|---|---|---|
| **Google Gemini API** | AI Learning Roadmap Generator (F-05, Could-Have) | Google AI Studio | 15 RPM / 1,500 RPD (Free Tier) | Fallback to static, pre-curated study guides and portfolio tips from the Preparation Hub (F-04). Core features (F-01, F-02, F-03, F-06, F-09) run 100% offline without third-party APIs. |

> **Note on Core Features:**  
> Features `F-01` (Student Profile), `F-02` (Curated Job Board), `F-03` (Skill Gap Analyzer), `F-06` (Direct Job Application), and `F-09` (Employer Web Portal) operate 100% offline and have zero external API dependencies.

## 3. Top Risks

| Risk | What you'll do about it |
|---|---|
| **I am new to building backends with Node.js and Express.** | TypeScript looks very similar to Dart, which makes it easier to learn. I will pair-program with my AI assistant to build and test each backend endpoint step-by-step before touching the mobile app. |
| **The Flutter mobile app cannot connect to the backend running on my laptop.** | Phone emulators cannot use "localhost" directly. I will make the server URL easily changeable in Flutter (using `10.0.2.2` for Android emulator or my laptop's Wi-Fi IP for a real phone). |
| **Managing two client frontends (Mobile & Web) becomes overwhelming.** | The backend API handles the core business logic and database. The Employer Web Portal only needs 3 focused screens (Auth, Post Job, Review Applicants), built with standard React and TypeScript. |
| **The app looks empty during the defense presentation without enough realistic jobs.** | I will write a database seed script that loads 15+ realistic beginner IT jobs and skills with a single command, ensuring the demo looks authentic even before any new jobs are created live on the web portal. |
