# Coaching Category: Test Cases

| Field | Value |
|---|---|
| Spec file | `src/tests/owner/coaching-category/coaching-category.spec.ts` |
| Playwright project | `owner` (reuses the saved owner session) |
| Role | owner |
| Feature tags | `@coaching`, `@coaching-category` |
| Area code | COACH |
| Overall status | Automated |

## Scope
**Coaching > Coaching Categories**: creating, renaming, changing the image of, searching and deleting a category,
the dialogs, the 30-character name limit, the page size, and how a category connects to programs (a program uses
one, and a deleted category leaves it "Uncategorized"). Every case comes from behaviour observed live on 2026-11-15.

Not covered: the row checkboxes (they do nothing), pagination beyond the page size, the total counter (the tenant
is shared, so it changes between runs), and the student side.

## Shared preconditions
- Logged in as the owner (saved session).
- Each test makes its own category (`QA-Cat <random>`, 13 characters) through the `createCategory` fixture when it
  needs one as a starting point. The fixture deletes whatever is left afterwards.
- A category gets its picture from the Gallery **Stock images** tab (nothing is uploaded or added to the tenant).
- Saving an edit shows **no message** (create and delete do), so an edit is judged by the dialog closing and the
  row showing the result.

## Summary

| ID | Title | Type | Group | Suites | Priority | Status |
|---|---|---|---|---|---|---|
| TC-COACH-301 | Owner creates a category with a name only | positive | Functional | smoke, regression | P1 | Automated |
| TC-COACH-302 | Owner creates a category with an image | positive | Functional | regression | P1 | Automated |
| TC-COACH-303 | Owner renames a category | positive | Functional | regression | P1 | Automated |
| TC-COACH-304 | Owner replaces a category's image | positive | Functional | regression | P1 | Automated |
| TC-COACH-305 | Owner deletes a category | positive | Functional | smoke, regression | P1 | Automated |
| TC-COACH-306 | Owner cancels deleting a category | negative | Functional | regression | P1 | Automated |
| TC-COACH-307 | A new category can be given to a program | positive | Functional | regression | P1 | Automated |
| TC-COACH-308 | Deleting a category that a program uses leaves the program Uncategorized | negative | Functional | regression | P1 | Automated |
| TC-COACH-320 | The Add Category dialog shows its fields and Cancel creates nothing | positive | UI | regression | P1 | Automated |
| TC-COACH-321 | The Edit dialog shows the saved name and image | positive | UI | regression | P1 | Automated |
| TC-COACH-322 | The delete confirmation warns about programs | positive | UI | regression | P2 | Automated |
| TC-COACH-323 | Page size changes how many categories are listed | positive | UI | regression | P2 | Automated |
| TC-COACH-330 | Creating without a name shows its message | negative | Validation | smoke, regression | P1 | Automated |
| TC-COACH-331 | Saving an edit without a name shows its message | negative | Validation | regression | P1 | Automated |
| TC-COACH-332 | A name of 31 characters is refused | negative | Validation | regression | P1 | Automated |
| TC-COACH-333 | A name of exactly 30 characters is accepted | positive | Validation | regression | P2 | Automated |
| TC-COACH-334 | Searching for a name that does not exist shows No Data | negative | Validation | regression | P2 | Automated |

Status values: `Draft` -> `Approved` (only the human sets this) -> `Automated`. All cases below were approved by the human on 2026-11-15 and have a passing spec.

---

## TC-COACH-301: Owner creates a category with a name only

- **Type:** positive
- **Group:** Functional
- **Suites:** smoke, regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P1
- **Status:** Automated
- **Objective:** A category can be created with just a name (the image is optional).

**Test data**
| Field | Value |
|---|---|
| Category | `buildCoachingCategory()` (name `QA-Cat <random>`) |

**Steps**
1. Open **Coaching Categories**, click **Add Category**.
2. Type the name and click **Create**.
3. Search the list for the name.

**Expected result**
- The toast "Category created successfully" is shown and the dialog closes.
- The list shows the category's row.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-302: Owner creates a category with an image

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P1
- **Status:** Automated
- **Objective:** The image chosen from the Gallery is the one the list shows.

**Test data**
| Field | Value |
|---|---|
| Category | `buildCoachingCategory()` |
| Image | the first item of the Gallery **Stock images** tab |

**Steps**
1. Open **Coaching Categories**, click **Add Category**.
2. Type the name, click **Upload**, choose the first stock image and **Select**.
3. Click **Create**, then search the list for the name.

**Expected result**
- The toast "Category created successfully" is shown.
- The row's picture is the chosen stock image (its address is an `images.unsplash.com` address).

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-303: Owner renames a category

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P1
- **Status:** Automated
- **Objective:** A new name must be saved, and the old one must no longer exist.

**Test data**
| Field | Value |
|---|---|
| Existing category | made by `createCategory()` |
| New name | `buildCoachingCategory().name` |

