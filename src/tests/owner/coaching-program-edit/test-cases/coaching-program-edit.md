# Coaching Program Edit: Test Cases

| Field | Value |
|---|---|
| Spec file | `src/tests/owner/coaching-program-edit/coaching-program-edit.spec.ts` |
| Playwright project | `owner` (reuses the saved owner session) |
| Role | owner |
| Feature tags | `@coaching`, `@coaching-program-edit`, `@coaching-type`, `@coaching-access`, `@one-to-one-booking`, `@coaching-after-checkout` |
| Area code | COACH |
| Overall status | Automated |

## Scope
Changing a program that already exists, from its row menu **Edit** (the edit form, tab **Details**) plus the
tabs it offers. Every case below comes from behaviour observed live on 2026-11-15, and each one protects against a
regression that would silently lose or corrupt an owner's data.

Chosen because each is a place where a change to the form, the list or the backend can break saving:
every editable field (saved and shown again), the per-type settings, the locks, the After Checkout page, the
images, the validation, and the paths where nothing must be saved (Back, whitespace).

Not covered: Pricing (its own page), Add Coach, deleting (see `coaching-program-management.md`), and the student
side of an edit.

## Shared preconditions
- Logged in as the owner (saved session).
- Each test creates its own program with `buildCoachingProgram()` through `CoachingProgramCreatePage.create()`
  (deleted automatically by the fixture) and opens its edit form from the list. A program is never edited by
  address, only through the list.
- The edit form first shows a category's raw id (for example `1648`) for about a second, then its name. A test
  waits for the name before reading the category.
- Facts: `docs/product/coaching.md`, `docs/product/gallery.md`.

## What a test needs that does not exist yet (POM work)
- On the edit form the saved value covers the select's input, so **Category, Appointment and Internal Page must be
  opened by clicking the select box itself**, not the input (the current page object clicks the input and times out).
- Methods for deleting an image, opening the Drip tab, and going to a tab by name.

## Summary

| ID | Title | Type | Group | Suites | Priority | Status |
|---|---|---|---|---|---|---|
| TC-COACH-201 | Owner edits the basic details of a program | positive | Functional | smoke, regression | P1 | Automated |
| TC-COACH-202 | Owner edits the Week Based settings of a program | positive | Functional | regression | P1 | Automated |
| TC-COACH-203 | Owner edits the Continuous settings of a program | positive | Functional | regression | P1 | Automated |
| TC-COACH-204 | Owner edits the booking settings of a One to One program | positive | Functional | regression | P1 | Automated |
| TC-COACH-205 | Owner replaces the feature and banner images | positive | Functional | regression | P2 | Automated |
| TC-COACH-206 | Owner changes the After Checkout page to an external address | positive | Functional | regression | P1 | Automated |
| TC-COACH-207 | Owner resets the After Checkout page to the default | positive | Functional | regression | P1 | Automated |
| TC-COACH-208 | Saving a form without changes keeps every value | positive | Functional | regression | P1 | Automated |
| TC-COACH-209 | Back without saving discards the changes | negative | Functional | regression | P1 | Automated |
| TC-COACH-210 | Each coaching type's edit form locks the type and offers the right tabs | positive | UI | regression | P1 | Automated |
| TC-COACH-220 | Required fields on edit show their messages | negative | Validation | regression | P1 | Automated |
| TC-COACH-221 | A Title of only spaces is not saved | negative | Validation | regression | P1 | Automated |

Status values: `Draft` -> `Approved` (only the human sets this) -> `Automated`. All cases below were approved by the human on 2026-11-15 and have a passing spec.

---

## TC-COACH-201: Owner edits the basic details of a program

- **Type:** positive
- **Group:** Functional
- **Suites:** smoke, regression
- **Feature tags:** coaching, coaching-program-edit, coaching-access
- **Priority:** P1
- **Status:** Automated
- **Objective:** Every basic detail an owner changes must be saved and shown again, in the form and in the list.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram({ coachingType: "Session Based", access: "Public", studentLimit: 5 })` |
| New values | title plus ` EDITED`, a new description, a new short description, category **Technology**, access **Private**, student limit **8** |

**Steps**
1. Open the list, search the program's title, open **Edit** from its row menu.
2. Change the title, description, short description, category, access and student limit.
3. Click **Update**.
4. Search the list for the new title, then open **Edit** again.

**Expected result**
- After **Update** the toast "Coaching Program Updated Successfully" is shown and the programs list is shown.
- The list row of the new title shows category **Technology**, status **PRIVATE** and limit **8**.
- The edit form shows the new title, description, short description, category **Technology**, **Private** and **8**.

**Cleanup**
- Deleted by the fixture (by its new title).

---

## TC-COACH-202: Owner edits the Week Based settings of a program

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-edit, coaching-type
- **Priority:** P1
- **Status:** Automated
- **Objective:** Each Week Based setting can be switched in both directions and stays switched.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram({ coachingType: "Week Based", submissionVisibility: "All", allowSubmissionOnPreviousSessions: false, habitTab: true })` |
| Changes | visibility **Own**, previous sessions **Allowed**, Habit Tab **off** |

