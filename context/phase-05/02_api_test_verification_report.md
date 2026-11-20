# Phase 5.2 — API Test Verification Report

**Objective:** Prove that every Must-Have endpoint works against a real database before any frontend work starts.

**Golden Rule:** an endpoint must pass in your API test collection before you build a screen that uses it. A bug is much easier to find in the API alone than through the app.

**Status:** Submitted · **Last updated:** 2026-11-20

## Done When

- [x] Every Phase 3.4 endpoint appears in the matrix
- [x] Every Must-Have endpoint shows PASS and has at least one passing error-case test
- [x] The test run report is saved and linked
- [x] The test collection in `api-specs/` is committed and up to date

## 1. Test Run

| Item | Value |
|---|---|
| API testing tool | Automated TypeScript Test Suite (`backend/tests/api_verification.ts`) & Postman Collection (`api-specs/devpath.postman_collection.json`) |
| How you ran the whole collection | `cd backend && npx ts-node tests/api_verification.ts` |
| Commit tested | Working tree on `main` |
| Date | 2026-11-20 |
| Total Tests Run | 41 total (23 positive endpoint tests + 18 negative error case tests) |
| Pass Rate | 100% (41 / 41 PASS) |

## 2. API Verification Matrix

| ID | Method | Route | Priority | Status | Request in `api-specs/` | Sample response (shortened) |
|---|---|---|---|---|---|---|
| **EP-01** | GET | `/api/v1/health` | Must | **PASS** | `EP-01 Health Check` | `{"status":"ok","timestamp":"2026-11-20T04:12:52.623Z"}` |
| **EP-02** | POST | `/api/v1/auth/register` | Must | **PASS** | `EP-02 Register Candidate` | `{"id":"...","email":"candidate...@it.edu.kh","role":"CANDIDATE"}` |
| **EP-03** | POST | `/api/v1/auth/login` | Must | **PASS** | `EP-03 Login` | `{"token":"eyJhbGciOi...","user":{"email":"sokha.pech@it.edu.kh","role":"CANDIDATE"}}` |
| **EP-04** | GET | `/api/v1/auth/me` | Must | **PASS** | `EP-04 Get Current User Profile` | `{"id":"...","email":"sokha.pech@it.edu.kh","role":"CANDIDATE"}` |
| **EP-05** | GET | `/api/v1/skills` | Must | **PASS** | `EP-05 List Skills Taxonomy` | `[{"id":"...","name":"Docker","category":"DevOps"},{"id":"...","name":"Express","category":"Backend"}]` |
| **EP-06** | GET | `/api/v1/candidate/profile` | Must | **PASS** | `EP-06 Get Candidate Profile` | `{"fullName":"Sokha Pech","university":"Royal University of Phnom Penh","skillsCount":3}` |
| **EP-07** | PUT | `/api/v1/candidate/profile` | Must | **PASS** | `EP-07 Update Candidate Profile` | `{"fullName":"Sokha Pech","yearOfStudy":4,"updatedAt":"..."}` |
| **EP-08** | PUT | `/api/v1/candidate/skills` | Must | **PASS** | `EP-08 Update Candidate Skills` | `{"candidateProfileId":"...","skills":[{"id":"...","name":"Flutter"},{"id":"...","name":"Git"}]}` |
| **EP-09** | POST | `/api/v1/candidate/projects` | Must | **PASS** | `EP-09 Add Candidate Project` | `{"id":"...","title":"Portfolio Showcase Website","createdAt":"..."}` |
| **EP-10** | GET | `/api/v1/jobs` | Must | **PASS** | `EP-10 Browse Beginner Jobs` | `{"total":4,"jobs":[{"title":"Junior Flutter Developer Intern","company":{"name":"TechBridge Solutions"}}]}` |
| **EP-11** | GET | `/api/v1/jobs/:id` | Must | **PASS** | `EP-11 Get Job Details` | `{"title":"Junior Flutter Developer Intern","company":{"name":"TechBridge Solutions"},"requiredSkills":[...]}` |
| **EP-12** | GET | `/api/v1/jobs/:id/fit` | Must | **PASS** | `EP-12 Run Skill Gap Analysis` | `{"matchScore":67,"totalRequired":3,"matchedCount":2,"matchingSkills":[...],"missingSkills":[...]}` |
| **EP-13** | GET | `/api/v1/candidate/saved-jobs` | Must | **PASS** | `EP-13 List Saved Jobs` | `[{"savedAt":"...","job":{"title":"Junior Backend Developer","company":"TechBridge Solutions"}}]` |
| **EP-14** | POST | `/api/v1/jobs/:id/save` | Must | **PASS** | `EP-14 Save Job Listing` | `{"jobListingId":"...","status":"SAVED","savedAt":"..."}` |
| **EP-15** | DELETE | `/api/v1/jobs/:id/save` | Must | **PASS** | `EP-15 Unsave Job Listing` | `{"jobListingId":"...","status":"REMOVED"}` |
| **EP-16** | POST | `/api/v1/jobs/:id/apply` | Must | **PASS** | `EP-16 Apply to Job Listing` | `{"id":"...","matchScore":67,"status":"SUBMITTED","appliedAt":"..."}` |
| **EP-17** | GET | `/api/v1/candidate/applications` | Must | **PASS** | `EP-17 List Candidate Applications` | `[{"job":{"title":"Junior Flutter Developer Intern"},"matchScore":67,"status":"SUBMITTED"}]` |
| **EP-18** | POST | `/api/v1/employer/company` | Must | **PASS** | `EP-18 Create or Update Company Profile` | `{"name":"TechBridge Solutions Co., Ltd.","industry":"Software Development","updatedAt":"..."}` |
| **EP-19** | GET | `/api/v1/employer/jobs` | Must | **PASS** | `EP-19 List Employer Job Postings` | `[{"title":"Junior Flutter Developer Intern","status":"OPEN","applicantCount":1}]` |
| **EP-20** | POST | `/api/v1/employer/jobs` | Must | **PASS** | `EP-20 Publish Entry-Level Job Listing` | `{"id":"...","title":"Junior QA Engineer Intern","status":"OPEN","requiredSkills":[...]}` |
| **EP-21** | GET | `/api/v1/employer/jobs/:id/applications` | Must | **PASS** | `EP-21 Review Job Applicants` | `[{"matchScore":67,"status":"SUBMITTED","candidateProfile":{"fullName":"Sokha Pech","matchingSkills":["Flutter","Git"],"missingSkills":["Docker"]}}]` |
| **EP-22** | PATCH | `/api/v1/employer/applications/:id/status` | Must | **PASS** | `EP-22 Update Applicant Status` | `{"id":"...","status":"UNDER_REVIEW","updatedAt":"..."}` |
| **EP-23** | GET | `/api/v1/candidate/guides` | Should | **PASS** | `EP-23 List Preparation Guides for Candidate` | `[{"title":"Docker Essentials for Junior Backend Roles","category":"DevOps & Cloud","skills":[{"name":"Docker"}]}]` |

