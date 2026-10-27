# Phase 2.1 — MoSCoW Scope Matrix

**Objective:** Decide exactly what you will build, and just as importantly what you will not build. This matrix protects you from scope creep for the rest of the project.

**Status:** In Progress / Revised · **Last updated:** 2026-10-27

## Done When

- [x] Every feature has a stable ID (F-01, F-02, …), exactly one priority and a pain point
- [x] At least 3 Won't-Have items are listed

## 1. Priority Rules

| Priority | Rule |
|---|---|
| Must-Have | Without it, the core journey cannot be demonstrated at the defense. |
| Should-Have | Important, but the app still works without it. Built only once all Must-Haves are done. |
| Could-Have | Nice to have (visual polish, extras). Only if time remains. |
| Won't-Have | Explicitly out of scope for this project. Becomes "future work" in your thesis. |

## 2. MoSCoW Matrix

IDs never change. If a feature changes priority, change the Priority column and note it in Section 3.

| ID | Feature | Priority | Pain point | Why this priority |
|---|---|---|---|---|
| F-01 | Student Profile Creation (add skills, projects) | Must-Have | PP-04 | Need a profile to compare skills against jobs. |
| F-02 | Curated Job Board for Beginners | Must-Have | PP-02 | The core place to find relevant internships. |
| F-03 | Automated Skill Gap Analyzer | Must-Have | PP-01 | This is the main unique angle of the app. |
| F-04 | Real-World Preparation Hub (guides, tips) | Should-Have | PP-03 | Helps students after they find a skill gap. |
| F-05 | AI Learning Roadmap Generator | Could-Have | PP-01 | Good extra feature, but not required for MVP. |
| F-06 | In-App Direct Job Applications | Must-Have | PP-04 | Enables candidate to apply directly, completing the loop for employer review. |
| F-07 | Live Chat with Employers | Won't-Have | None | Needs a big backend; out of scope for this class. |
| F-08 | Auto-generate PDF Resumes | Won't-Have | None | Too many formatting edge cases. Future work. |
| F-09 | Employer Web Portal & Job Management | Must-Have | PP-05, PP-06 | Enables recruiters to post entry-level roles and review applicants on desktop. |

## 3. Scope Changes

After this phase, scope is frozen so you can focus on building. Changes are still possible: agree each one with your advisor and note it here.

| Date | Change | Why |
|---|---|---|
| 2026-10-27 | Added F-09 (Employer Web Portal & Job Management, Must-Have) and upgraded F-06 (In-App Direct Job Applications) from Could-Have to Must-Have. Established dual-client architecture: Candidates on Flutter mobile, Employers on React web portal, sharing a single backend and PostgreSQL database. | Advisor mandated an end-to-end solution for both employer and candidate, with employer functionality on a desktop web portal and candidate on mobile. |