# EzyCourse Coaching Module: What We Know

Status: **explored in the live owner dashboard of the `demo1` tenant** (read-only pass 2026-11-12, then a
full create / edit / delete pass 2026-11-15 with throwaway `QA-Explore ...` programs, all deleted).
Help articles at help.ezycourse.com were used as a reference only: where they disagree with the live app,
**the live app wins** (see "Docs vs app").

## Where it lives
Owner dashboard sidebar, group **Coaching**:

| Page | URL |
|---|---|
| Coaching Programs | `/en/dashboard/coaching/coaching-programs/` |
| Library | `/en/dashboard/coaching/library/` |
| Coaching Categories | `/en/dashboard/coaching/categories/` |
| Coaching Quiz Submissions | `/en/dashboard/coaching/quiz-submissions/` |

Program screens: create `/coaching-programs/create/`, edit `/coaching-programs/<id>/edit/`, pricing
`/coaching-program/<id>/product-price/`, Visit/Clients `/en/coaching/<slug>-<id>/`,
Preview Checkout `/en/checkout/?product_id=<id>&product_type=coaching_program`.

## Coaching Programs list
- Counters: Programs (e.g. `1468/Unlimited`), Active Clients. Both change between runs.
- Filters, all **URL driven**: Category (`?category=<id>&categoryLabel=...`), Session Type (`&session=week`),
  Search (`?search=...`), pagination (`?page=2&pageSize=10`). **Clear Filters** is disabled until a filter is set.
- Session Type options: Week Based, Session Based, Continuous, Evergreen, One One.
- Page sizes: 10, 20, 50, 100 per page. Footer reads `1-10 of 1474 items`.
- Columns: ID, Title, Visit, Session Type, Category, Status, Start Date, End Date, Created At, Limit
  (header says "Students Limit" but each row shows ONE number, the limit), Action.
- Badges: CONTINUOUS, WEEK, SESSION, EVERGREEN, **ONE ONE** (one to one). Status badge: PUBLIC, PRIVATE,
  HIDDEN, RESTRICTED (the Access value). Start/End Date are `N/A` for a new program.
- Search with no match shows "There was no program created yet" (misleading copy, programs do exist).
- Structure: header and body are separate tables, plus a hidden empty-state table. There are **two
  "Add New Program" buttons** (top bar and empty state). The row Action cell is a bare icon:
  `cell "action-icon-wrapper"`.
- Row **Action menu**: Edit, Delete, Add Coach, Pricing, Preview Checkout, Clients.
  - Delete: dialog "Are you sure you want to delete this program?" with **No** / **Yes**. No keeps the row.
    Yes shows toast **"Program deleted successfully"**, removes the row and lowers the Programs counter by 1.
  - Add Coach: dialog "Manage Coaches" (program name, coach multi-select, **Cancel**, **Update Coaches**).
  - Pricing: page "You don't have any prices yet." with **Add a price** (not explored further).
  - Preview Checkout: checkout page showing the program and price FREE.
  - Clients and the **Visit** button both open `/en/coaching/<slug>-<id>/` in the same tab: tabs
    Activities and Clients ("All Client (0)", search, filters, "No Data"). Public builder-area, assert only
    on the owner dashboard where possible.

## Create A Coaching Program (`/coaching-programs/create/`)
Tabs at top: **Details**, **Pricing**. Submit button **Create**.

| Field | Required | Behaviour observed |
|---|---|---|
| Title | yes | no length limit (300 chars accepted). Whitespace-only is NOT rejected (see bugs) |
| Description | **yes** | rich-text editor (the docs wrongly call it optional) |
| Short Description | yes | counter `n / 160`, hard-capped at 160 characters. Whitespace-only NOT rejected |
| Category | yes | Ant Design select, search box, "No Data" when no match. **No inline "+ create"** |
| Access | default Public | radios PUBLIC / PRIVATE / HIDDEN / RESTRICTED, no extra fields for any. Only Private and Restricted have an info icon (tooltip text below). Public and Hidden have no tooltip |
| Student Limit | default 1 | number, +/- buttons, minus disabled at 1. `0` and `-5` snap to 1, letters are ignored, blank is allowed to stay empty, `99999` accepted, `1.5` accepted (see bugs) |
| Coaching Type | yes | radios, see below |
| Feature Image | yes | 144 x 144 |
| Banner Image | yes | 1376 x 288 |
| After Checkout Page URL | no | tabs Internal Page (page selector) / External Page (`Enter URL` textbox) |

