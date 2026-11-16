# EzyCourse Pricing: What We Know

Status: **explored live on the owner dashboard of the `demo1` tenant, 2026-11-15 and 2026-11-16**, with throwaway
`QA-Explore ...` items. Live app wins over help articles. Everything below was seen on screen unless marked
**unverified**.

The rules in this document are also code: `src/helpers/data/pricing/pricing.matrix.ts` (matrix),
`pricing.types.ts` (data shapes) and `pricing.factory.ts` (default values). Specs read the rules from there.
The screen is driven by one shared component: `src/components/pricing/` (see "Automation map" at the end).

## 1. Where pricing lives

Every product has the **same pricing section** (plan list on the left, form on the right, price cards). Only the
page address differs. `<id>` is the product's own id from its list.

| Product | How to reach it | Pricing page path (`/en` prefix omitted) |
|---|---|---|
| Course | edit page tab **Pricing** | `/dashboard/courses/<id>/pricing/` |
| Membership | Membership > Student, row link **Pricing** | `/dashboard/membership/<id>/product-price/` |
| Coaching program | row Action menu > Pricing | `/dashboard/coaching-program/<id>/product-price/` |
| Community | edit page tab **Pricing** | `/dashboard/community/<id>/product-price/` |
| Appointment | edit page tab **Pricing** | `/dashboard/appointment-event/<id>/product-price/` |
| Digital product | edit page tab **Pricing** | `/dashboard/digital-product/<id>/product-price/` |
| Physical product | edit page tab **Pricing** | `/dashboard/digital-product/<id>/product-price/` (same path as digital) |
| Video library | edit library, tab **Pricing** | `/dashboard/video-library/<id>/product-price/` |
| Audio library | edit library, tab **Pricing** | `/dashboard/video-library/<id>/product-price/` (same path as video) |
| Event | edit event, tab **Pricing** | `/dashboard/event_product/<id>/product-price/` |
| Group chat | edit group, tab **Pricing** | `/dashboard/group/<id>/product-price/` |
| Private chat | page tab **Pricing** (Members / Settings / Pricing) | `/dashboard/private-chat/<id>/product-price/` |

- The **Pricing tab only works after the item exists**. The create form shows Details / Pricing tabs but Pricing does
  nothing before the first save.
- **Bundle course** (`/dashboard/bundle-courses/create/`) was not opened on its pricing page: **unverified**.
- **Membership blog pricing** (`/dashboard/blogs/membership-one-time-pricing/` and `...-subscription-pricing/`) is a
  different, tiny screen (Strike Through Price, Price Amount, Save). It is not this component.
- The tenant currency is not fixed (USD on 2026-11-15, RON on 2026-11-16). Never assert a currency code.

## 2. The pricing section

- No prices: text **"You don't have any prices yet."** and button **Add a price**.
- With prices: heading **"You have N price(s) for this product"** (`1 price`, `2 prices`), one card per price and
  button **Add more price**.
- Add opens a form section with the plan list on the left (not a dialog). Buttons **Cancel** / **Create**.
  Editing a card opens the same form with **Update**.
- Each card shows `#<id>` (for example `#322412`) and tags: the plan kind (One Time, Subscription, Donation, Split
  Payment Plan), **Default**, **Private**.
- The **first price created is the Default**. The default card is listed first.
- Form state **leaks between plans**: switching plans keeps some values (the advanced installments checkbox stayed
  ticked). A controller must set every field it cares about.

### Card menu (three-dot button, accessible name `ellipsis`)

Edit, Delete, Set as default (missing on the default card), Copy Payment URL, Make it private / Make it public,
Archive. The menu items are real `menuitem` roles here.

| Action | Dialog | Toast |
|---|---|---|
| Set as default | none | `Price set as default successfully` |
| Make it private | none | `Price is made private` (card gets a **Private** tag; item becomes "Make it public") |
| Make it public | none | text not captured; the Private tag disappears |
| Copy Payment URL | none | `Link copied to clipboard` |
| Archive | "Are you sure? Do you want to archive this price? If you archive, this price will be inactive." **Cancel / Archive** | `Price Archive successfully`, the card leaves the list |
| Delete | "Are you sure? You want to delete this price?" **Cancel / Delete** | `Price deleted successfully` |

An archived price leaves the list and **frees its slot** (see section 5). No archived view was found on the page.

**Editing (Update):**
- Update first asks "Are you sure? Do you want to continue updating this price?" with **Cancel / Continue**.
- The app does **not** change a price in place: it **replaces it**. The old card disappears and a card with a **new
  id** appears (verified on subscription and split). The Default tag moves with it.