**Steps**
1. Open the category's **Edit** from its row menu.
2. Replace the name and click **Update**.
3. Search the new name, then search the old name.

**Expected result**
- The dialog closes and the list shows a row with the new name.
- Searching the old name shows **No Data**.

**Cleanup**
- Deleted by the fixture (by its new name).

---

## TC-COACH-304: Owner replaces a category's image

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P1
- **Status:** Automated
- **Objective:** A new image replaces the old one in the list.

**Test data**
| Field | Value |
|---|---|
| Existing category | made by `createCategory({ withImage: true })` |
| New image | another item of the Gallery **Stock images** tab |

**Steps**
1. Open the category's **Edit**.
2. Delete the image, click **Upload**, choose a different stock image and **Select**.
3. Click **Update**, then search the name.

**Expected result**
- The dialog closes.
- The row's picture address is different from before.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-305: Owner deletes a category

- **Type:** positive
- **Group:** Functional
- **Suites:** smoke, regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P1
- **Status:** Automated
- **Objective:** Deleting must really remove the category.

**Test data**
| Field | Value |
|---|---|
| Existing category | made by `createCategory()` |

**Steps**
1. Open the category's row menu, click **Delete**.
2. Click **Delete** in the confirmation.
3. Search the name.

**Expected result**
- The toast "1 category deleted" is shown and the row disappears.
- Searching the name shows **No Data**.

**Cleanup**
- None (the test deletes its own data).

---

## TC-COACH-306: Owner cancels deleting a category

- **Type:** negative
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P1
- **Status:** Automated
- **Objective:** Answering **No** must never delete anything.

**Test data**
| Field | Value |
|---|---|
| Existing category | made by `createCategory()` |

**Steps**
1. Open the category's row menu, click **Delete**.
2. Click **No** in the confirmation.

**Expected result**
- The confirmation closes and the category's row is still shown.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-307: A new category can be given to a program

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-category, coaching-program-creation
- **Priority:** P1
- **Status:** Automated
- **Objective:** A category exists to be used: the program form offers it and the program shows it.

**Test data**
| Field | Value |
|---|---|
| Category | made by `createCategory()` |
| Program | `buildCoachingProgram({ category: <the new category's name> })` |

**Steps**
1. Create the program with the new category chosen in the **Category** select.
2. Open **Coaching Programs** and search the program.

**Expected result**
- The program's row shows the new category's name in its **Category** column.

**Cleanup**
- The program and the category are deleted by their fixtures.

---

## TC-COACH-308: Deleting a category that a program uses leaves the program Uncategorized

- **Type:** negative
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P1
- **Status:** Automated
- **Objective:** The delete dialog says "update its category before deleting" but does not block it. This protects the
  actual outcome: the program survives and shows **Uncategorized**.

**Test data**
| Field | Value |
|---|---|
| Category | made by `createCategory()` |
| Program | `buildCoachingProgram({ category: <the category's name> })` |

**Steps**
1. Open **Coaching Categories** and delete the category (confirm **Delete**).
2. Open **Coaching Programs** and search the program.

**Expected result**
- The category is gone (toast "1 category deleted").
- The program's row is still listed and shows **Uncategorized** in its **Category** column.

**Cleanup**
- The program is deleted by its fixture.

---

## TC-COACH-320: The Add Category dialog shows its fields and Cancel creates nothing

- **Type:** positive
- **Group:** UI
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P1
- **Status:** Automated
- **Objective:** The dialog offers what the owner needs, and leaving it must not create anything.

**Test data**
| Field | Value |
|---|---|
| Category | `buildCoachingCategory()` (typed but never created) |

**Steps**
1. Click **Add Category**.
2. Type a name, then click **Cancel**.
3. Search the name.

**Expected result**
- The dialog "CREATE NEW COACHING CATEGORY" shows a **Category name** box, an **Upload** area, **Cancel** and
  **Create**.
- After **Cancel** the dialog is closed and searching the name shows **No Data**.

**Cleanup**
- None (nothing is created).

---

## TC-COACH-321: The Edit dialog shows the saved name and image

- **Type:** positive
- **Group:** UI
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P1
- **Status:** Automated
- **Objective:** Editing must start from what is saved.

**Test data**
| Field | Value |
|---|---|
| Existing category | made by `createCategory({ withImage: true })` |

**Steps**
1. Open the category's **Edit**.

**Expected result**
- The dialog "UPDATE COACHING CATEGORY" shows the saved name in its box and shows that an image is chosen.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-322: The delete confirmation warns about programs

- **Type:** positive
- **Group:** UI
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P2
- **Status:** Automated
- **Objective:** The owner must be told that programs may be using the category.

**Test data**
| Field | Value |
|---|---|
| Existing category | made by `createCategory()` |

**Steps**
1. Open the category's row menu and click **Delete**.