**Access tooltips (hover the info icon, text read from the live form):**
- **Private**: "The coaching program will remain public, but students must first request access from you in
  order to purchase."
- **Restricted**: "This coaching program will be visible everywhere, but users won't be able to buy it or send
  purchase requests."
- Public and Hidden show no tooltip, so the form itself does not explain them. Student-side behaviour of
  each value (what a student sees, request-access flow) is still to be verified on the student side.

**Submission Visibility tooltips** (Week Based, Continuous, Session Based only):
- **All**: "All students can see each other's submissions."
- **Own**: "Students can only see their own submissions."

**Every icon on the form was hovered for every type** (initial, Week, Continuous, Session, Evergreen, One to
One with booking on and slots 1). Only the four tooltips above exist. The category, appointment, image and
page-selector icons have none. The Evergreen and One to One forms add no tooltips.

**Helper texts printed on the form (not tooltips):**
- Allow Submission on Previous Sessions: "Enable this to allow students to submit tasks for previous sessions.
  If disabled, students can only submit for the current session."
- Allow Enrollment in Current Batch: "When enabled, new students can join the ongoing batch of this continuous
  program."
- Habit Tab: "Enable this to show the Habit tab in the program feed."
- Enable Booking: "Enable this to allow students to book appointments for this coaching program."
- Allowed Free Slots: "Specify the number of free appointment sessions included with enrollment in this coaching
  program."
- Free Slots Renewal Cycle: "Determine how frequently the allocated free slots are reset for students." with
  One-time "Free slots are valid for the entire duration of enrollment", Weekly "Free slots reset every week",
  Monthly "Free slots reset every month", Yearly "Free slots reset every year".
- Allow Additional Sessions: "Enable this option to allow students to book additional sessions beyond their
  allocated free slots. Additional charges may apply based on appointment pricing."
- Select Appointment: "Select which appointment students can book for this one-to-one coaching program"
- Images: "144 x 144 (max size 100MB)" and "1376 x 288 (max size 100MB)".

**Description editor:** a toolbar of about 33 unlabelled icon buttons (no title or aria-label) plus two colour
textboxes (`#000000`, `#ffe066`). The buttons cannot be addressed by role and name, so a test should only type in
the editor area.

**Pricing tab on the create page:** clicking it before the program exists does nothing (no navigation, no
message). It only works after creation, from the row menu (Pricing) or the edit page.

**Images:** the upload button opens the **Gallery**, the app's media library (see `docs/product/gallery.md`),
limited here to the Image and Stock images tabs. Picking an item and pressing **Select** sets
`img "Program feature preview"` / `img "Banner"` plus `delete-feature-image-btn` / `delete-banner-image-btn`.
No cropper. Tests pick an existing item (never upload, the tenant Gallery is already crowded).

**Empty submit messages** (nothing is created, URL stays on /create/):
- Title: `Please input the coaching program title!`
- Description: `Please enter a Description`
- Short Description: `Provide coaching program"s short description!` (straight-quote typo)
- Category: `Please select a category!`
- Coaching type: `Please select coaching program type`
- Images: `Please upload a feature image`, `Please upload a banner image`

**Success:** toast **"Coaching Program Created Successfully"**, then redirect to
`/coaching-programs/<id>/edit/` (heading "Edit Coaching Program", button **Update**).

## After Checkout Page URL (create and edit form)
Where a student goes after buying. Optional. The link shown above the two tabs is a **live preview** of the
effective address and follows the **active tab**.

| State | Link above the tabs | Reset to default |
|---|---|---|
| Nothing set | `<site>/student/dashboard/coaching-programs` (default) | hidden |
| Internal Page tab, page chosen | `<site>/<page slug>` (for example `<site>/qa-after-checkout-test-page-safe-to-delete`) | shown |
| External Page tab, address typed | the typed address | shown |

- **Internal Page**: a searchable select (type to filter) listing the site pages by title and slug.
- **External Page**: a textbox with the placeholder `Enter URL`.
- Both tabs keep their value when you switch. **The tab that is active when you click Create/Update is the one
  saved.** Verified: internal only, external only, both set (the active tab wins), reset.
- **Reset to default** (a plain text control, not a button) clears the choice and the link returns to the default.
- On the edit form: the saved tab is active and the link shows the saved address.
- **Suspected bugs:** (1) an external value that is not an address (`not a url`) is accepted and saved;
  (2) on the edit form of an external address the **Enter URL** field is empty although the link shows it;
  (3) after saving an internal page, the select shows the slug instead of the page title.

