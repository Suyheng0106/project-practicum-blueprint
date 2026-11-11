# Phase 3.4 — API Contracts & Test Collection

**Objective:** Specify every endpoint before you implement it, and write a test request for each one in your API testing tool. The tests fail now and turn green during Phase 5.

**Status:** Submitted · **Last updated:** 2026-11-03

## Done When

- [x] Every endpoint has an ID (EP-01, EP-02, …) and a contract card (Section 3)
- [x] Every Must-Have journey step is covered by an endpoint
- [x] The test collection in `api-specs/` has one request per endpoint, named with its EP-ID

---

## 1. Conventions (all projects)

- **Base URL:** `http://localhost:8000`; every endpoint path starts with `/api/v1`.
- **Payloads:** All request and response bodies use standard JSON with UTF-8 encoding.
- **Authentication:** Protected routes mandate the HTTP header: `Authorization: Bearer <jwt_token>`.
- **Error Format:** Every failure response uses one unified shape:
  ```json
  {
    "error": {
      "code": "NOT_FOUND",
      "message": "The requested job listing was not found.",
      "details": []
    }
  }
  ```
- **Standard HTTP Status Codes:**
  - `200 OK`: Request succeeded.
  - `201 CREATED`: New resource created successfully.
  - `400 VALIDATION_ERROR`: Invalid inputs or missing required fields.
  - `401 UNAUTHORIZED`: Authentication missing, malformed, or expired.
  - `403 FORBIDDEN`: Valid token, but user role is not allowed to access this resource.
  - `404 NOT_FOUND`: Target entity does not exist.
  - `409 CONFLICT`: Duplicate entry or conflicting state (e.g. already applied).
  - `500 SERVER_ERROR`: Unhandled internal error.

---

## 2. API Specification Table

| ID | Method | Endpoint | Description | Auth required | Feature / Journey |
|---|---|---|---|---|---|
| **EP-01** | GET | `/api/v1/health` | Service health check | No | Baseline |
| **EP-02** | POST | `/api/v1/auth/register` | Register a new user account | No | UJ-01, F-01, F-09 |
| **EP-03** | POST | `/api/v1/auth/login` | Login and receive role-based JWT | No | UJ-01, UJ-06 |
| **EP-04** | GET | `/api/v1/auth/me` | Fetch authenticated user identity and role | Yes | All Journeys |
| **EP-05** | GET | `/api/v1/skills` | List standardized skill taxonomy | No | UJ-01, UJ-06, F-01 |
| **EP-06** | GET | `/api/v1/candidate/profile` | Retrieve candidate profile, skills, projects, experiences, and achievements | Yes (Candidate) | UJ-01, F-01 |
| **EP-07** | PUT | `/api/v1/candidate/profile` | Create or update candidate profile details | Yes (Candidate) | UJ-01, F-01 |
| **EP-08** | PUT | `/api/v1/candidate/skills` | Update candidate profile skill associations | Yes (Candidate) | UJ-01, F-01 |
| **EP-09** | POST | `/api/v1/candidate/projects` | Add a coding or side project to candidate profile | Yes (Candidate) | UJ-01, F-01 |
| **EP-10** | GET | `/api/v1/jobs` | Browse curated beginner jobs with filters | No / Optional | UJ-02, F-02 |
| **EP-11** | GET | `/api/v1/jobs/:id` | View detailed job description and required skills | No / Optional | UJ-02, F-02 |
| **EP-12** | GET | `/api/v1/jobs/:id/fit` | Run automated Skill Gap analysis for this job | Yes (Candidate) | UJ-03, F-03 |
| **EP-13** | GET | `/api/v1/candidate/saved-jobs` | Retrieve candidate's bookmarked job listings | Yes (Candidate) | UJ-04, F-02 |
| **EP-14** | POST | `/api/v1/jobs/:id/save` | Bookmark a job listing for later | Yes (Candidate) | UJ-04, F-02 |
| **EP-15** | DELETE | `/api/v1/jobs/:id/save` | Remove a job listing from bookmarks | Yes (Candidate) | UJ-04, F-02 |
| **EP-16** | POST | `/api/v1/jobs/:id/apply` | Submit job application with calculated match | Yes (Candidate) | UJ-07, F-06, F-03 |
| **EP-17** | GET | `/api/v1/candidate/applications` | List all applications submitted by candidate | Yes (Candidate) | UJ-07, F-06 |
| **EP-18** | POST | `/api/v1/employer/company` | Create or update company profile | Yes (Employer) | UJ-06, F-09 |
| **EP-19** | GET | `/api/v1/employer/jobs` | List all job openings posted by recruiter | Yes (Employer) | UJ-06, F-09 |
| **EP-20** | POST | `/api/v1/employer/jobs` | Publish new entry-level job with required skills | Yes (Employer) | UJ-06, F-09 |
| **EP-21** | GET | `/api/v1/employer/jobs/:id/applications` | Review candidate applicants and match percentages | Yes (Employer) | UJ-08, F-09, F-06 |
| **EP-22** | PATCH | `/api/v1/employer/applications/:id/status` | Update applicant status (UNDER_REVIEW / ACCEPTED) | Yes (Employer) | UJ-08, F-09 |
| **EP-23** | GET | `/api/v1/candidate/guides` | View IT portfolio and interview guides tailored to candidate | Yes (Candidate) | UJ-05, F-04 |

