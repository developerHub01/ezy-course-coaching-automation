# <Feature name>: Test Cases

| Field | Value |
|---|---|
| Spec file | `src/tests/<role>/<feature>/<feature>.spec.ts` |
| Role | owner / student |
| Feature tags | `@student-management`, `@student-deletion` |
| Area code | STU |
| Overall status | Draft |

## Scope
What this spec covers and what it deliberately does not.

## Shared preconditions
- Logged in as <role> (session from `src/tests/setup/auth.setup.ts`)
- Data is created by each test with faker factories and deleted in cleanup.

## Summary

| ID | Title | Type | Suites | Priority | Status |
|---|---|---|---|---|---|
| TC-STU-001 | <title> | positive | smoke, regression | P1 | Draft |
| TC-STU-002 | <title> | negative | regression | P1 | Draft |

Status values: `Draft` -> `Approved` (only the human sets this) -> `Automated`.
Suites: smoke / sanity / regression / feature / e2e.
Priority: P1 = crucial, P2 = important.

---

## TC-STU-001: <title>

- **Type:** positive
- **Group:** Functional  (Functional / UI / Validation / Access Control)
- **Suites:** smoke, regression
- **Feature tags:** student-management
- **Priority:** P1
- **Status:** Draft
- **Objective:** one sentence, the risk this protects against.

**Test data**
| Field | Value |
|---|---|
| Student name | `buildStudent().fullName` (faker) |

**Steps**
1. <User action>
2. <User action>

**Expected result**
- <Observable outcome the spec will assert>

**Cleanup**
- <How the data this test created is deleted>

---

## TC-STU-002: <title>

(same structure)

---

## Open questions
- <Anything to discuss with the human before approval>