**Steps**
1. Open the program's edit form from the list.
2. Set submission visibility to **Own**, switch previous sessions on and the Habit Tab off.
3. Click **Update**, then open **Edit** again.

**Expected result**
- The edit form shows **Own**, previous sessions **Allowed** and the Habit Tab disabled.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-203: Owner edits the Continuous settings of a program

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-edit, coaching-type
- **Priority:** P1
- **Status:** Automated
- **Objective:** The Continuous-only setting (enrolment in the current batch) saves together with the shared ones.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram({ coachingType: "Continuous", allowEnrollmentInCurrentBatch: false, allowSubmissionOnPreviousSessions: true })` |
| Changes | **Allow Enrollment in Current Batch** on, previous sessions off |

**Steps**
1. Open the program's edit form from the list.
2. Switch **Allow Enrollment in Current Batch** on and previous sessions off.
3. Click **Update**, then open **Edit** again.

**Expected result**
- The edit form shows **Allow Enrollment in Current Batch** on and previous sessions **Not Allowed**.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-204: Owner edits the booking settings of a One to One program

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-edit, coaching-type, one-to-one-booking
- **Priority:** P1
- **Status:** Automated
- **Objective:** Booking settings drive what students can buy, so every one of them must save.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram({ coachingType: "One to One Coaching", booking: buildCoachingBooking({ freeSlots: 1, renewalCycle: "Monthly", allowAdditionalSessions: false }) })` (appointment **Free appoin**) |
| Changes | free slots **3**, renewal **Yearly**, additional sessions **Allowed**, appointment **Test reschedule sync** |

**Steps**
1. Open the program's edit form from the list.
2. Change the free slots, the renewal cycle, the additional sessions switch and the appointment.
3. Click **Update**, then open **Edit** again.

**Expected result**
- The edit form shows **Enable Booking** on, **3** free slots, **Yearly** checked, additional sessions **Allowed**
  and the appointment **Test reschedule sync**.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-205: Owner replaces the feature and banner images

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-edit
- **Priority:** P2
- **Status:** Automated
- **Objective:** Replacing an image (delete, then choose another from the Gallery) must not leave the program without one.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram()` |
| New images | the first item of the Gallery **Stock images** tab, for both |

**Steps**
1. Open the program's edit form from the list.
2. Delete the feature image and choose a stock image. Delete the banner image and choose a stock image.
3. Click **Update**, then open **Edit** again.

**Expected result**
- After step 2 the feature and banner previews are shown.
- After reopening, the feature and banner previews are shown.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-206: Owner changes the After Checkout page to an external address

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-edit, coaching-after-checkout
- **Priority:** P1
- **Status:** Automated
- **Objective:** Students are sent to the page the owner chose, so a change here must save.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram({ afterCheckout: buildInternalAfterCheckout() })` |
| Change | **External Page** with `buildExternalAfterCheckout().url` |

**Steps**
1. Open the program's edit form. Its link shows the internal page.
2. Open **External Page** and type the address.
3. Click **Update**, then open **Edit** again.

**Expected result**
- The **External Page** tab is the active tab and the link shows the typed address.
- **Reset to default** is shown.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-207: Owner resets the After Checkout page to the default

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-edit, coaching-after-checkout
- **Priority:** P1
- **Status:** Automated
- **Objective:** Removing a custom After Checkout page must really remove it, not only on screen.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram({ afterCheckout: buildInternalAfterCheckout() })` |

**Steps**
1. Open the program's edit form.
2. Click **Reset to default**.
3. Click **Update**, then open **Edit** again.

**Expected result**
- The link shows `<site>/student/dashboard/coaching-programs` and **Reset to default** is hidden.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-208: Saving a form without changes keeps every value

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-edit, coaching-access, coaching-type, coaching-after-checkout
- **Priority:** P1
- **Status:** Automated
- **Objective:** Re-saving what the owner never touched must not alter anything (a common cause of lost settings).

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram({ coachingType: "Week Based", access: "Private", studentLimit: 5, submissionVisibility: "Own", allowSubmissionOnPreviousSessions: true, habitTab: true, afterCheckout: buildInternalAfterCheckout() })` |

**Steps**
1. Open the program's edit form and change nothing.
2. Click **Update**, then open **Edit** again.

**Expected result**
- The edit form shows the same title, limit **5**, **Private**, **Own**, previous sessions **Allowed**, Habit Tab on,
  the internal After Checkout page, and both images.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-209: Back without saving discards the changes

