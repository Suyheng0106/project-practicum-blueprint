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

> Finding a first tech job is confusing for IT candidates. Software job descriptions are full of complex stacks and acronyms, making it unclear if they have the right skills. Because openings are scattered across generic platforms, IT candidates waste hours applying for non-entry-level roles and face constant rejection. Meanwhile, tech recruiters are overwhelmed with generic, unqualified applicants and lack an efficient web portal to post entry-level IT roles with explicit technical skill requirements and view pre-screened tech candidate matches.

**Pain points**

| ID | Pain point | Who suffers | How often |
|---|---|---|---|
| PP-01 | Hard to understand what specific technical skills and tools an IT job actually requires. | IT candidates looking for their first software jobs. | Every time they read a tech job post. |
| PP-02 | Wasting time filtering through generic job boards only to find "entry-level" tech roles requiring 2-3 years of experience. | IT candidates seeking internships or junior roles. | Weekly, when searching for tech jobs. |
| PP-03 | Not knowing how to prepare for technical interviews or build a real-world coding portfolio. | IT candidates who get technical interview calls. | Before and during interviews. |
| PP-04 | Wasting time manually checking if their programming languages and frameworks match the job requirements. | Tech candidates. | Every time they want to apply. |
| PP-05 | Overwhelmed by generic candidate applications that do not match the required IT tech stack. | Tech recruiters / Software companies. | Every hiring cycle. |
| PP-06 | Managing IT job listings and evaluating developer candidates on mobile or email is slow and disorganized. | Tech recruiters / Software companies. | Weekly during active recruiting. |

**Problem statement in one sentence**

> IT and Computer Science candidates struggle to identify real entry-level tech openings and evaluate their skill readiness, while tech employers waste hours sorting through mismatched candidate applications lacking verifiable technical skill indicators.

## 2. Target User Persona

| Field | P-01 (primary) | P-02 (secondary) |
|---|---|---|
| Name, age, role | Sokha, 21, Entry-Level IT Candidate | Dara, 28, HR & Tech Recruiter at a local software company |
| A typical day | Studies software engineering, builds coding projects, and searches online at night for junior tech positions. | Screens dozens of junior developer CVs, posts open software positions, and coordinates technical evaluations. |
| Daily struggles | Gets confused by lengthy tech buzzwords in job posts (PP-01); annoyed finding IT roles on Facebook that actually demand 3 years of production experience (PP-02); unsure if his coding projects meet industry expectations (PP-03). | Flooded with generic resumes from candidates lacking foundational programming skills required for the role (PP-05); lacks a dedicated desktop portal to publish beginner IT roles with strict skill tags and see instant skill match scores (PP-06). |
| Goals | Find an entry-level software development or IT internship/job. | Quickly post junior tech openings and evaluate candidates ranked by clear, verified technical skill match percentages. |
| Tech literacy | High. Uses a laptop and smartphone daily, along with tools like VS Code, GitHub, Dart/Flutter, and ChatGPT. | High. Works on a laptop all day using web-based tools (Google Workspace, GitHub, browser recruiting dashboards). |
| What they would say about the problem | "I see many tech posts on Facebook, but I don't know if my coding skills fit the requirements, and checking manually takes too long." | "I get flooded with resumes from candidates who don't even know the basics of our tech stack. I want a clean web dashboard to post tech roles and immediately see which candidates actually fit." |

## 3. Domain Terminology

| Term | Definition in this project | Synonyms to avoid | Business rule |
|---|---|---|---|
| Skill Gap | The specific technical skills and tools an IT candidate lacks for a target IT job. | Weakness | A skill gap is only calculated by comparing one tech candidate profile to one IT job listing. |
| Job Listing | An entry-level IT, software engineering, or tech internship post from a company. | Gig, Post | Must be an IT/tech role and belong to a registered employer company profile. |
| Candidate Profile | A tech candidate's account showcasing their technical skills, education/major, and software projects. | CV, Resume | A candidate must be in a tech-related field and can only have one profile. |
| Employer | A tech company recruiter posting and managing IT job openings on the web portal. | Boss, Admin | Must represent a verified company profile offering tech opportunities. |
| Job Application | A candidate's submission to an IT job listing, including their tech profile and calculated skill match. | Bid, Pitch | A candidate can only apply to the same IT job listing once. |

## 4. Competitor / Existing Solution Teardown

| Existing solution | Type | What it does well | Why it is inadequate (refer to PP-xx) |
|---|---|---|---|
| Facebook Groups | Social Media | Lots of local IT jobs are posted informally. | Unstructured; impossible to filter beginner tech roles from senior positions (PP-02); no automated tech stack comparison (PP-04). |
| CamHR / General Portals | Job Website | Aggregates listings across all industries. | Cluttered with non-tech jobs; technical skill requirements are buried in vague text blocks (PP-01); no automated tech skill matching (PP-04). |
| ChatGPT | AI Assistant | Good at explaining technical concepts and coding questions. | Requires manual copy-pasting of every job description (PP-04); cannot browse live, verified local tech job listings (PP-02). |

**Your unique angle**

> DevPath exclusively connects IT candidates with entry-level tech jobs, automatically comparing their technical skills against real job requirements to guide their path into the software industry.