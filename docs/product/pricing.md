# EzyCourse Pricing: What We Know

Status: **course pricing fully explored** in the live owner dashboard of the `demo1` tenant (2026-11-15, throwaway
course `QA-Explore Pricing`, ID 51117). Other products are only **partly surveyed**; see "Product map".
Live app wins over help articles.

## Where pricing lives
- Course: edit page tabs **Curriculum / Settings / Drip / Pricing**. URL `/en/dashboard/courses/<id>/pricing/`.
- Coaching: `/en/dashboard/coaching/coaching-programs/<id>`... pricing URL `/coaching-program/<id>/product-price/`
  (row Action menu > Pricing). Empty state "You don't have any prices yet." with **Add a price**.
- Community, Appointment, Digital Product, Physical Product: create form has tabs **Details / Pricing**. As with
  coaching, the Pricing tab only works after the item exists (not yet opened live).
- Group Chat: list has a **Pricing** column (values seen: `Free`, `One time`). Private Chat: page tabs
  **Members / Settings / Pricing**. Events and Digital/Physical lists show Price and Strike Through Price columns.
- Create a course: `/en/dashboard/courses/course-type/` offers Single course / Bundle course; single form is
  `/courses/create/`, only the name is required, creating redirects to `/courses/<id>/`.

## Pricing page behaviour (course)
- No prices: empty state with **Add a price**. With prices: heading `You have N price(s) for this product`, one
  card per price, and **Add more price**.
- Clicking add shows a **page section** (not a dialog): plan-type list on the left, form on the right, buttons
  **Cancel** / **Create**. Edit opens the same form in place with **Update**.
- **The picker only offers plan types not yet on the course.** After creating One-time Standard, One-time Flat Price
  and Donation (One Time), those three vanished from the picker; the others (Split, Subscription, Tiered, Sub Flat,
  Donation Recurring) stayed available and can repeat.
