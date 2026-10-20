# Phase 1.1 — Problem Discovery Brief

**Objective:** Describe the problem, who suffers from it, and why existing solutions are not good enough. Every later decision traces back to this document.

**Status:** Submitted · **Last updated:** 2026-10-15

## Done When

- [x] Every pain point has an ID (PP-01, PP-02, …) that Phase 2 can reference
- [x] The persona refers to specific pain points
- [x] At least 3 existing solutions are compared, each linked to a pain point
- [x] Your unique angle fits in one sentence

## 1. Problem Statement

**Context**

> University students want to find internships and first jobs, but the process is confusing. Job postings use complicated words, and it is hard to tell if what they learn in class matches what employers want. Because jobs are scattered across Facebook and websites, students waste time applying for the wrong roles and feel stressed.

**Pain points**

| ID | Pain point | Who suffers | How often |
|---|---|---|---|
| PP-01 | Hard to understand what skills a job actually needs. | Students looking for first jobs. | Every time they read a job post. |
| PP-02 | Wasting time clicking on job posts only to realize they require years of experience. | Students looking for their first job. | Students looking for work. | Weekly, when searching for jobs. |
| PP-03 | Not knowing how to prepare for interviews or build a good project portfolio. | Students who get interview calls. | Before and during interviews. |
| PP-04 | Wasting time manually checking if their skills match the job post. | All student job seekers. | Every time they want to apply. |

**Problem statement in one sentence**

> University students struggle to find their first internships and jobs. Job descriptions use confusing words, so students don't know if they actually have the right skills. Since jobs are scattered across Facebook and different websites, students end up wasting time applying for the wrong roles and feeling stressed out.

## 2. Target User Persona

| Field | P-01 (primary) | P-02 (secondary, optional) |
|---|---|---|
| Name, age, role | Sokha, 21, 3rd-year IT Student | |
| A typical day | Goes to class, does homework, and scrolls Facebook or job websites at night to find internships. | |
| Daily struggles | Gets confused by big words in job posts (PP-01); gets annoyed finding jobs on Facebook that actually need 3 years of experience (PP-02); doesn't know if his school projects are good enough to show employers (PP-03). | |
| Goals | Find a software internship before graduating. | |
| Tech literacy | High. Uses a laptop and smartphone daily, along with tools like VS Code, GitHub, and ChatGPT. | |
| What they would say about the problem | "I see many job posts on Facebook, but I don't know if I'm good enough to apply, and checking takes too long." | |

## 3. Domain Terminology

| Term | Definition in this project | Synonyms to avoid | Business rule |
|---|---|---|---|
| Skill Gap | The skills a student is missing for a specific job. | Weakness | A skill gap is only calculated when comparing one student to one job. |
| Job Listing | A job post from a company. | Gig, Post | Must belong to a real company. |
| Student Profile | A student's account showing their skills and school projects. | CV, Resume | A user can only have one profile. |

## 4. Competitor / Existing Solution Teardown

| Existing solution | Type | What it does well | Why it is inadequate (refer to PP-xx) |
|---|---|---|---|
| Facebook Groups | Social Media | Lots of local jobs are posted here. | Hard to search for beginner jobs (PP-02); cannot check if your skills match (PP-04). |
| CamHR / Local Portals | Job Website | Has many official job postings in one place. | Job descriptions use confusing words that students don't understand (PP-01). |
| ChatGPT | AI Assistant | Good at explaining things and giving study tips. | You have to copy-paste every job post to check it (PP-04); it doesn't show real local jobs (PP-02). |

**Your unique angle**

> SkillBridge automatically compares a student's skills to a job's needs and only shows jobs meant for students, saving them time and confusion.