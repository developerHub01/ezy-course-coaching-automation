# Coaching Program Management: Test Cases

| Field | Value |
|---|---|
| Spec file | not written yet (waiting for your decision and approval) |
| Playwright project | `owner` (reuses the saved owner session) |
| Role | owner |
| Feature tags | `@coaching`, `@coaching-program-management` (PROPOSED, not yet in `tags.ts`) |
| Area code | COACH |
| Overall status | Draft |

## Scope
What an owner does with programs that already exist, on **Coaching > Coaching Programs**: edit and save,
delete, search by title, filter, and the row menu. The page objects for all of this already exist
(`CoachingProgramListPage`, `CoachingProgramEditPage`), so these cases can be automated without new POM work
except for the filters and the row menu entries beyond Edit and Delete.

Not covered: Pricing ("Add a price"), Add Coach, Preview Checkout and Clients pages (explored only as far as
opening them), categories, Library, quiz submissions, the student side.

## Shared preconditions
- Logged in as the owner (saved session).
- Tests that need an existing program create one first with `buildCoachingProgram()` through
  `CoachingProgramCreatePage.create()` and delete it in cleanup.
- Facts come from `docs/product/coaching.md`. Counters and the other 1400+ programs on the shared tenant are
  never asserted.
- The One to One booking lock is already asserted by TC-COACH-006 in `coaching-program-creation.md`, so it is not
  repeated here.

## Summary

| ID | Title | Type | Group | Suites | Priority | Status |
|---|---|---|---|---|---|---|
| TC-COACH-101 | Owner edits a program and saves the changes | positive | Functional | smoke, regression | P1 | Draft |
| TC-COACH-102 | Owner deletes a program | positive | Functional | regression | P1 | Draft |
| TC-COACH-103 | Owner cancels deleting a program | negative | Functional | regression | P1 | Draft |
| TC-COACH-104 | Owner finds a program by searching its title | positive | Functional | regression | P1 | Draft |
| TC-COACH-105 | Owner filters programs by category and session type, then clears the filters | positive | Functional | regression | P2 | Draft |
| TC-COACH-106 | The row menu offers its six actions | positive | UI | regression | P2 | Draft |
| TC-COACH-111 | Edit rejects an empty Title | negative | Validation | regression | P1 | Draft |
| TC-COACH-112 | Search with no match shows the empty message | negative | Validation | regression | P2 | Draft |
| TC-COACH-113 | The coaching type cannot be changed after creation | negative | Validation | regression | P1 | Draft |

Status values: `Draft` -> `Approved` (only the human sets this) -> `Automated`.

---

## TC-COACH-101: Owner edits a program and saves the changes

- **Type:** positive
- **Group:** Functional
- **Suites:** smoke, regression
- **Feature tags:** coaching, coaching-program-management
- **Priority:** P1
- **Status:** Draft
- **Objective:** Changes an owner makes to a program must be saved.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram({ coachingType: "Week Based" })` created in the test |
| New title | the old title plus ` EDITED` |
| New access | **Private** |
| New student limit | the old limit plus 1 (typed) |
| New submission visibility | **Own** |

**Steps**
1. Open the list, search the program's title, open **Edit** from its row menu.
2. Change the title, access, student limit and submission visibility.
3. Click **Update**.
4. Search the list for the new title and open **Edit** again.

**Expected result**
- After **Update**, the toast "Coaching Program Updated Successfully" is shown and the Coaching Programs list is
  shown.
- The row for the new title shows status **PRIVATE**.
- The edit form holds the new title, student limit, **Private** and **Own**.

**Cleanup**
- Delete the program from the list (by its new title).

---

## TC-COACH-102: Owner deletes a program

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-management
- **Priority:** P1
- **Status:** Draft
- **Objective:** Deleting must really remove the program, not only hide a row.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram()` created in the test |

**Steps**
1. Open the list, search the program's title.
2. Open the row menu, click **Delete**, answer **Yes**.
3. Reload the list and search the same title again.

**Expected result**
- The toast "Program deleted successfully" is shown and the row disappears.
- After the reload, the search shows no row for that title.

**Cleanup**
- None (the test deletes its own data).

---

## TC-COACH-103: Owner cancels deleting a program