- **Type:** negative
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-edit
- **Priority:** P1
- **Status:** Automated
- **Objective:** Leaving the form with the back arrow must never save what was typed.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram()` |
| Unsaved change | title plus ` UNSAVED` |

**Steps**
1. Open the program's edit form and change the title.
2. Click the back arrow (no Update).

**Expected result**
- The programs list is shown.
- Searching the original title shows the program, and searching the changed title shows no program.

**Cleanup**
- Deleted by the fixture (by its original title).

---

## TC-COACH-210: Each coaching type's edit form locks the type and offers the right tabs

- **Type:** positive
- **Group:** UI
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-edit, coaching-type
- **Priority:** P1
- **Status:** Automated
- **Objective:** The type cannot change after creation, and the **Drip** tab belongs to Session Based programs only.

**Test data**
One test per row. Existing program: `buildCoachingProgram({ coachingType: <type> })`.

| Type | Tabs on the edit page | Coaching type options |
|---|---|---|
| Week Based | Details, Pricing | all five disabled, **Week Based** checked |
| Continuous | Details, Pricing | all five disabled, **Continuous** checked |
| Session Based | Details, **Drip**, Pricing | all five disabled, **Session Based** checked |
| Evergreen | Details, Pricing | all five disabled, **Evergreen** checked |
| One to One Coaching | Details, Pricing | all five disabled, **One to One Coaching** checked |

**Steps**
1. Open the program's edit form from the list.

**Expected result**
- The tabs and the coaching type options are exactly as in the row of that type.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-220: Required fields on edit show their messages

- **Type:** negative
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-edit
- **Priority:** P1
- **Status:** Automated
- **Objective:** An edit must not be able to remove information the create form insists on.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram()` |

**Steps**
1. Open the program's edit form.
2. Clear **Title**, **Description** and **Short Description**, and delete the feature and banner images.
3. Click **Update**.

**Expected result**
- These messages are shown:
  - "Please input the coaching program title!"
  - "Description cannot be empty"
  - "Provide coaching program"s short description!"
  - "Please upload a feature image"
  - "Please upload a banner image"
- The edit form is still shown and the list still shows the program with its old title.

**Cleanup**
- Deleted by the fixture.

---

## TC-COACH-221: A Title of only spaces is not saved

- **Type:** negative
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-edit
- **Priority:** P1
- **Status:** Automated
- **Objective:** A program must never end up with a blank title.

**Test data**
| Field | Value |
|---|---|
| Existing program | `buildCoachingProgram()` |
| Title typed | three spaces |

**Steps**
1. Open the program's edit form and replace the title with three spaces.
2. Click **Update**.
3. Click the back arrow and search the list for the original title.

**Expected result**
- The message "title cannot be empty" is shown and the edit form stays open.
- The list still shows the program under its original title.
- (Known issue, see below: the app also shows a success toast. This case asserts only the points above.)

**Cleanup**
- Deleted by the fixture.

---

## Suspected bugs found while researching (need your decision, none is a test yet)
1. **Whitespace Title on edit:** the app shows "title cannot be empty" **and** a green "Coaching Program Updated
   Successfully" toast together, and stays on the form. Two contradictory messages.
2. **Different message for the same rule:** an empty Description says "Description cannot be empty" on edit but
   "Please enter a Description" on create.
3. **Drip tab cannot be saved:** **Save Changes** shows "Failed to update drip settings. Please try again." even for
   the default **Immediately**, and the toast repeats many times. It may need sessions first; please confirm the
   intended behaviour before I write a case.
4. **Turning Enable Booking off** on a program that has booking: **Update** does nothing, shows no message, and
   booking is still ON after reopening. Is booking meant to be locked once on, and if so should the switch be disabled?
5. **A program that does not exist** (for example id `99999999`): the edit address shows an empty "Edit Coaching
   Program" form with no error and no redirect.
6. **External address on edit:** the link shows it, but the **Enter URL** field is empty (also in the creation file).
7. **Category shows its id for about a second** on the edit form before the name appears.
8. **A booked program saved with 0 free slots** is accepted with no message, and the renewal and additional options
   disappear. Is 0 a valid value?

## Open questions (please decide)
1. **Duplicate titles are allowed** (two programs can have the same title). Intended, or should the app refuse?
2. **Student limit below the number of enrolled clients:** cannot be tested without a student enrolling. Should I add a
   student-side step so this case can exist? It is a likely data-loss risk.
3. **Pricing** opens from the edit page (`/coaching-program/<id>/product-price/`) and is empty for a new program. It is
   a separate feature; should I explore it and draft its cases?
4. Feature tag `@coaching-program-edit` is proposed. Please approve or rename it.
