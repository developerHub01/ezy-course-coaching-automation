# Logout: Test Cases

| Field | Value |
|---|---|
| Spec file | `src/tests/auth/logout/logout.spec.ts` |
| Playwright project | `auth` (each test signs in itself in a fresh context) |
| Role | owner and student (their menus are different UIs) |
| Feature tags | `@authentication`, `@logout` |
| Area code | AUTH |
| Overall status | Draft |

## Scope
Signing out from the top-right avatar menu, separately for the owner and the student, and making
sure the session is really ended. Not covered: auto-logout on inactivity, token expiry.

## Shared preconditions
- Each test signs in through the UI in its own fresh context. Logout tests never use the shared
  saved sessions, so they cannot affect other tests. (Checked: logging out of a separate session did
  not end the saved owner or student session.)
- The cookie banner is dismissed automatically by the global overlay handler.
- Logout is found through the app's own avatar menu, never by searching the page for the text
  "Logout": the site-builder header also contains hidden Logout links.

## Known UI differences
| | Owner | Student |
|---|---|---|
| Where | Dashboard header, top-right avatar (`img "User profile picture"`) | Header on `/en/student/dashboard/`, top-right avatar |
| Menu | Account Info, Billing, Transaction History, Due Payments, Current Plan, Update Plan, **Logout** | Name, **Account**, **Logout** |
| After logout | `/en/` (public home) | `/en/` (public home) |

## Summary

| ID | Title | Type | Suites | Priority | Status |
|---|---|---|---|---|---|
| TC-AUTH-101 | Owner signs out from the avatar menu | positive | smoke, regression | P1 | Draft |
| TC-AUTH-102 | Student signs out from the avatar menu | positive | smoke, regression | P1 | Draft |
| TC-AUTH-103 | Back button after logout does not reveal the dashboard | negative | regression | P1 | Draft |

---

## TC-AUTH-101: Owner signs out from the avatar menu

- **Type:** positive
- **Group:** Functional
- **Suites:** smoke, regression
- **Feature tags:** authentication, logout
- **Priority:** P1
- **Status:** Draft
- **Objective:** An owner on a shared computer must be able to end their session.

**Steps**
1. Sign in as the owner and wait for `/en/dashboard/`.
2. Click the top-right avatar to open the account menu.
3. Click **Logout**.
4. Open `/en/dashboard/` again.

**Expected result**
- After logout, the URL leaves `/en/dashboard/` and lands on `/en/` (only the URL is asserted; the
  public home page is builder-made).
- Opening `/en/dashboard/` redirects to `/login` and the **Sign In** heading is shown.

**Cleanup**
- None (the context is discarded).

---

## TC-AUTH-102: Student signs out from the avatar menu

- **Type:** positive
- **Group:** Functional
- **Suites:** smoke, regression
- **Feature tags:** authentication, logout
- **Priority:** P1
- **Status:** Draft
- **Objective:** Students must be able to end their session.

**Steps**
1. Sign in as the student and open `/en/student/dashboard/`.
2. Click the top-right avatar to open the account menu.
3. Click **Logout**.
4. Open `/en/student/dashboard/` again.

**Expected result**
- After logout, the URL lands on `/en/`.
- Opening `/en/student/dashboard/` redirects to `/login` and the **Sign In** heading is shown.

**Cleanup**
- None.

---

## TC-AUTH-103: Back button after logout does not reveal the dashboard

- **Type:** negative
- **Group:** Access Control
- **Suites:** regression
- **Feature tags:** authentication, logout
- **Priority:** P1
- **Status:** Draft
- **Objective:** A previous user's dashboard must not be visible to the next person at the keyboard.

**Steps**
1. Sign in as the owner and wait for `/en/dashboard/`.
2. Log out from the avatar menu.
3. Press the browser **Back** button.

**Expected result**
- The URL ends on `/login`.
- The **Dashboard** heading is not visible.

**Cleanup**
- None.

---

## Open questions (please decide)
1. Should TC-AUTH-103 also be run for the student, or is the owner enough?
2. **Server-side logout:** I did not check whether an old session cookie still works after logout.
   If it does, that is a security finding. Should I add a case for it and report the result?
3. The student avatar menu appears in the header of `/en/student/dashboard/`. I assume that header is
   part of the app and not builder-made. Can you confirm?
