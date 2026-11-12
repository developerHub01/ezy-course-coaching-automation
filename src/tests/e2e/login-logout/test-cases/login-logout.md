# Login and Logout Journey (E2E): Test Cases

| Field | Value |
|---|---|
| Spec file | `src/tests/e2e/login-logout/login-logout.spec.ts` |
| Playwright project | `e2e` |
| Role | owner, then student (one user per test) |
| Feature tags | `@authentication`, `@login`, `@logout` |
| Area code | E2E |
| Overall status | Draft |

## Scope
One complete journey per role, in a single test: sign in, reach the dashboard, sign out, and confirm
the dashboard is no longer reachable. One user per test, one browser context. Not covered: two
users at the same time, cross-role access.

## Shared preconditions
- Starts logged out. Each test signs in itself, so logging out cannot affect any saved session.
- The cookie banner is dismissed automatically by the global overlay handler.
- Assertions use app-owned pages only (the dashboards).
- Note: these two journeys overlap with the single-step login and logout specs in `src/tests/auth/`.
  The difference is that the whole journey runs as one flow.

## Summary

| ID | Title | Type | Group | Suites | Priority | Status |
|---|---|---|---|---|---|---|
| TC-E2E-001 | Owner signs in, then signs out | positive | Functional | e2e, regression | P1 | Draft |
| TC-E2E-002 | Student signs in, then signs out | positive | Functional | e2e, regression | P1 | Draft |

---

## TC-E2E-001: Owner signs in, then signs out

- **Type:** positive
- **Group:** Functional
- **Suites:** e2e, regression
- **Feature tags:** authentication, login, logout
- **Priority:** P1
- **Status:** Draft
- **Objective:** The full owner session works from start to finish.

**Steps**
1. Open `/login` and sign in as the owner.
2. Wait for the owner dashboard.
3. Open the top-right avatar menu and click **Logout**.
4. Open `/en/dashboard/` again.

**Expected result**
- Steps 1 to 3 complete without errors. The page objects confirm each action themselves (login
  accepted by the API, dashboard ready, logout done), so the spec does not re-check them.
- After step 4: URL is `/login` and the **Sign In** heading is shown.

**Cleanup**
- None.

---

## TC-E2E-002: Student signs in, then signs out

- **Type:** positive
- **Group:** Functional
- **Suites:** e2e, regression
- **Feature tags:** authentication, login, logout
- **Priority:** P1
- **Status:** Draft
- **Objective:** The full student session works from start to finish.

**Steps**
1. Open `/login` and sign in as the student.
2. Open `/en/student/dashboard/`.
3. Open the top-right avatar menu and click **Logout**.
4. Open `/en/student/dashboard/` again.

**Expected result**
- Steps 1 to 3 complete without errors. The page objects confirm each action themselves (login
  accepted by the API, dashboard ready, logout done), so the spec does not re-check them.
- After step 4: URL is `/login` and the **Sign In** heading is shown.

**Cleanup**
- None.
