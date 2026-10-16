# Phase 2.2 — Core User Journeys

**Objective:** Describe the 5–8 most important things users do with your app, step by step, including what happens when something goes wrong. These journeys become your screens (Phase 4), your demo (Phase 6) and your test cases (Phase 7).

**Status:** Submitted · **Last updated:** 2026-10-15

## Done When

- [x] 5 to 8 journeys (UJ-01 … UJ-08), written in Given / When / Then form
- [x] Each journey has a happy path and at least one failure or edge-case path
- [x] Every Must-Have feature appears in the coverage table
- [x] Personas and terms match Phase 1

## 1. Writing Rules

- **Given** describes the starting situation, **When** the user's action, and **Then** the visible result.
- One action per **When**. Use **And** for extra steps.
- **Then** must be something you can check, such as a message, a screen or a saved record.

## 2. Journeys

### UJ-01 — Create a Student Profile

| Persona | Trigger | Pre-conditions | Features |
|---|---|---|---|
| P-01 | Wants to set up an account to check their skills | On the welcome screen, not logged in | F-01 |

```gherkin
Scenario: Happy path
  Given the user is on the registration screen
  When they enter a valid email and password
  And they select their current IT skills from a list
  Then their profile is saved and they go to the home dashboard

Scenario: Failure or edge case
  Given the user is on the registration screen
  When they submit without selecting any skills
  Then they see a red warning message saying "Please select at least one skill"
```

### UJ-02 — Browse Beginner Jobs

| Persona | Trigger | Pre-conditions | Features |
|---|---|---|---|
| P-01 | Looking for new internship openings in IT | Logged in | F-02 |

```gherkin
Scenario: Happy path
  Given the user is on the Job Board screen
  When they filter the list by "IT / Software"
  Then they see a list of only IT internships and beginner roles

Scenario: Failure or edge case
  Given the user is on the Job Board screen
  When they filter by a category that has no jobs yet
  Then they see an empty state image and "No jobs found for this category"
```

### UJ-03 — Run Skill Gap Analysis

| Persona | Trigger | Pre-conditions | Features |
|---|---|---|---|
| P-01 | Finds an interesting job and wants to know if they qualify | Logged in, profile has skills | F-03, F-02 |

```gherkin
Scenario: Happy path
  Given the user is looking at a specific Job Listing
  When they click the "Check My Fit" button
  Then they see a visual chart showing their matching skills in green and missing skills in red

Scenario: Failure or edge case
  Given the user has an empty Student Profile
  When they click the "Check My Fit" button
  Then they see a popup asking them to add skills to their profile first
```

### UJ-04 — Save a Job for Later

| Persona | Trigger | Pre-conditions | Features |
|---|---|---|---|
| P-01 | Likes a job but is not ready to apply today | Logged in, looking at a Job Listing | F-02 |

```gherkin
Scenario: Happy path
  Given the user is looking at a specific Job Listing
  When they click the bookmark icon
  Then the icon turns solid and the job appears in their "Saved Jobs" tab

Scenario: Failure or edge case
  Given the user has already saved the job
  When they click the solid bookmark icon again
  Then the job is removed from their "Saved Jobs" tab
```

### UJ-05 — View Preparation Hub

| Persona | Trigger | Pre-conditions | Features |
|---|---|---|---|
| P-01 | Realizes they lack portfolio projects for a job | Logged in | F-04 |

```gherkin
Scenario: Happy path
  Given the user is on the Preparation Hub screen
  When they click on the "IT Portfolio Guides" section
  Then they see a list of beginner project ideas and interview tips

Scenario: Failure or edge case
  Given the user is on the Preparation Hub screen
  When they click on a section that is under maintenance
  Then they see a message saying "Content coming soon"
```

## 3. Coverage

| Must-Have feature | Covered by journey(s) |
|---|---|
| F-01 | UJ-01, UJ-03 |
| F-02 | UJ-02, UJ-04 |
| F-03 | UJ-03 |