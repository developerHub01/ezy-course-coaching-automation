# Login: Test Cases

| Field | Value |
|---|---|
| Spec file | `src/tests/auth/login/login.spec.ts` |
| Playwright project | `auth` (starts logged out) |
| Role | owner and student, plus `@guest` (logged-out visitor) for TC-AUTH-003, 004, 006 |
| Feature tags | `@authentication`, `@login` |
| Area code | AUTH |
| Overall status | Draft |

## Scope
Signing in through the UI at `/login` for both roles, the failure paths that matter (wrong
credentials, missing input), staying signed in, and blocking logged-out access to the dashboards.
Not covered: sign-up, forgot password, social login.

## Shared preconditions
- The login controller returns only once the browser has left `/login`. Everything is judged from
  what the user sees on screen, never from API responses.
- Fresh browser context, no saved session.
- Credentials come from `.env` through `src/helpers/env.ts`; never hardcoded.
- The cookie banner is dismissed automatically by the global overlay handler.
- Assertions use app-owned pages only (owner `/en/dashboard/`, student `/en/student/dashboard/`).
  The public site header and menus are built with the website builder and are never used as signals.
- The app is slow; waits rely on elements and URLs, never fixed delays.

## Summary

| ID | Title | Type | Suites | Priority | Status |
|---|---|---|---|---|---|
| TC-AUTH-001 | Owner signs in with valid credentials | positive | smoke, sanity, regression | P1 | Draft |
| TC-AUTH-002 | Student signs in with valid credentials | positive | smoke, regression | P1 | Draft |
| TC-AUTH-003 | Unregistered email is rejected | negative | regression | P1 | Draft |
| TC-AUTH-004 | Empty email and password are not submitted | negative | regression | P2 | Draft |
| TC-AUTH-005 | Signed-in owner stays signed in after a page reload | positive | regression | P2 | Draft |
| TC-AUTH-006 | Logged-out visitor cannot open the dashboards | negative | sanity, regression | P1 | Draft |

---

## TC-AUTH-001: Owner signs in with valid credentials

- **Type:** positive
- **Group:** Functional
- **Suites:** smoke, sanity, regression
- **Feature tags:** authentication, login
- **Priority:** P1
- **Status:** Draft
- **Objective:** If the owner cannot sign in, nothing else in the product is usable or testable.

**Test data**
| Field | Value |
|---|---|
| Email / password | owner credentials from `.env` |

**Steps**
1. Open `/login`.
2. Enter the owner email and password.
3. Click **Sign In**.

**Expected result**
- URL becomes `/en/dashboard/`.
- The **Dashboard** heading (level 1) is visible.
- Note: EzyCourse shows **no success toast** on login (verified for both roles), so success is
  proven by the redirect and the dashboard, not by a toast.

**Cleanup**
- None (fresh context is discarded).

---

## TC-AUTH-002: Student signs in with valid credentials

- **Type:** positive
- **Group:** Functional
- **Suites:** smoke, regression
- **Feature tags:** authentication, login
- **Priority:** P1
- **Status:** Draft
- **Objective:** Students must be able to reach their learning area.

**Test data**
| Field | Value |
|---|---|
| Email / password | student credentials from `.env` |

**Steps**
1. Open `/login`.
2. Enter the student email and password.
3. Click **Sign In**.
4. Open `/en/student/dashboard/`.

**Expected result**
- URL is no longer `/login` after signing in.
- The student dashboard stays at `/en/student/dashboard/` and shows the **Ongoing courses** and
  **Enrolled courses** headings.

**Cleanup**
- None.

---

## TC-AUTH-003: Unregistered email is rejected

- **Type:** negative
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** authentication, login
- **Priority:** P1
- **Status:** Draft
- **Objective:** Invalid credentials must never grant access.

**Test data**
| Field | Value |
|---|---|
| Email | faker, `example.com` domain, never a real user |
| Password | faker |

**Steps**
1. Open `/login`.
2. Enter the random unregistered email and password.
3. Click **Sign In**.

**Expected result**
- An error toast reading **"Invalid credentials"** appears (it disappears after a few seconds, so
  it is asserted immediately).
- URL stays `/login` and the Sign In form is still shown.
- Opening `/en/dashboard/` afterwards redirects to `/login` (no session was created).

**Cleanup**
- None.

---

## TC-AUTH-004: Empty email and password are not submitted

- **Type:** negative
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** authentication, login
- **Priority:** P2
- **Status:** Draft
- **Objective:** Required-field protection works, so no empty login request is sent.

**Steps**
1. Open `/login`.
2. Click **Sign In** without entering anything.

**Expected result**
- The Email field reports the browser validation message ("Please fill out this field.").
- URL stays `/login`.

**Cleanup**
- None.

---

## TC-AUTH-005: Signed-in owner stays signed in after a page reload

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** authentication, login
- **Priority:** P2
- **Status:** Draft
- **Objective:** The session survives a reload, so users are not logged out unexpectedly.

**Steps**
1. Sign in as the owner and wait for `/en/dashboard/`.
2. Reload the page.

**Expected result**
- URL is still `/en/dashboard/` and the **Dashboard** heading is visible.
- The user is not redirected to `/login`.

**Cleanup**
- None.

---

## TC-AUTH-006: Logged-out visitor cannot open the dashboards

- **Type:** negative
- **Group:** Access Control
- **Suites:** sanity, regression
- **Feature tags:** authentication, login
- **Priority:** P1
- **Status:** Draft
- **Objective:** Protected areas must never be reachable without signing in.

**Steps**
1. With no session, open `/en/dashboard/`.
2. With no session, open `/en/student/dashboard/`.

**Expected result**
- Both visits end on `/login` and show the **Sign In** heading.
- Neither dashboard heading is visible.

**Cleanup**
- None.

---

## Open questions (please decide)
1. **Wrong password on a real account.** Common case, but it could lock or rate-limit a real account
   on the shared demo tenant. Left out. Add it only if there is a throwaway account.
2. **Malformed email** is blocked by the browser, not by EzyCourse, so I left it out. Agree?
3. Is the **"Invalid credentials"** wording stable (no language or version variants)?
5. **No success toast on login.** Both roles log in with no success message at all, only a
   redirect. Is that intended product behaviour, or should a success toast exist? If you expect one,
   it is a bug to report, and I would not make the test depend on it until it is fixed.
4. TC-AUTH-005 covers the owner only. Add the student too, or is one enough?