**Expected result**
- The confirmation shows "Are you sure?", "Category will be deleted permanently." and the warning
  "If any coaching program is associated with this category, please update its category before deleting."
- It offers **No** and **Delete**.

**Cleanup**
- The test answers **No**; the fixture deletes the category.

---

## TC-COACH-323: Page size changes how many categories are listed

- **Type:** positive
- **Group:** UI
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P2
- **Status:** Automated
- **Objective:** The page size choice (5, 10, 15, 20, 30, 50) must control the list.

**Steps**
1. Open **Coaching Categories** (10 rows per page).
2. Choose **5 / page**.

**Expected result**
- Exactly 5 category rows are listed.

**Cleanup**
- None.

---

## TC-COACH-330: Creating without a name shows its message

- **Type:** negative
- **Group:** Validation
- **Suites:** smoke, regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P1
- **Status:** Automated
- **Objective:** A category must not be created without a name.

**Steps**
1. Click **Add Category**, leave the name empty, click **Create**.

**Expected result**
- The message "'name' is required" is shown and the dialog stays open.

**Cleanup**
- None (nothing is created).

---

## TC-COACH-331: Saving an edit without a name shows its message

- **Type:** negative
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P1
- **Status:** Automated
- **Objective:** An edit must not be able to remove a category's name.

**Test data**
| Field | Value |
|---|---|
| Existing category | made by `createCategory()` |

**Steps**
1. Open the category's **Edit**, clear the name, click **Update**.
2. Click **Cancel**, then search the original name.

**Expected result**
- The message "'name' is required" is shown and the dialog stays open.
- After **Cancel** the list still shows the category under its original name.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-332: A name of 31 characters is refused

- **Type:** negative
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P1
- **Status:** Automated
- **Objective:** The name length limit must be enforced.

**Test data**
| Field | Value |
|---|---|
| Name | `buildCoachingCategoryNameOfLength(31)` |

**Steps**
1. Click **Add Category**, type the 31-character name, click **Create**.
2. Click **Cancel**, then search the name.

**Expected result**
- The message "Name must be less than 30 characters." is shown and the dialog stays open.
- After **Cancel**, searching the name shows **No Data** (nothing was created).

**Cleanup**
- None.

---

## TC-COACH-333: A name of exactly 30 characters is accepted

- **Type:** positive
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P2
- **Status:** Automated
- **Objective:** Pins the real limit. The message says "less than 30", but exactly 30 is accepted today.

**Test data**
| Field | Value |
|---|---|
| Name | `buildCoachingCategoryNameOfLength(30)` |

**Steps**
1. Create a category with the 30-character name.

**Expected result**
- The toast "Category created successfully" is shown and the list shows the category's row.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-334: Searching for a name that does not exist shows No Data

- **Type:** negative
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** coaching, coaching-category
- **Priority:** P2
- **Status:** Automated
- **Objective:** A search with no match must say so instead of showing a broken table.

**Test data**
| Field | Value |
|---|---|
| Name searched | `buildCoachingCategory().name` (never created) |

**Steps**
1. Open **Coaching Categories**.
2. Search the name.

**Expected result**
- The list shows **No Data** and no category row.

**Cleanup**
- None.

---

## Suspected bugs found while researching (need your decision, none is a test yet)
1. **A name of only spaces is accepted:** "Category created successfully" appears and a category with a **blank
   name** is created (ID 1688, removed). A category with no name is unusable.
2. **The length message is off by one:** it says "Name must be less than 30 characters." but exactly 30 is accepted
   and only 31 is refused (covered by TC-COACH-333).
3. **Saving an edit shows no message,** unlike create ("Category created successfully") and delete
   ("1 category deleted"). The owner gets no confirmation.
4. **A category in use can be deleted:** the dialog tells the owner to update the programs first, but nothing
   blocks it, and the programs become **Uncategorized** (covered by TC-COACH-308 as today's behaviour).
5. **The row checkboxes do nothing:** ticking a row or the header box (all 10) adds no bulk action.
6. **The list shortens names:** it adds "..." after any name longer than 10 characters and shows only the first
   20 characters of a longer one (a 30-character name is cut, for example `QA-Cat A0BRavIYCSyTR...`).
7. **Duplicate names are allowed:** two categories can have the same name.
8. **After a delete the list and the search box disagree:** the box still holds the old search text but the list
   shows every category again. Typing the same text again does nothing (the page object empties the box first).

## Open questions (please decide)
1. **Duplicate names** (7 above): intended, or should the app refuse them?
2. **Deleting a category in use** (4 above): should it be blocked, or is "Uncategorized" the intended outcome? TC-COACH-308
   asserts today's behaviour, so it must change if you decide the other way.
3. **The image is optional** (a default picture is used). Intended?
4. **Access Control:** a student must not reach the owner's categories page. It needs a student-side page object.
5. The feature tag `@coaching-category` is proposed. Please approve or rename it.