## 3. Negative Cases

| ID | Error case | Expected status | Actual status | Status |
|---|---|---|---|---|
| **EP-02** | Password under 8 characters | 400 | 400 | **PASS** |
| **EP-02** | Duplicate email address registration | 409 | 409 | **PASS** |
| **EP-03** | Incorrect password on login | 401 | 401 | **PASS** |
| **EP-04** | Missing `Authorization` header | 401 | 401 | **PASS** |
| **EP-06** | Role restriction (Employer accessing candidate profile) | 403 | 403 | **PASS** |
| **EP-07** | Missing required `fullName` field on profile update | 400 | 400 | **PASS** |
| **EP-08** | Empty `skillIds` array submitted | 400 | 400 | **PASS** |
| **EP-09** | Missing required project `title` | 400 | 400 | **PASS** |
| **EP-11** | Non-existent job listing ID lookup | 404 | 404 | **PASS** |
| **EP-12** | Role restriction (Employer attempting candidate skill fit check) | 403 | 403 | **PASS** |
| **EP-14** | Duplicate bookmark save on same job | 409 | 409 | **PASS** |
| **EP-15** | Attempting to unsave a non-bookmarked job | 404 | 404 | **PASS** |
| **EP-16** | Duplicate job application submission to same job listing | 409 | 409 | **PASS** |
| **EP-18** | Missing required `name` on company creation | 400 | 400 | **PASS** |
| **EP-20** | Empty `requiredSkillIds` array on job publishing | 400 | 400 | **PASS** |
| **EP-21** | Role restriction (Candidate attempting to view recruiter applicants list) | 403 | 403 | **PASS** |
| **EP-22** | Invalid application status enum value | 400 | 400 | **PASS** |
| **EP-23** | Role restriction (Employer attempting to view candidate preparation guides) | 403 | 403 | **PASS** |