- **Type:** negative
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-management
- **Priority:** P1
- **Status:** Draft
- **Objective:** Answering **No** must never delete anything.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram()` created in the test |

**Steps**
1. Open the list, search the program's title.
2. Open the row menu, click **Delete**, answer **No**.

**Expected result**
- The dialog "Are you sure you want to delete this program?" closes.
- The program's row is still shown.

**Cleanup**
- Delete the program from the list.

---

## TC-COACH-104: Owner finds a program by searching its title

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-management
- **Priority:** P1
- **Status:** Draft
- **Objective:** On a tenant with over a thousand programs, search is the only way to reach one.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram()` created in the test |

**Steps**
1. Open the list.
2. Type the program's full title in **Search**.

**Expected result**
- The list shows "Showing results for: <title>".
- The program's row is shown with its title.

**Cleanup**
- Delete the program from the list.

---

## TC-COACH-105: Owner filters programs by category and session type, then clears the filters

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-management, coaching-type
- **Priority:** P2
- **Status:** Draft
- **Objective:** The two filters narrow the list and **Clear Filters** brings the full list back.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram({ coachingType: "Week Based" })` created in the test |

**Steps**
1. Open the list. **Clear Filters** is disabled.
2. Choose the category **Testing for research** in the Category filter.
3. Choose **Week Based** in the Session Type filter.
4. Search the program's title.
5. Click **Clear Filters**.

**Expected result**
- After step 2, **Clear Filters** is enabled.
- After step 4, the program's row is shown and every visible row has the type **Week**.
- After step 5, **Clear Filters** is disabled again.

**Cleanup**
- Delete the program from the list.

**Needs new POM work:** the Category and Session Type filters (Ant Design selects) and the Clear Filters button.

---

## TC-COACH-106: The row menu offers its six actions

- **Type:** positive
- **Group:** UI
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-management
- **Priority:** P2
- **Status:** Draft
- **Objective:** Every action an owner needs on a program is reachable from its row.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram()` created in the test |

**Steps**
1. Open the list, search the program's title.
2. Click the three-dot cell of its row.

**Expected result**
- The menu shows **Edit**, **Delete**, **Add Coach**, **Pricing**, **Preview Checkout** and **Clients**.

**Cleanup**
- Delete the program from the list.

---

## TC-COACH-111: Edit rejects an empty Title

- **Type:** negative
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-management
- **Priority:** P1
- **Status:** Draft
- **Objective:** Editing must not allow a program to lose its title.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram()` created in the test |

**Steps**
1. Open the program's edit form from the list.
2. Clear the **Title**.
3. Click **Update**.

**Expected result**
- The message "Please input the coaching program title!" is shown.
- The edit form is still shown (the list is not opened).
- After clicking the back arrow, the list still shows the program under its original title.

**Cleanup**
- Delete the program from the list.

---

## TC-COACH-112: Search with no match shows the empty message

- **Type:** negative
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-management
- **Priority:** P2
- **Status:** Draft
- **Objective:** A search that finds nothing must say so instead of showing a broken list.

**Steps**
1. Open the list.
2. Type a random title that cannot exist, for example `QA-NOPE-<random>`, in **Search**.

**Expected result**
- The list shows "Showing results for: <text>" and no program row.
- The empty-state text is shown. **Today it reads "There was no program created yet", which is wrong for a
  search with no match (see Open questions).**

**Cleanup**
- None.

---

## TC-COACH-113: The coaching type cannot be changed after creation

- **Type:** negative
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-management, coaching-type
- **Priority:** P1
- **Status:** Draft
- **Objective:** Changing the type of a program that already has content and clients would break it, so the app locks it.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram({ coachingType: "Week Based" })` created in the test |

**Steps**
1. Open the program's edit form from the list.
2. Look at the **Select Coaching Type** options.

**Expected result**
- All five coaching type options are disabled and **Week Based** is the checked one.

**Cleanup**
- Delete the program from the list.

---

## Open questions (please decide)
1. **Which of these should I automate first?** TC-COACH-101 to 104 and 111 need no new POM work. TC-COACH-105
   and 106 need small additions (filters, the menu items).
2. **TC-COACH-112 and the empty-state text.** I can assert today's text, which would pin down a probable bug,
   or assert only that no row is shown. Which do you prefer?
3. **Access Control.** A student must not reach the owner's list or create form. It needs a student-side
   page object. Should I add TC-COACH-1xx for that?
4. **Pricing ("Add a price"), Add Coach, Preview Checkout and Clients** are only mapped, not explored in depth.
   Should I explore them next and draft cases?
5. **Feature tag** `@coaching-program-management` is proposed. Please approve or rename it before I add it to
   `src/helpers/tags.ts`.