- The first price created becomes **Default**. Form state leaks when switching plan types (the "advance
  installment" checkbox stayed checked across plans).

## Plan types and their fields
Currency shown is USD. All number inputs are spinbuttons (`0.00` placeholder) with Increase/Decrease buttons.

| # | Plan | Fields | Required errors seen |
|---|---|---|---|
| 1 | One-time Plan (Standard) | Strike Through Price, Price, Course Expiry (Lifetime / Limited), Enable trial without a card? switch | `Please input price!`, `Please input expiry!` |
| 2 | Split Payment Plan | Strike Through, Amount per installment, Billing period, Use advance installment options (checkbox), Total Installments (`minimum 2`), Enrollment Expiry | not captured |
| 3 | Subscription Plan (Standard) | Strike Through, Price, Billing period, Trial Subscription switch, advance installments | `Interval is required!` (billing) |
| 4 | One-time Plan (Tiered) | Tier table First Unit / Last Unit / Per Unit, checkbox "Don't multiply price and unit after x quantity", Add another tier, Course Expiry | `Per unit price is required`, `Please input expiry!` |
| 5 | Subscription Plan (Tiered) | tier table, Billing period, Trial Subscription | `Per unit price is required`, `Interval is required!` |
| 6 | One-time Plan, Flat Price (Tiered) | table Unit / Price, Add another tier (no expiry field) | `Price is required` |
| 7 | Subscription Plan, Flat Price (Tiered) | table Unit / Price, Billing period, Trial Subscription | `Price is required`, `Interval is required!` |
| 8 | Donation Plan (One Time) | Suggest a preset amount, "Set limits" (Minimum / Maximum, optional), Text (rich editor, optional), Enrollment Expiry | only `Please input expiry!` |
| 9 | Donation Plan (Recurring) | preset amount, Minimum / Maximum, Billing period, Text | only `Interval is required!` |

Details:
- **Billing period options:** Daily, Weekly, Monthly, Yearly, Every 3 months, Every 6 months, Custom
  (Ant Design select, pick the visible `.ant-select-item-option`).
- **Expiry Limited** (one-time standard, tiered): shows "Course will expire after ... days". Split/Donation say
  "Enrollment Expiry", Limited shows "... Days after enrollment".
- **Trial:** one-time standard shows switch "Enable trial without a card?" then "Length of the trial in days".
  Subscription shows "Trial Subscription ?" switch, then a second switch "Without card ?" and "Length of the trial
  in days". Note: "Trial subscription will only work for PayPal & Stripe payment gateways."
- **Split / Subscription advanced installments:** checkbox reveals Initial Cycle Amount and Initial Cycle Length
  (split also Total Installments). Note: "...only work for Stripe payment gateway."
- **Tiers:** tier 1 starts at 1, the first row's Last Unit and all First Unit boxes are disabled, the last row's
  Last Unit is `∞`. Add another tier inserts a row with an editable Last Unit and a **close** button.
  The note says the first tier price is shown as the course price on cards.
- **Donation recurring** note: "Recurring donation will only work for Stripe payment gateway."

## Saved price card display
| Plan | Card shows |
|---|---|
| One-time standard | `#id`, tag One Time, Default, strike-through and price (`$20` struck, `$10`) |
| Split | `$10/month for 3 installments` |
| Subscription | tag Subscription, `$15/month` (`$5` struck, `$10/year` when strike set) |
| Tiered (one-time / subscription) | tier table with `$` values |
| Flat tiered | table Unit / Price |
| Donation | tag Donation, `Default Price $5`, `Minimum Donation 0` (recurring: `$5/month`, `$0/month`) |

## Card menu (ellipsis button)
Edit, Delete, Set as default (not on the default card), Copy Payment URL, Make it private / Make it public,
Archive.
- Delete: dialog `Are you sure? You want to delete this price?` **Cancel / Delete**, toast `Price deleted successfully`.
- Archive: dialog `Are you sure? Do you want to archive this price? If you archive, this price will be inactive.`
  **Cancel / Archive**, toast `Price Archive successfully`, the card leaves the list and the count drops (no archived
  view found on this page).
- Toasts: `Price set as default successfully`, `Price is made private`, `Link copied to clipboard`.
- The default card moves to the top of the list. A private card shows a **Private** tag.

## Bug candidates (not confirmed with the human)
1. Price `0` is accepted for a subscription (card `$0/week`).
2. Strike Through Price lower than Price (5 vs 10) is accepted.
3. Form values leak between plan types when switching.
4. Donation plans accept an empty preset amount.
5. Stale validation errors from one plan can show after switching to another.

## Product map (pricing support)
Legend: **Verified** = seen live. **Seen** = only a list or form text. **TODO** = not explored.

| Product | Pricing entry | Plan types offered | State |
|---|---|---|---|
| Course (single) | Pricing tab on edit | all 9 | Verified |
| Course (bundle) | probably same | TODO | TODO |
| Coaching program | `/coaching-program/<id>/product-price/` | TODO (same page type, list not read) | Seen |
| Community | Details/Pricing tabs on create/edit | TODO | Seen |
| Appointment | Details/Pricing tabs | TODO | Seen |
| Digital product | Details/Pricing tabs, list shows Price + Strike | TODO | Seen |
| Physical product | Details/Pricing tabs, list shows Price + Strike | TODO | Seen |
| Video library | row menu has Edit library, Preview checkout | TODO | TODO |
| Audio library | same as video | TODO | TODO |
| Event | list shows Price + Strike, `FREE` values | TODO | TODO |
| Membership | `/en/dashboard/membership/` (Student / Seller); blogs menus "One Time Pricing" and "Subscription Pricing" exist | TODO | TODO |
| Group chat | list Pricing column (Free / One time) | TODO | Seen |
| Private chat | page tab Pricing | TODO | Seen |

Row Action menus seen: community (View, Edit, Community Members, Community Settings, Tab Settings, Preview checkout,
Delete); appointment (View Appointments, Edit, Manually Book Appointment, Turn Off, Delete); digital/physical
(Preview checkout, Edit, Delete); video (View all videos, Add video, Edit library, Preview checkout, Delete);
events (View Event, Event Participants, Duplicate Event, Edit event, Update Category, Delete Event); group chat
(View, Preview Checkout, Group Members, Edit, Delete). These menus are not ARIA menuitems; click the visible
`.ant-dropdown li`.

## Facts for automation
- Pricing is a **shared component**: one `PricingComponent` (locators + controller) reused by every product page.
- Controller methods: `addPrice(plan, data)`, `editPrice`, `deletePrice`, `archivePrice`, `setDefault`,
  `makePrivate`, price count read from the heading. Judge by card text and toasts, not the API.
- Shared tenant: delete every price/course the test creates through the UI.
- Probe leftovers: course ID 51117 `QA-Explore Pricing ...` still exists and must be deleted.
