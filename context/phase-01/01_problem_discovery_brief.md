# Phase 1.1 — Problem Discovery Brief

**Objective:** Describe the problem, who suffers from it, and why existing solutions are not good enough. Every later decision traces back to this document.

**Status:** In Progress / Revised · **Last updated:** 2026-10-27

## Done When

- [x] Every pain point has an ID (PP-01, PP-02, …) that Phase 2 can reference
- [x] The persona refers to specific pain points
- [x] At least 3 existing solutions are compared, each linked to a pain point
- [x] Your unique angle fits in one sentence

## 1. Problem Statement

**Context**

> Finding a first job is confusing for students. Job descriptions are hard to understand, making it unclear if they have the right skills. Because jobs are scattered everywhere, students waste time applying for the wrong roles and feel stressed. Meanwhile, tech recruiters are overwhelmed with unqualified applicants and need an efficient web portal to post entry-level roles with explicit skill requirements and view pre-screened student fits.

**Pain points**

| ID | Pain point | Who suffers | How often |
|---|---|---|---|
| PP-01 | Hard to understand what skills a job actually needs. | Students looking for first jobs. | Every time they read a job post. |
| PP-02 | Wasting time clicking on job posts only to realize they require years of experience. | Students looking for their first job. | Weekly, when searching for jobs. |
| PP-03 | Not knowing how to prepare for interviews or build a good project portfolio. | Students who get interview calls. | Before and during interviews. |
| PP-04 | Wasting time manually checking if their skills match the job post. | All student job seekers. | Every time they want to apply. |
| PP-05 | Overwhelmed by generic student applications that do not match required skills. | Tech recruiters / Employers. | Every hiring cycle. |
| PP-06 | Managing job listings and reviewing applicants on mobile is slow and inefficient. | Tech recruiters / Employers. | Weekly during active recruiting. |

**Problem statement in one sentence**

> University students struggle to understand skill requirements and find beginner-friendly jobs, while employers waste hours sorting through mismatched student applications without clear skill indicators.

## 2. Target User Persona

| Field | P-01 (primary) | P-02 (secondary) |
|---|---|---|
| Name, age, role | Sokha, 21, 3rd-year IT Student | Dara, 28, HR & Tech Recruiter at a local tech company |
| A typical day | Goes to class, does homework, and scrolls Facebook or job websites at night to find internships. | Screens dozens of CVs on a laptop, posts open tech positions, and coordinates initial technical evaluations. |
| Daily struggles | Gets confused by big words in job posts (PP-01); gets annoyed finding jobs on Facebook that actually need 3 years of experience (PP-02); doesn't know if his school projects are good enough to show employers (PP-03). | Spends hours sorting through hundreds of applicant CVs that don't match basic requirements (PP-05); lacks a clean desktop web tool to quickly post beginner jobs with explicit skill tags and review applicants' match scores (PP-06). |
| Goals | Find a software internship before graduating. | Quickly post entry-level tech roles and review student applicants with clear, verified skill match percentages. |
| Tech literacy | High. Uses a laptop and smartphone daily, along with tools like VS Code, GitHub, and ChatGPT. | High. Works on a laptop all day using web-based tools (Google Workspace, LinkedIn, browser portals). |
| What they would say about the problem | "I see many job posts on Facebook, but I don't know if I'm good enough to apply, and checking takes too long." | "I get flooded with resumes from students who don't match what the role actually needs. I want a clean web dashboard to post jobs and immediately see which applicants fit." |

## 3. Domain Terminology

| Term | Definition in this project | Synonyms to avoid | Business rule |
|---|---|---|---|
| Skill Gap | The skills a student is missing for a specific job. | Weakness | A skill gap is only calculated when comparing one student to one job. |
| Job Listing | A job post from a company. | Gig, Post | Must belong to a registered employer company profile. |
| Student Profile | A student's account showing their skills and school projects. | CV, Resume | A candidate can only have one profile. |
| Employer | A company recruiter posting and managing job listings on the web portal. | Boss, Admin | Must belong to a company profile. |
| Job Application | A candidate's submission to a job listing, including their profile and calculated skill match. | Bid, Pitch | A student can only apply to the same job once. |

## 4. Competitor / Existing Solution Teardown

| Existing solution | Type | What it does well | Why it is inadequate (refer to PP-xx) |
|---|---|---|---|
| Facebook Groups | Social Media | Lots of local jobs are posted here. | Hard to search for beginner jobs (PP-02); cannot check if your skills match (PP-04). |
| CamHR / Local Portals | Job Website | Has many official job postings in one place. | Job descriptions use confusing words that students don't understand (PP-01). |
| ChatGPT | AI Assistant | Good at explaining things and giving study tips. | You have to copy-paste every job post to check it (PP-04); it doesn't show real local jobs (PP-02). |

**Your unique angle**

> SkillBridge automatically compares a student's skills to a job's needs and only shows jobs meant for students, saving them time and confusion.