# Coaching Program Creation: Test Cases

| Field | Value |
|---|---|
| Spec file | `src/tests/owner/coaching-program-creation/coaching-program-creation.spec.ts` |
| Playwright project | `owner` (reuses the saved owner session) |
| Role | owner |
| Feature tags | `@coaching`, `@coaching-program-creation`, `@coaching-type`, `@coaching-access`, `@one-to-one-booking`, `@coaching-after-checkout` |
| Area code | COACH |
| Overall status | Automated |

## Scope
Creating a coaching program from **Coaching > Coaching Programs > Add New Program**: every coaching type,
the extra settings each type shows, Access, One to One booking, the After Checkout Page URL, the form's info icons and its input rules.
Facts come from `docs/product/coaching.md` (explored live on 2026-11-15).

Not covered here (see `coaching-program-management.md`): editing, deleting, searching and filtering programs.
Not covered at all yet: Pricing, Add Coach, categories, Library, quiz submissions, anything on the student side.

## Shared preconditions
- Logged in as the owner (saved session). The cookie banner is dismissed by the global overlay handler.
- Each test builds its own data with `buildCoachingProgram()` (title `QA-<word> Coaching <random>`).
- Images are never uploaded and never taken from the tenant: the form opens the Gallery (the app's media library, see `docs/product/gallery.md`) and picks the first item of its **Stock images** tab. Choosing a stock image does not import it, so nothing is added to the tenant.
- The tenant already holds the category **Testing for research** and the appointment **Free appoin**
  and the site page **QA After Checkout Test Page (safe to delete)** (slug `qa-after-checkout-test-page-safe-to-delete`),
  used as the defaults in the factory.
- Every test that creates a program deletes it afterwards through the list's row menu.

## Summary

| ID | Title | Type | Group | Suites | Priority | Status |
|---|---|---|---|---|---|---|
| TC-COACH-001 | Owner creates a Session Based program | positive | Functional | smoke, regression | P1 | Automated |
| TC-COACH-002 | Owner creates a Week Based program with its extra settings | positive | Functional | regression | P1 | Automated |
| TC-COACH-003 | Owner creates a Continuous program with its extra settings | positive | Functional | regression | P1 | Automated |
| TC-COACH-004 | Owner creates an Evergreen program | positive | Functional | regression | P1 | Automated |
| TC-COACH-005 | Owner creates a One to One program with booking | positive | Functional | regression | P1 | Automated |
| TC-COACH-006 | Owner creates a One to One program without booking | positive | Functional | regression | P1 | Automated |
| TC-COACH-007 | Owner sets a page of the site as the After Checkout page | positive | Functional | regression | P1 | Automated |
| TC-COACH-008 | Owner sets an external address as the After Checkout page | positive | Functional | regression | P1 | Automated |
| TC-COACH-011 | Each coaching type shows only its own settings | positive | UI | regression | P1 | Automated |
| TC-COACH-012 | One to One booking settings appear step by step | positive | UI | regression | P1 | Automated |
| TC-COACH-013 | Access info icons explain Private and Restricted | positive | UI | regression | P2 | Automated |
| TC-COACH-014 | Submission Visibility info icons explain All and Own | positive | UI | regression | P2 | Automated |
| TC-COACH-015 | After Checkout link shows where the student will go | positive | UI | regression | P1 | Automated |
| TC-COACH-021 | Empty form shows every required message | negative | Validation | smoke, regression | P1 | Automated |
| TC-COACH-022 | Short Description keeps at most 160 characters | negative | Validation | regression | P2 | Automated |
| TC-COACH-023 | Student Limit cannot go below 1 | negative | Validation | regression | P2 | Automated |
| TC-COACH-024 | Cancel on the booking warning keeps the form | negative | Validation | regression | P1 | Automated |

Status values: `Draft` -> `Approved` (only the human sets this) -> `Automated`. All cases below were approved by the human on 2026-11-15 and have a passing spec.

---

## TC-COACH-001: Owner creates a Session Based program

- **Type:** positive
- **Group:** Functional
- **Suites:** smoke, regression
- **Feature tags:** coaching, coaching-program-creation, coaching-type
- **Priority:** P1
- **Status:** Automated
- **Objective:** The main flow must work: an owner can create a program and find it again.

**Test data**
| Field | Value |
|---|---|
| Program | `buildCoachingProgram()` (Session Based, Public, category Testing for research, faker title, description, short description, student limit 2 to 20) |

**Steps**
1. Open the Coaching Programs list.
2. Click **Add New Program**.
3. Fill every required field, choose **Session Based**, pick a feature image and a banner image (stock images).
4. Click **Create**.
5. Click the back arrow, then search the list for the program's title.

**Expected result**
- The list shows the program's row with the type **Session**, the category and the status **PUBLIC**.

**Cleanup**
- Delete the program from the list.

---

## TC-COACH-002: Owner creates a Week Based program with its extra settings

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-type, coaching-access
- **Priority:** P1
- **Status:** Automated
- **Objective:** Week Based settings (visibility, previous sessions, habit tab) and Private access are saved.

**Test data**
| Field | Value |
|---|---|
| Program | `buildCoachingProgram({ coachingType: "Week Based", access: "Private", submissionVisibility: "Own", allowSubmissionOnPreviousSessions: true, habitTab: true })` |

**Steps**
1. Open the list, click **Add New Program**.
2. Fill the form with the data above and click **Create**.
3. Click the back arrow, then search the list for the program's title.

**Expected result**
- The edit form shows **Own** submission visibility, previous sessions **Allowed** and the Habit Tab enabled.
- The list shows the program's row with the type **Week** and the status **PRIVATE**.

**Cleanup**
- Delete the program from the list.

---

## TC-COACH-003: Owner creates a Continuous program with its extra settings

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-type, coaching-access
- **Priority:** P1
- **Status:** Automated
- **Objective:** Continuous settings, including enrolment in the current batch, and Restricted access are saved.

**Test data**
| Field | Value |
|---|---|
| Program | `buildCoachingProgram({ coachingType: "Continuous", access: "Restricted", allowEnrollmentInCurrentBatch: true, allowSubmissionOnPreviousSessions: true })` |

**Steps**
1. Open the list, click **Add New Program**.
2. Fill the form with the data above and click **Create**.
3. Click the back arrow, then search the list for the program's title.

**Expected result**
- The edit form shows previous sessions **Allowed** and **Allow Enrollment in Current Batch** switched on.
- The list shows the program's row with the type **Continuous** and the status **RESTRICTED**.

**Cleanup**
- Delete the program from the list.

---

## TC-COACH-004: Owner creates an Evergreen program

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-type, coaching-access
- **Priority:** P1
- **Status:** Automated
- **Objective:** Evergreen, the type with no extra settings, can be created, here with Hidden access.

**Test data**
| Field | Value |
|---|---|
| Program | `buildCoachingProgram({ coachingType: "Evergreen", access: "Hidden" })` |

**Steps**
1. Open the list, click **Add New Program**.
2. Fill the form with the data above and click **Create**.
3. Click the back arrow, then search the list for the program's title.

**Expected result**
- The list shows the program's row with the type **Evergreen** and the status **HIDDEN**.

**Cleanup**
- Delete the program from the list.

---

## TC-COACH-005: Owner creates a One to One program with booking

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-type, one-to-one-booking
- **Priority:** P1
- **Status:** Automated
- **Objective:** Booking settings of a One to One program are saved.

**Test data**
| Field | Value |
|---|---|
| Program | `buildCoachingProgram({ coachingType: "One to One Coaching", booking: buildCoachingBooking({ freeSlots: 2, renewalCycle: "Weekly", allowAdditionalSessions: true }) })` (appointment **Free appoin**) |

**Steps**
1. Open the list, click **Add New Program**.
2. Fill the form, choose **One to One Coaching**, switch **Enable Booking** on, set 2 free slots, choose
   **Weekly**, allow additional sessions, choose the appointment.
3. Click **Create**.

**Expected result**
- The edit form shows **Enable Booking** on, **2** free slots, **Weekly** checked, additional sessions allowed and the appointment **Free appoin** chosen.

**Cleanup**
- Delete the program from the list.

---

## TC-COACH-006: Owner creates a One to One program without booking

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-type, one-to-one-booking
- **Priority:** P1
- **Status:** Automated
- **Objective:** After the warning, a One to One program can be created without booking, and booking is then locked.

**Test data**
| Field | Value |
|---|---|
| Program | `buildCoachingProgram({ coachingType: "One to One Coaching" })` (no booking) |

**Steps**
1. Open the list, click **Add New Program**.
2. Fill the form, choose **One to One Coaching**, leave **Enable Booking** off.
3. Click **Create**, then **Continue Anyway** in the warning.

**Expected result**
- The **Enable Booking** switch on the edit form is disabled (booking cannot be turned on later).

**Cleanup**
- Delete the program from the list.

---

## TC-COACH-007: Owner sets a page of the site as the After Checkout page

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-after-checkout
- **Priority:** P1
- **Status:** Automated
- **Objective:** The page a student lands on after buying must be the one the owner chose.

**Test data**
| Field | Value |
|---|---|
| Program | `buildCoachingProgram({ afterCheckout: buildInternalAfterCheckout() })` (page **QA After Checkout Test Page (safe to delete)**) |

**Steps**
1. Open the list, click **Add New Program**.
2. Fill the form. In **After Checkout Page URL** stay on **Internal Page** and choose the page.
3. Click **Create**.

**Expected result**
- The **Internal Page** tab is the active tab on the edit form.
- The link above the tabs shows `<site>/qa-after-checkout-test-page-safe-to-delete`.
- **Reset to default** is shown.

**Cleanup**
- Delete the program from the list.

---

## TC-COACH-008: Owner sets an external address as the After Checkout page

- **Type:** positive
- **Group:** Functional
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-after-checkout
- **Priority:** P1
- **Status:** Automated
- **Objective:** An owner can send students to a page outside the site after buying.

**Test data**
| Field | Value |
|---|---|
| Program | `buildCoachingProgram({ afterCheckout: buildExternalAfterCheckout() })` (address `https://example.com/thank-you-<random>`) |

**Steps**
1. Open the list, click **Add New Program**.
2. Fill the form. In **After Checkout Page URL** open **External Page** and type the address.
3. Click **Create**.

**Expected result**
- The **External Page** tab is the active tab on the edit form.
- The link above the tabs shows the typed address.
- **Reset to default** is shown.

**Cleanup**
- Delete the program from the list.

---

## TC-COACH-011: Each coaching type shows only its own settings

- **Type:** positive
- **Group:** UI
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-type
- **Priority:** P1
- **Status:** Automated
- **Objective:** The form must show the right settings for the chosen type and none of the others.

**Test data**
None. One test per row of the table below (nothing is submitted).

| Type | Submission Visibility | Allow Submission on Previous Sessions | Allow Enrollment in Current Batch | Habit Tab | Enable Booking |
|---|---|---|---|---|---|
| Week Based | shown | shown | hidden | shown | hidden |
| Continuous | shown | shown | shown | shown | hidden |
| Session Based | shown | hidden | hidden | shown | hidden |
| Evergreen | hidden | hidden | hidden | hidden | hidden |
| One to One Coaching | hidden | hidden | hidden | hidden | shown |

**Steps**
1. Open the create form.
2. Choose the coaching type.

**Expected result**
- Each setting is shown or hidden exactly as in the row of that type.

**Cleanup**
- None (nothing is created).

---

## TC-COACH-012: One to One booking settings appear step by step

- **Type:** positive
- **Group:** UI
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-type, one-to-one-booking
- **Priority:** P1
- **Status:** Automated
- **Objective:** Booking options must only appear when they apply, so the owner is not offered options that do nothing.

**Steps**
1. Open the create form and choose **One to One Coaching**.
2. Switch **Enable Booking** on.
3. Set **Allowed Free Slots** to 1.

**Expected result**
- After step 1: **Enable Booking** is shown and off; the free slots field is hidden.
- After step 2: the free slots field and the appointment select are shown; the renewal cycle options and
  **Allow Additional Sessions** are hidden.
- After step 3: the four renewal options (One-time, Weekly, Monthly, Yearly) and **Allow Additional
  Sessions** are shown, and **One-time** is checked by default.

**Cleanup**
- None (nothing is created).

---

## TC-COACH-013: Access info icons explain Private and Restricted

- **Type:** positive
- **Group:** UI
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-access
- **Priority:** P2
- **Status:** Automated
- **Objective:** The form is the only place that explains these Access values, so the explanation must show.

**Steps**
1. Open the create form.
2. Hover the info icon next to **Private**, then next to **Restricted**.

**Expected result**
- Private shows: "The coaching program will remain public, but students must first request access from you in order to purchase."
- Restricted shows: "This coaching program will be visible everywhere, but users won't be able to buy it or send purchase requests."
- **Public** and **Hidden** have no info icon.

**Cleanup**
- None (nothing is created).

---

## TC-COACH-014: Submission Visibility info icons explain All and Own

- **Type:** positive
- **Group:** UI
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-type
- **Priority:** P2
- **Status:** Automated
- **Objective:** The owner must be told who can see submissions before choosing.

**Steps**
1. Open the create form and choose **Week Based**.
2. Hover the info icon next to **All**, then next to **Own**.

**Expected result**
- All shows: "All students can see each other's submissions."
- Own shows: "Students can only see their own submissions."

**Cleanup**
- None (nothing is created).

---

## TC-COACH-015: After Checkout link shows where the student will go

- **Type:** positive
- **Group:** UI
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-after-checkout
- **Priority:** P1
- **Status:** Automated
- **Objective:** The link above the tabs is the only feedback the owner gets, so it must always show the real destination.

**Steps**
1. Open the create form and look at **After Checkout Page URL**.
2. Choose the internal page **QA After Checkout Test Page (safe to delete)**.
3. Open **External Page** and type an address.
4. Go back to the **Internal Page** tab.
5. Click **Reset to default**.

**Expected result**
- After step 1: the link shows `<site>/student/dashboard/coaching-programs` and **Reset to default** is hidden.
- After step 2: the link shows `<site>/qa-after-checkout-test-page-safe-to-delete` and **Reset to default** is shown.
- After step 3: the link shows the typed address.
- After step 4: the link shows the internal page again (the link follows the active tab).
- After step 5: the link shows the default page again.

**Cleanup**
- None (nothing is created).

---

## TC-COACH-021: Empty form shows every required message

- **Type:** negative
- **Group:** Validation
- **Suites:** smoke, regression
- **Feature tags:** coaching, coaching-program-creation
- **Priority:** P1
- **Status:** Automated
- **Objective:** A program must not be created without its required information.

**Steps**
1. Open the create form directly.
2. Click **Create** without filling anything.

**Expected result**
- These messages are shown:
  - "Please input the coaching program title!"
  - "Please enter a Description"
  - "Please select a category!"
  - "Please select coaching program type"
  - "Please upload a feature image"
  - "Please upload a banner image"
- The create form is still shown (no program is created).

**Cleanup**
- None.

---

## TC-COACH-022: Short Description keeps at most 160 characters

- **Type:** negative
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation
- **Priority:** P2
- **Status:** Automated
- **Objective:** The length limit of the field is enforced.

**Steps**
1. Open the create form.
2. Enter 200 characters in **Short Description**.

**Expected result**
- The field holds only the first 160 characters.

**Cleanup**
- None.

---

## TC-COACH-023: Student Limit cannot go below 1

- **Type:** negative
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation
- **Priority:** P2
- **Status:** Automated
- **Objective:** A program must always allow at least one student.

**Steps**
1. Open the create form.
2. Look at **Student Limit**, then click the **+** button once.

**Expected result**
- The limit starts at **1** and the **-** button is disabled.
- After **+** the limit is **2** and the **-** button is enabled.

**Cleanup**
- None.

---

## TC-COACH-024: Cancel on the booking warning keeps the form

- **Type:** negative
- **Group:** Validation
- **Suites:** regression
- **Feature tags:** coaching, coaching-program-creation, coaching-type, one-to-one-booking
- **Priority:** P1
- **Status:** Automated
- **Objective:** The warning is the owner's last chance before booking is locked forever, and Cancel must not lose their work.

**Test data**
| Field | Value |
|---|---|
| Program | `buildCoachingProgram({ coachingType: "One to One Coaching" })` (no booking) |

**Steps**
1. Open the create form and fill it for a One to One program without booking.
2. Click **Create**.
3. Click **Cancel** in the warning.

**Expected result**
- The warning with the title "Warning: Booking Not Enabled" is shown after step 2.
- After Cancel the warning closes and the form still holds the entered title.

**Cleanup**
- None (nothing is created).

---

## Open questions (please decide)
1. **Feature tags.** I proposed `@coaching`, `@coaching-program-creation`, `@coaching-type`, `@coaching-access`
   and `@one-to-one-booking` and added them to `src/helpers/tags.ts`. Rename or remove any you do not want.
2. **Suspected bugs, not turned into tests** (a test that expects the correct behaviour would fail today):
   - A Title or Short Description made only of spaces passes the form validation.
   - Student Limit accepts a decimal (`1.5`).
   - The Short Description message has a typo: `program"s`.
   - **After Checkout:** an external address that is not an address at all (`not a url`) is accepted and saved as the link.
   - **After Checkout:** on the edit form of a program saved with an external address, the link above the tabs shows it but the **Enter URL** field is empty.
   - **After Checkout:** after saving an internal page, the select shows the page slug (`qa-after-checkout-test-page-safe-to-delete`) instead of its title.
   Which of these do you confirm as bugs? I will then add negative cases that stay red until fixed.
3. **Tenant data.** The tests rely on the category **Testing for research** and the appointment **Free appoin**
   existing on the shared tenant. Is that acceptable, or should the suite create its own category first?
4. **Access Control.** Should I add a case that a student cannot open the owner's create form? It needs a
   student-side page object.
5. **Access values on the student side.** Private ("students must request access") and Restricted ("cannot buy")
   are only checked on the owner side here. Their effect on a student belongs to a later e2e.