---

## 3. Endpoint Contract Cards

### EP-02 — POST `/api/v1/auth/register`

Request body:
```json
{
  "email": "sokha.pech@it.edu.kh",
  "password": "Password123!",
  "role": "CANDIDATE"
}
```

Success response, `201 Created`:
```json
{
  "id": "c7a10f82-0193-4e4b-9e42-12781498b001",
  "email": "sokha.pech@it.edu.kh",
  "role": "CANDIDATE",
  "createdAt": "2026-11-03T14:00:00.000Z"
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | Email is invalid, password is under 8 characters, or role is not `CANDIDATE` or `EMPLOYER`. |
| `401 UNAUTHORIZED` | n/a |
| `403 FORBIDDEN` | n/a |
| `409 CONFLICT` | Email address is already registered to another account. |

---

### EP-03 — POST `/api/v1/auth/login`

Request body:
```json
{
  "email": "sokha.pech@it.edu.kh",
  "password": "Password123!"
}
```

Success response, `200 OK`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "c7a10f82-0193-4e4b-9e42-12781498b001",
    "email": "sokha.pech@it.edu.kh",
    "role": "CANDIDATE"
  }
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | Email or password field is missing. |
| `401 UNAUTHORIZED` | Incorrect email or password. |
| `403 FORBIDDEN` | n/a |
| `404 NOT_FOUND` | n/a |

---

### EP-04 — GET `/api/v1/auth/me`

Request body: `none`

Success response, `200 OK`:
```json
{
  "id": "c7a10f82-0193-4e4b-9e42-12781498b001",
  "email": "sokha.pech@it.edu.kh",
  "role": "CANDIDATE",
  "createdAt": "2026-11-03T14:00:00.000Z"
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | n/a |
| `401 UNAUTHORIZED` | Bearer token is missing, expired, or invalid. |
| `403 FORBIDDEN` | n/a |
| `404 NOT_FOUND` | User account was deleted. |

---

### EP-05 — GET `/api/v1/skills`

Request body: `none`

Success response, `200 OK`:
```json
[
  {
    "id": "s001-uuid",
    "name": "Flutter",
    "category": "Mobile"
  },
  {
    "id": "s002-uuid",
    "name": "TypeScript",
    "category": "Frontend"
  },
  {
    "id": "s003-uuid",
    "name": "Node.js",
    "category": "Backend"
  }
]
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | n/a |
| `401 UNAUTHORIZED` | n/a |
| `403 FORBIDDEN` | n/a |
| `404 NOT_FOUND` | n/a |

---

### EP-06 — GET `/api/v1/candidate/profile`

Request body: `none`

Success response, `200 OK`:
```json
{
  "id": "p001-uuid",
  "fullName": "Sokha Pech",
  "bio": "IT candidate passionate about Flutter and backend engineering.",
  "university": "Royal University of Phnom Penh",
  "major": "Computer Science",
  "yearOfStudy": 3,
  "portfolioUrl": "https://github.com/sokhapech",
  "skills": [
    { "id": "s001-uuid", "name": "Flutter", "category": "Mobile" },
    { "id": "s003-uuid", "name": "Git", "category": "General" }
  ],
  "projects": [
    {
      "id": "proj001-uuid",
      "title": "Mobile Shopping App",
      "description": "Candidate project built with Flutter and SQLite.",
      "projectUrl": "https://github.com/sokhapech/shop"
    }
  ],
  "experiences": [
    {
      "id": "exp001-uuid",
      "title": "Junior Web Developer Intern",
      "companyName": "TechStart Solutions",
      "employmentType": "INTERNSHIP",
      "location": "Phnom Penh",
      "isCurrent": false,
      "startDate": "2025-06-01",
      "endDate": "2025-09-01",
      "description": "Assisted in building responsive frontend modules."
    }
  ],
  "achievements": [
    {
      "id": "ach001-uuid",
      "title": "1st Place - University Hackathon",
      "issuer": "RUPP Tech Fair",
      "issueDate": "2025-10-15",
      "description": "Built an automated student portal in 24 hours.",
      "certificateUrl": "https://certificates.example.com/ach001"
    }
  ]
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | n/a |
| `401 UNAUTHORIZED` | Missing or invalid candidate JWT. |
| `403 FORBIDDEN` | Logged-in user has role `EMPLOYER`. |
| `404 NOT_FOUND` | Profile has not been created yet. |

---

### EP-07 — PUT `/api/v1/candidate/profile`

Request body:
```json
{
  "fullName": "Sokha Pech",
  "bio": "IT candidate seeking a tech internship.",
  "university": "Royal University of Phnom Penh",
  "major": "Computer Science",
  "yearOfStudy": 3,
  "portfolioUrl": "https://github.com/sokhapech"
}
```

Success response, `200 OK`:
```json
{
  "id": "p001-uuid",
  "fullName": "Sokha Pech",
  "bio": "IT candidate seeking a tech internship.",
  "university": "Royal University of Phnom Penh",
  "major": "Computer Science",
  "yearOfStudy": 3,
  "portfolioUrl": "https://github.com/sokhapech",
  "updatedAt": "2026-11-03T15:00:00.000Z"
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | `fullName` is missing or empty. |
| `401 UNAUTHORIZED` | Missing or invalid candidate JWT. |
| `403 FORBIDDEN` | Logged-in user is not a candidate. |
| `404 NOT_FOUND` | n/a |

---

### EP-08 — PUT `/api/v1/candidate/skills`

Request body:
```json
{
  "skillIds": [
    "s001-uuid",
    "s003-uuid"
  ]
}
```

Success response, `200 OK`:
```json
{
  "candidateProfileId": "p001-uuid",
  "skills": [
    { "id": "s001-uuid", "name": "Flutter" },
    { "id": "s003-uuid", "name": "Git" }
  ]
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | `skillIds` is empty (UJ-01 edge case: must select at least 1 skill) or contains non-existent skill UUIDs. |
| `401 UNAUTHORIZED` | Missing or invalid candidate JWT. |
| `403 FORBIDDEN` | User role is not `CANDIDATE`. |
| `404 NOT_FOUND` | Candidate profile does not exist yet. |

---

### EP-09 — POST `/api/v1/candidate/projects`

Request body:
```json
{
  "title": "E-Commerce Mobile App",
  "description": "Candidate group capstone project built with Flutter and REST APIs.",
  "projectUrl": "https://github.com/sokhapech/shop"
}
```

Success response, `201 Created`:
```json
{
  "id": "proj001-uuid",
  "candidateProfileId": "p001-uuid",
  "title": "E-Commerce Mobile App",
  "description": "Candidate group capstone project built with Flutter and REST APIs.",
  "projectUrl": "https://github.com/sokhapech/shop",
  "createdAt": "2026-11-03T15:00:00.000Z"
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | `title` is blank or exceeds 150 characters. |
| `401 UNAUTHORIZED` | Missing or invalid candidate JWT. |
| `403 FORBIDDEN` | User role is not `CANDIDATE`. |
| `404 NOT_FOUND` | Candidate profile does not exist. |

---

### EP-10 — GET `/api/v1/jobs`

Request body: `none`

Query parameters: `?category=Mobile%20Development&employmentType=INTERNSHIP&search=Flutter`

Success response, `200 OK`:
```json
{
  "total": 1,
  "jobs": [
    {
      "id": "j001-uuid",
      "title": "Junior Flutter Developer Intern",
      "category": "Mobile Development",
      "employmentType": "INTERNSHIP",
      "location": "Phnom Penh",
      "isRemote": false,
      "stipendAmountCents": 25000,
      "company": {
        "id": "c001-uuid",
        "name": "TechBridge Solutions",
        "logoUrl": null
      },
      "requiredSkills": [
        { "id": "s001-uuid", "name": "Flutter" },
        { "id": "s003-uuid", "name": "Git" }
      ],
      "createdAt": "2026-11-03T10:00:00.000Z"
    }
  ]
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | Invalid query filter value. |
| `401 UNAUTHORIZED` | n/a (publicly accessible). |
| `403 FORBIDDEN` | n/a |
| `404 NOT_FOUND` | n/a (returns empty array if no matching jobs). |

---

### EP-11 — GET `/api/v1/jobs/:id`

Request body: `none`

Success response, `200 OK`:
```json
{
  "id": "j001-uuid",
  "title": "Junior Flutter Developer Intern",
  "description": "Great internship opportunity for IT candidates to build mobile apps...",
  "category": "Mobile Development",
  "employmentType": "INTERNSHIP",
  "location": "Phnom Penh",
  "isRemote": false,
  "stipendAmountCents": 25000,
  "status": "OPEN",
  "company": {
    "id": "c001-uuid",
    "name": "TechBridge Solutions",
    "website": "https://techbridge.kh",
    "description": "Leading tech company..."
  },
  "requiredSkills": [
    { "id": "s001-uuid", "name": "Flutter" },
    { "id": "s003-uuid", "name": "Git" },
    { "id": "s004-uuid", "name": "Docker" }
  ],
  "createdAt": "2026-11-03T10:00:00.000Z"
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | `:id` is not a valid UUID. |
| `401 UNAUTHORIZED` | n/a |
| `403 FORBIDDEN` | n/a |
| `404 NOT_FOUND` | Job listing with given ID does not exist. |

---

### EP-12 — GET `/api/v1/jobs/:id/fit`

Request body: `none`

Success response, `200 OK`:
```json
{
  "jobId": "j001-uuid",
  "jobTitle": "Junior Flutter Developer Intern",
  "matchScore": 67,
  "totalRequired": 3,
  "matchedCount": 2,
  "matchingSkills": [
    { "id": "s001-uuid", "name": "Flutter" },
    { "id": "s003-uuid", "name": "Git" }
  ],
  "missingSkills": [
    { "id": "s004-uuid", "name": "Docker" }
  ]
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | Candidate profile has 0 skills registered (UJ-03 edge case). |
| `401 UNAUTHORIZED` | Missing or invalid candidate JWT. |
| `403 FORBIDDEN` | User role is not `CANDIDATE`. |
| `404 NOT_FOUND` | Target job listing does not exist. |

---

### EP-13 — GET `/api/v1/candidate/saved-jobs`

Request body: `none`

Success response, `200 OK`:
```json
[
  {
    "savedAt": "2026-11-03T16:00:00.000Z",
    "job": {
      "id": "j001-uuid",
      "title": "Junior Flutter Developer Intern",
      "company": "TechBridge Solutions",
      "location": "Phnom Penh"
    }
  }
]
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | n/a |
| `401 UNAUTHORIZED` | Missing or invalid candidate JWT. |
| `403 FORBIDDEN` | User role is not `CANDIDATE`. |
| `404 NOT_FOUND` | n/a |

---

### EP-14 — POST `/api/v1/jobs/:id/save`

Request body: `none`

Success response, `201 Created`:
```json
{
  "jobListingId": "j001-uuid",
  "status": "SAVED",
  "savedAt": "2026-11-03T16:00:00.000Z"
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | Invalid job UUID format. |
| `401 UNAUTHORIZED` | Missing candidate JWT. |
| `403 FORBIDDEN` | User role is not `CANDIDATE`. |
| `404 NOT_FOUND` | Job listing does not exist. |
| `409 CONFLICT` | Job is already saved. |

---

### EP-15 — DELETE `/api/v1/jobs/:id/save`

Request body: `none`

Success response, `200 OK`:
```json
{
  "jobListingId": "j001-uuid",
  "status": "REMOVED"
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | Invalid job UUID. |
| `401 UNAUTHORIZED` | Missing candidate JWT. |
| `403 FORBIDDEN` | User role is not `CANDIDATE`. |
| `404 NOT_FOUND` | Job was not previously saved. |

---

### EP-16 — POST `/api/v1/jobs/:id/apply`

Request body: `none`

Success response, `201 Created`:
```json
{
  "id": "app001-uuid",
  "jobListingId": "j001-uuid",
  "candidateProfileId": "p001-uuid",
  "matchScore": 67,
  "status": "SUBMITTED",
  "appliedAt": "2026-11-03T16:30:00.000Z"
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | Candidate profile has no skills added. |
| `401 UNAUTHORIZED` | Missing or invalid candidate JWT. |
| `403 FORBIDDEN` | User role is `EMPLOYER`. |
| `404 NOT_FOUND` | Job listing does not exist or has `status = "CLOSED"`. |
| `409 CONFLICT` | Candidate has already applied to this job listing (UJ-07 edge case). |

---

### EP-17 — GET `/api/v1/candidate/applications`

Request body: `none`

Success response, `200 OK`:
```json
[
  {
    "id": "app001-uuid",
    "job": {
      "id": "j001-uuid",
      "title": "Junior Flutter Developer Intern",
      "company": "TechBridge Solutions"
    },
    "matchScore": 67,
    "status": "SUBMITTED",
    "appliedAt": "2026-11-03T16:30:00.000Z"
  }
]
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | n/a |
| `401 UNAUTHORIZED` | Missing or invalid candidate JWT. |
| `403 FORBIDDEN` | User role is not `CANDIDATE`. |
| `404 NOT_FOUND` | n/a |

---

### EP-18 — POST `/api/v1/employer/company`

Request body:
```json
{
  "name": "TechBridge Solutions",
  "industry": "Software Development",
  "location": "Phnom Penh, Cambodia",
  "website": "https://techbridge.kh",
  "description": "Leading tech company providing digital solutions."
}
```

Success response, `200 OK` (or `201 Created`):
```json
{
  "id": "c001-uuid",
  "name": "TechBridge Solutions",
  "industry": "Software Development",
  "location": "Phnom Penh, Cambodia",
  "website": "https://techbridge.kh",
  "description": "Leading tech company providing digital solutions.",
  "updatedAt": "2026-11-03T16:45:00.000Z"
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | `name` is missing or empty. |
| `401 UNAUTHORIZED` | Missing or invalid employer JWT. |
| `403 FORBIDDEN` | User role is not `EMPLOYER`. |
| `404 NOT_FOUND` | n/a |

---

### EP-19 — GET `/api/v1/employer/jobs`

Request body: `none`

Success response, `200 OK`:
```json
[
  {
    "id": "j001-uuid",
    "title": "Junior Flutter Developer Intern",
    "status": "OPEN",
    "applicantCount": 4,
    "createdAt": "2026-11-03T10:00:00.000Z"
  }
]
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | n/a |
| `401 UNAUTHORIZED` | Missing or invalid employer JWT. |
| `403 FORBIDDEN` | User role is not `EMPLOYER`. |
| `404 NOT_FOUND` | Recruiter has not set up a company profile. |

---

### EP-20 — POST `/api/v1/employer/jobs`

Request body:
```json
{
  "title": "Junior Flutter Developer Intern",
  "description": "Great internship opportunity for candidates to learn Flutter in a team...",
  "category": "Mobile Development",
  "employmentType": "INTERNSHIP",
  "location": "Phnom Penh",
  "isRemote": false,
  "stipendAmountCents": 25000,
  "requiredSkillIds": [
    "s001-uuid",
    "s003-uuid",
    "s004-uuid"
  ]
}
```

Success response, `201 Created`:
```json
{
  "id": "j001-uuid",
  "title": "Junior Flutter Developer Intern",
  "status": "OPEN",
  "companyId": "c001-uuid",
  "requiredSkills": [
    { "id": "s001-uuid", "name": "Flutter" },
    { "id": "s003-uuid", "name": "Git" },
    { "id": "s004-uuid", "name": "Docker" }
  ],
  "createdAt": "2026-11-03T17:00:00.000Z"
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | Title missing, description too short, or `requiredSkillIds` is empty (UJ-06 edge case: must select at least 1 required skill). |
| `401 UNAUTHORIZED` | Missing or invalid employer JWT. |
| `403 FORBIDDEN` | User role is not `EMPLOYER`. |
| `404 NOT_FOUND` | Recruiter company profile has not been created yet. |

---

### EP-21 — GET `/api/v1/employer/jobs/:id/applications`

Request body: `none`

Success response, `200 OK`:
```json
[
  {
    "id": "app001-uuid",
    "matchScore": 67,
    "status": "SUBMITTED",
    "appliedAt": "2026-11-03T16:30:00.000Z",
    "candidateProfile": {
      "fullName": "Sokha Pech",
      "university": "Royal University of Phnom Penh",
      "major": "Computer Science",
      "yearOfStudy": 3,
      "portfolioUrl": "https://github.com/sokhapech",
      "matchingSkills": ["Flutter", "Git"],
      "missingSkills": ["Docker"]
    }
  }
]
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | Invalid job ID format. |
| `401 UNAUTHORIZED` | Missing or invalid employer JWT. |
| `403 FORBIDDEN` | Job listing does not belong to the logged-in employer's company. |
| `404 NOT_FOUND` | Job listing not found. |

---

### EP-22 — PATCH `/api/v1/employer/applications/:id/status`

Request body:
```json
{
  "status": "UNDER_REVIEW"
}
```

Success response, `200 OK`:
```json
{
  "id": "app001-uuid",
  "status": "UNDER_REVIEW",
  "updatedAt": "2026-11-03T17:15:00.000Z"
}
```

| Error | When it happens |
|---|---|
| `400 VALIDATION_ERROR` | `status` is not one of: `SUBMITTED`, `UNDER_REVIEW`, `ACCEPTED`, `REJECTED`. |
| `401 UNAUTHORIZED` | Missing or invalid employer JWT. |
| `403 FORBIDDEN` | Application belongs to a job owned by another company. |
| `404 NOT_FOUND` | Application ID not found. |

---

### EP-23 — GET `/api/v1/candidate/guides`

Headers:
* `Authorization: Bearer <candidate_jwt>`

Request body: `none`

Success response, `200 OK`:
```json
[
  {
    "id": "g001-uuid",
    "title": "How to Structure an IT Internship Portfolio",
    "category": "Portfolio Guides",
    "summary": "Step-by-step tips for candidates showcasing coding projects to employers.",
    "content": "## Building Your First Portfolio\nWhen applying for your first software job..."
  }
]
```

| Error | When it happens |
|---|---|
| `401 UNAUTHORIZED` | Missing or invalid candidate JWT. |
| `403 FORBIDDEN` | User role is not `CANDIDATE`. |
| `404 NOT_FOUND` | Candidate profile does not exist. |

---

## 4. Test Collection

The complete Postman collection is committed directly to [`api-specs/devpath.postman_collection.json`](../../api-specs/devpath.postman_collection.json).

Each request tests response status codes and body structures using collection variables:
- `{{baseUrl}}`: `http://localhost:8000`
- `{{candidateToken}}`: Extracted automatically from EP-03 login.
- `{{employerToken}}`: Extracted automatically from recruiter login.

| ID | Request Name in Collection | Assertions |
|---|---|---|
| **EP-01** | `EP-01 Health Check` | Status 200; `status` equals `"ok"`; `timestamp` exists |
| **EP-02** | `EP-02 Register Candidate` | Status 201; `id` exists; `role` equals `"CANDIDATE"` |
| **EP-03** | `EP-03 Login` | Status 200; `token` exists; `user.role` exists |
| **EP-04** | `EP-04 Get Current User Profile` | Status 200; `email` and `role` match logged-in user |
| **EP-05** | `EP-05 List Skills Taxonomy` | Status 200; response is an Array; items have `id`, `name`, `category` |
| **EP-06** | `EP-06 Get Candidate Profile` | Status 200; `fullName` exists; `skills` is an Array |
| **EP-07** | `EP-07 Update Candidate Profile` | Status 200; `fullName` and `university` match payload |
| **EP-08** | `EP-08 Update Candidate Skills` | Status 200; `skills` is an Array with updated skill IDs |
| **EP-09** | `EP-09 Add Candidate Project` | Status 201; `id` exists; `title` matches payload |
| **EP-10** | `EP-10 Browse Beginner Jobs` | Status 200; `jobs` is an Array; captures sample `sampleJobId` |
| **EP-11** | `EP-11 Get Job Details` | Status 200; `title`, `company`, and `requiredSkills` exist |
| **EP-12** | `EP-12 Run Skill Gap Analysis` | Status 200; `matchScore` exists; `matchingSkills` and `missingSkills` are Arrays |
| **EP-13** | `EP-13 List Saved Jobs` | Status 200; response is an Array |
| **EP-14** | `EP-14 Save Job Listing` | Status 201; `status` equals `"SAVED"` |
| **EP-15** | `EP-15 Unsave Job Listing` | Status 200; `status` equals `"REMOVED"` |
| **EP-16** | `EP-16 Apply to Job Listing` | Status 201; `status` equals `"SUBMITTED"`; `matchScore` exists |
| **EP-17** | `EP-17 List Candidate Applications` | Status 200; response is an Array |
| **EP-18** | `EP-18 Create or Update Company Profile` | Status 200 or 201; `name` matches payload |
| **EP-19** | `EP-19 List Employer Job Postings` | Status 200; response is an Array |
| **EP-20** | `EP-20 Publish Entry-Level Job Listing` | Status 201; `id` exists; `requiredSkills` is an Array |
| **EP-21** | `EP-21 Review Job Applicants` | Status 200; response is an Array; items have `matchScore` and `candidateProfile` |
| **EP-22** | `EP-22 Update Applicant Status` | Status 200; `status` equals `"UNDER_REVIEW"` |
| **EP-23** | `EP-23 List Preparation Guides for Candidate` | Status 200; response is an Array; items have `title` and `content` |