- The plan cannot be changed while editing (the form shows only that plan's fields).

**Menu rules (verified by reading the buttons inside the menu items; the list entry itself is always enabled, the
action is a `button` that is disabled when not allowed):**

| Card | Edit | Delete | Set as default | Copy Payment URL | Make it private | Archive |
|---|---|---|---|---|---|---|
| Default price | on | on | (blank, not shown) | on | **off** | **off** |
| Non-default price, course | on | on | on | on | on | on |
| Non-default price, group chat | on | on | on | on | **off** | on |
| Private price (course) | on | on | **off** | on | shows "Make it public" | on |

So a default price can be neither archived nor made private, a private price cannot become the default, and on a
**group chat "Make it private" is never available** (split and subscription were both disabled). Disabled
actions show no tooltip or explanation.

## 3. Plan types

Nine plans exist. The plan list shows only the plans the product supports and that are still available.

| Key | Label in the plan list | Form heading |
|---|---|---|
| `one-time-standard` | One-time Plan(Standard) | One-time Plan (Standard) |
| `split-payment` | Split Payment Plan | Split Payment Plan |
| `subscription-standard` | Subscription Plan(Standard) | Subscription Plan (Standard) |
| `one-time-tiered` | One-time Plan(Tiered) | One-time Plan (Tiered) |
| `subscription-tiered` | Subscription Plan(Tiered) | Subscription Plan (Tiered) |
| `one-time-flat` | One-time Plan - Flat Price (Tiered) | One-time Plan (Tiered) (same heading as tiered) |
| `subscription-flat` | Subscription Plan - Flat Price(Tiered) | Subscription Plan (Tiered) (same heading) |
| `donation-one-time` | Donation Plan (One Time) | Donation Plan (One Time) |
| `donation-recurring` | Donation Plan (Recurring) | Donation Plan (Recurring) |

Tiered and flat plans share a form heading. They are told apart by the table header: tiered has
`First Unit / Last Unit / Per Unit`, flat has `Unit / Price`.

## 4. MATRIX A: which product supports which plan

`Y` = offered. `-` = not offered. Checked on each product's own pricing page, with an empty page where possible.

| Plan | Course | Membership | Coaching | Community | Video lib | Audio lib | Group chat | Private chat | Event | Appointment | Digital | Physical |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| one-time-standard | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| split-payment | Y | Y | Y | Y | Y | Y | Y | Y | **-** | - | - | - |
| subscription-standard | Y | Y | Y | Y | Y | Y | Y | Y | Y | - | - | - |
| one-time-tiered | Y | Y | - | - | - | - | - | - | - | - | - | - |
| subscription-tiered | Y | Y | - | - | - | - | - | - | - | - | - | - |
| one-time-flat | Y | Y | - | - | - | - | - | - | - | - | - | - |
| subscription-flat | Y | Y | - | - | - | - | - | - | - | - | - | - |
| donation-one-time | Y | Y | Y | Y | Y | Y | Y | Y | Y | - | - | - |
| donation-recurring | Y | Y | Y | Y | Y | Y | Y | Y | Y | - | - | - |
| **Total plans** | **9** | **9** | 5 | 5 | 5 | 5 | 5 | 5 | **4** | **1** | **1** | **1** |

Groups: **full (9)** course and membership; **core (5)** coaching, community, video, audio, group chat, private
chat; **event (4)** the core set without split payment; **single (1)** appointment, digital, physical (only
one-time standard).

Note: for products that already had a price when surveyed (coaching 4545, private chat 273, membership 7319,
course), the hidden plans were deduced from the live picker plus a second empty page of the same product
(coaching 4544 offered all five). The coaching, membership and private chat columns are therefore as reliable as
the others, but private chat and event were each seen on one page only.

## 5. MATRIX B: how many active prices of one plan a product accepts

Verified on course, group chat and video library (and consistent on coaching and event). Once the limit is
reached the plan **disappears from the plan list**. Deleting or archiving the price brings it back.

| Plan | Max active prices | Can the same plan be added again? |
|---|---|---|
| one-time-standard | **1** | No |
| one-time-tiered | **1** | No |
| one-time-flat | **1** | No |
| donation-one-time | **1** | No |
| donation-recurring | **1** | No |
| split-payment | unlimited | **Yes** |
| subscription-standard | unlimited | **Yes** |
| subscription-tiered | unlimited | **Yes** |
| subscription-flat | unlimited | **Yes** |

Rule of thumb: every one-time style plan and both donations take one price. Split and every subscription take
as many as wanted. Identical duplicate data is accepted (no uniqueness check). The same rule holds on every product
that offers the plan (group and video library were repeated end to end: one-time standard, donation one time and
donation recurring vanished after one price each, split and subscription stayed).

## 6. MATRIX C: which settings each plan shows, per product

Fields of the form. `R` = required, `o` = optional, `-` = not shown.

### one-time-standard

| Setting | Course | Membership | All other products |
|---|---|---|---|
| Strike Through Price | o | o | o |
| Price | R (`Please input price!`) | R | R |
| Expiry (Lifetime / Limited) | R, label "Course Expiry", Limited = "Course will expire after [n] days" | R, label "Membership Expiry" | **-** |
| Trial ("Enable trial without a card?" switch, then "Length of the trial in days") | o | o | **-** |

### split-payment (same on every product that offers it)

Strike Through Price (o), Amount per installment (R), Billing period (R, `Interval is required!`), Use advance
installment options (checkbox; then Initial Cycle Amount and Initial Cycle Length), Total Installments (R, placeholder
`minimum 2`), Enrollment Expiry (Lifetime / Limited, Limited = "[n] Days after enrollment"). Note on screen:
"This will only work for Stripe payment gateway."

### subscription-standard

| Setting | Course, Membership | Other products that offer it |
|---|---|---|
| Strike Through Price | o | o |
| Price | R | R |
| Billing period | R | R |
| Trial Subscription switch, then "Without card ?" switch and "Length of the trial in days" | o | **-** |
| Use advance installment options (Initial Cycle Amount, Initial Cycle Length) | o | o |

### one-time-tiered / subscription-tiered

Tier table `First Unit / Last Unit / Per Unit`. Row 1 is fixed (units 1 to 1, only the price is typed), the last
row runs to `∞`. **Add another tier** inserts a row before the last one with an editable Last Unit and a close
button. Per unit price is required on every row (`Per unit price is required`). Checkbox **Don't multiply price and
unit after x quantity** reveals one number box.

| Setting | Course | Membership |
|---|---|---|
| one-time-tiered expiry (Lifetime / Limited, required `Please input expiry!`) | R, label "Course Expiry" | **-** (no field) |
| subscription-tiered Billing period | R | R |
| subscription-tiered Trial Subscription | o | o |

### one-time-flat / subscription-flat

Table `Unit / Price` (one row to start, **Add another tier** adds rows with a close button). Price required on
every row (`Price is required`). Flat one-time has no expiry. Flat subscription adds Billing period (R) and Trial
Subscription (o, course and membership only).

### donation-one-time / donation-recurring

Suggest a preset amount (o), Minimum Amount (o), Maximum Amount (o), Text (o, rich editor, placeholder "Write
something..."). One-time adds Enrollment Expiry (Lifetime / Limited, `Please input expiry!`, "Days after
enrollment"); recurring adds Billing period (R, `Interval is required!`). The preset amount is NOT required
(an empty donation form passes with only the expiry or billing period filled). Note: "Recurring donation will only
work for Stripe payment gateway."

### Billing period options (every plan that has the select)

Daily, Weekly, Monthly, Yearly, Every 3 months, Every 6 months, **Custom** (Custom was not explored, so the factory
leaves it out).

### Trial / expiry summary

| Setting | Appears for |
|---|---|
| Trial switches (one-time standard, subscription standard, subscription tiered, subscription flat) | course, membership only |
| One-time standard expiry | course, membership only |
| One-time tiered expiry | course only |
| Split / donation one-time Enrollment Expiry | every product that offers them |

## 7. Card display after saving

| Plan | What the card shows |
|---|---|
| one-time-standard | tag One Time, `$20` struck through, `$10` |
| split-payment | tag Split Payment Plan, `$10/month for 3 installments` |
| subscription-standard | tag Subscription, `$15/month` (with strike: `$5` struck, `$10/year`); `$0/week` for price 0 |
| tiered (one-time and subscription) | the tier table with `$` values (First Unit, Last Unit, Per Unit) |
| flat (one-time and subscription) | table Unit / Price |
| donation-one-time | tag Donation, `Default Price $5`, `Minimum Donation 0` (with limits: `Minimum Donation $2`, `Maximum Donation $200`) |
| donation-recurring | tag Donation, `Default Price $5/month`, `Minimum Donation $0/month` (with limits: also `Maximum Donation $100/month`) |
| tiered with "Don't multiply" 10 | the tier table plus "The total tier price will be fixed at $70 after reaching 10 units." |
| split with advanced installments | `$11/month for first 2 installments and then $618.50/month for 4 installments`, strike price shown struck |

## 8. Bug candidates (not confirmed with the human)

1. ~~A price of `0` is accepted.~~ **Intended and known** (human, 2026-11-16). Tested as accepted (TC-COACH-415).
2. ~~Strike Through Price lower than Price is accepted.~~ **Intended and known.** Tested as accepted (TC-COACH-416).
3. Form values leak between plans when switching plan types.
4. Donation plans accept an empty preset amount.
5. Stale validation messages from one plan can show after switching to another.
7. **Clicking "Add a price" / "Add more price" before the page has finished loading can crash the whole page**
   ("Application error: a client-side exception has occurred"). It hit 13 of 25 tests in the first spec run (the
   browser was recording, which slows the page) and went away once the controller waited for the network to settle.
   The same early-click race makes "Create" on the new course and new group forms silently reload the page instead
   of saving. Real users on a slow connection can hit the same thing.
8. **Cases that PASSED (the app refuses them correctly):** a maximum donation lower than the minimum (TC-PRC-032)
   and a split payment with one installment (TC-PRC-033).
6. Deleting a product with active subscriptions is possible (a confirmation lists the subscribers and says they
   will be cancelled; this is by design but risky on a shared tenant).

## 9. Facts that affect test design

- The tenant is **shared and busy**: other people (and other automation) create prices and even buy items on
  QA data. **Course 51117 `QA-Explore Pricing ...` was found to have an active subscriber** (a paying subscription
  on a split plan I created), so it was NOT deleted. Do not use public QA items for destructive price tests; create
  your own item and delete it.
- A product with existing prices hides the plans whose limit is reached, so a spec for "all plans available"
  must start from a **fresh product with no prices**.
- Deleting a course needs a typed confirmation (`DELETE`); a group and a video library use a normal Yes/Delete
  dialog. Creating throwaway items is cheap for course (name only), group (name + description) and video library
  (name + description + status). Community, digital, physical, appointment and event need images, files or more fields.
- The row Action menus of the lists are **not** ARIA menus. Use the visible `.ant-dropdown` list items.
- The price id tag (`#322412`) is the stable handle for a card. New ids are assigned by the app, so the controller
  returns the new id after Create.

## 10. Automation map

| Piece | File |
|---|---|
| Matrix (supported plans, settings, max active, paths, labels) | `src/helpers/data/pricing/pricing.matrix.ts` |
| Data shapes (`PriceData`, one interface per plan) | `src/helpers/data/pricing/pricing.types.ts` |
| Default value builders (`buildPrice(product, plan)`, `buildAllPrices(product)`, one `build...Price` per plan) | `src/helpers/data/pricing/pricing.factory.ts` |
| Toast and validation texts | `src/helpers/pricing-messages.ts` |
| Component locators and controller (reused by every product page) | `src/components/pricing/` |
| Page that reaches any product's pricing screen | `src/pages/owner/pricing/pricing.page.ts` (fixture `pricingPage`) |

### Spec status (2026-11-16)

Pricing is automated for the **coaching module only**: `src/tests/owner/coaching-pricing/coaching-pricing.spec.ts`,
38 cases (`TC-COACH-401` to `456`, test cases in `test-cases/coaching-pricing.md`), **all 38 pass**. A program is
created with `createProgram` and its Pricing screen is opened from the Coaching Programs row menu (fixture
`newProgramPricing`). Group chat and course pricing specs were removed on request; the matrix above still describes
those products.

Evidence of the client-side crash: `bug-evidence/client-side-exception-on-add-a-price.webm` (and `.png`), recorded
on a group created seconds earlier. It did not reproduce on programs that already existed (72 clicks), only right
after creating the product.

### Verification status of the component (live, 2026-11-16, scratch probe against throwaway items)

Verified end to end: add for every plan on a **course** (all 9, with expiry Limited, trial, advanced installments,
3-row tiers with "Don't multiply", 2-row flat table, donation min/max/text) and on a **group chat** (5 plans),
offered-plan list, plan limits returning after archive, set as default, make private / public (course), copy
payment URL, update (new id), cancel and confirm for archive and delete, price count.
Not verified: Custom billing period, form validation helpers (`submitForm`) against every product, edit of
plans other than split and subscription, and the other products' pages beyond reading their plan list.

Controller facts learned the hard way:
- A saved card is found through its `#id` tag. Wider containers hold the tag too, so the card is the innermost one.
- The three donation amount boxes cannot be found by label (minimum and maximum labels share a container), so they
  are addressed by position.
- Inside the form the table header cells are `cell` roles, not `columnheader`. After saving, the card shows
  `columnheader`.
- After a select has a value (edit forms) its hidden input cannot be clicked; click the select box.

Usage from a spec:

```ts
await pricingPage.open("group-chat", groupId);
const priceId = await pricingPage.pricing.addPrice(buildPrice("group-chat", "split-payment"));
await pricingPage.pricing.setAsDefault(priceId);
```