### Coaching types and the extra settings each shows
| Type (group) | List badge | Extra settings on the form |
|---|---|---|
| One to One Coaching (One-to-One) | ONE ONE | "Appointment Settings" with **Enable Booking** (see below) |
| Week Based (Date Based) | WEEK | Submission Visibility (All default / Own), Allow Submission on Previous Sessions (switch "Not Allowed"/"Allowed"), Habit Tab (switch "Disabled"/"Enabled") |
| Continuous (Date Based) | CONTINUOUS | the three above plus **Allow Enrollment in Current Batch** (switch) |
| Session Based (Non-Date Based) | SESSION | Submission Visibility and Habit Tab only |
| Evergreen (Non-Date Based) | EVERGREEN | none on the form (phases are configured inside the program later) |

**One to One booking rules**
- Enable Booking off by default. When on: **Allowed Free Slots** (number, default 0, required `*`) and
  **Select Appointment** (select fed from the Appointments list). With slots above 0 it also shows
  **Free Slots Renewal Cycle** (radios One-time default, Weekly, Monthly, Yearly) and **Allow Additional
  Sessions** (switch).
- Creating a one to one program with booking OFF shows the modal **"Warning: Booking Not Enabled"**:
  booking can NOT be enabled later. Buttons **Cancel** (stays on the form with data kept) and
  **Continue Anyway** (creates it).
- Empty-submit with booking on did not flag the appointment field (not required).

### After creation (edit page)
- **Coaching Type radios are all disabled** (type is locked).
- One to one created without booking: Enable Booking switch disabled with note "Booking was not enabled when
  this program was created. This setting cannot be changed after creation."
- One to one created with booking: slots, renewal cycle and appointment persist.
- Edit works for: Title, Description, Short Description, Category, Access, Student Limit, Submission
  Visibility, toggles, images, After Checkout. Edit validation shows the same messages (empty title).
- **Update** shows toast **"Success Coaching Program Updated Successfully"** and returns to the **list**.
  Values persist (verified title, limit, access, visibility). The **arrow-left Back** button returns to the list.

## Coaching Categories
Title, total counter, search, table (checkbox, Category Id, Thumbnail, Category name, Category created,
Action), **Add Category**. **Not explored yet** (add/edit/delete).

## Library / Quiz Submissions
Library tabs: Tasks, Exercises, Lessons, Trackers, Forms (Meal Plans "Coming Soon"). Quiz Submissions:
totals for Quizzes, Submissions, Questions, a program filter, bulk Delete. **Not explored yet.**

## Docs vs app (live app wins)
- Docs: Category dropdown has a "+" to create a category inline. App: **no such button**.
- Docs: Description is optional-sounding. App: **required**.
- Docs: "One to one" is a toggle. App: a **radio** in the Coaching Type group.
- Docs say settings cannot be changed later and also list editable ones. App: the type and one-to-one
  booking are locked, the rest is editable.
- Docs describe 5 pricing plans on the Pricing tab. App shows an empty state with **Add a price**
  (not explored).

## Bug candidates (for the human to confirm, not yet reported)
1. Whitespace-only Title and Short Description are accepted by form validation.
2. Student Limit accepts a decimal (`1.5`).
3. Short Description error text has a straight quote typo: `program"s`.
4. Search with no results says "There was no program created yet".
5. Column header "Students Limit" shows a single value per row (Students count is not visible).
6. After Checkout: invalid external address accepted; empty Enter URL field on edit; slug shown instead of page title (see above).

## Facts that affect test design
- Shared tenant: 1400+ programs, many leftovers named "Auto ...". Tests create uniquely named data
  (faker plus a short suffix, prefix `QA-`) and delete **only their own** through the UI Delete action.
- Never assert exact counters or totals, they change between runs. A create raises Programs by 1 and a
  delete lowers it by 1, but other people share the tenant.
- Ant Design controls: for Category, Appointment and the list filters click the **visible** item
  (`.ant-select-item-option` filtered by text, or `getByTitle`). The `getByRole("option")` nodes are hidden
  accessibility copies and cannot be clicked. The sidebar has its own `combobox` (workspace switcher), so
  never use `getByRole("combobox").first()` for filters.
- The app is slow, keep the generous timeouts.
- Public-site pages (`/en/coaching/...`, checkout) are builder-made, assert only in the owner dashboard.

## Still unknown
Add Coach options, Pricing > Add a price (5 plan types), categories CRUD, library, quiz submissions,
what a student actually sees for each Access value (the owner-side meaning is in the tooltips above), student-side enrollment, program feed inside
Week / Continuous / Session / Evergreen programs, duplicate titles, Active Clients counter.
