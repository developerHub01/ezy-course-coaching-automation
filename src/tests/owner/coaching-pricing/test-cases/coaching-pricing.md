# Coaching Pricing: Test Cases

| Field | Value |
|---|---|
| Spec file | `src/tests/owner/coaching-pricing/coaching-pricing.spec.ts` |
| Role | owner |
| Feature tags | `@coaching`, `@coaching-pricing`, `@pricing`, `@pricing-plan-limit`, `@pricing-validation` |
| Area code | COACH (range 401 to 459) |
| Overall status | Approved (the human asked on 2026-11-16 to write the cases and then create the specs) |

## Scope
Pricing of a **coaching program**, reached from the Coaching Programs list (row menu **Pricing**). A coaching program
offers five plan types: One-time Standard, Split Payment, Subscription Standard, Donation (One Time), Donation
(Recurring). Every plan, every setting each plan shows for coaching, and the combinations of plans on one program
are covered. Rules come from `docs/product/pricing.md` and `src/helpers/data/pricing/pricing.matrix.ts`.

Not covered: checkout and what a student sees, payment gateways (Stripe / PayPal), the Custom billing period,
other products. (The coaching form shows no trial and no expiry on One-time Standard; those exist only for
courses and memberships.)

## Intended behaviour (confirmed by the human, 2026-11-16)
- A price of `0` is accepted.
- A strike-through price lower than the price is accepted.
These are tested as accepted (TC-COACH-415, TC-COACH-416), not as bugs.

## Shared preconditions
- Logged in as owner (saved session).
- Each test creates its own coaching program with the `createProgram` fixture (the program is only the starting
  point) and the fixture deletes it afterwards, even after a failure. Prices are never added to shared programs.
- Amounts come from the pricing factory. Currency is never asserted (it changes between runs).
- "Reach pricing" in the steps means: open the Coaching Programs list, open the program's row menu, choose **Pricing**.

## Summary

| ID | Title | Type | Group | Suites | Priority | Status |
|---|---|---|---|---|---|---|
| TC-COACH-401 | Owner adds a one-time standard price | positive | Functional | smoke, regression | P1 | Approved |
| TC-COACH-402 | A one-time price with a strike-through price shows both amounts | positive | Functional | regression | P1 | Approved |
| TC-COACH-403 | Owner adds a split payment with lifetime access | positive | Functional | regression | P1 | Approved |
| TC-COACH-404 | A split payment with limited access is saved | positive | Functional | regression | P2 | Approved |
| TC-COACH-405 | A split payment with advanced installments and a strike-through price is saved | positive | Functional | regression | P2 | Approved |
| TC-COACH-406 | Owner adds a subscription | positive | Functional | regression | P1 | Approved |
| TC-COACH-407 | A subscription with a strike-through price shows both amounts | positive | Functional | regression | P2 | Approved |
| TC-COACH-408 | A subscription with advanced installments is saved | positive | Functional | regression | P2 | Approved |
| TC-COACH-409 | A subscription accepts every billing period | positive | Functional | regression | P1 | Approved |
| TC-COACH-410 | A split payment accepts every billing period | positive | Functional | regression | P2 | Approved |
| TC-COACH-411 | Owner adds a one-time donation | positive | Functional | regression | P1 | Approved |
| TC-COACH-412 | A one-time donation with limits, text and limited access is saved | positive | Functional | regression | P2 | Approved |
| TC-COACH-413 | Owner adds a recurring donation | positive | Functional | regression | P1 | Approved |
| TC-COACH-414 | A recurring donation with limits and text is saved | positive | Functional | regression | P2 | Approved |
| TC-COACH-415 | A price of zero is accepted (intended) | positive | Functional | regression | P2 | Approved |
| TC-COACH-416 | A strike-through price lower than the price is accepted (intended) | positive | Functional | regression | P2 | Approved |
| TC-COACH-417 | One price of every plan fits on one program | positive | Functional | regression | P1 | Approved |
| TC-COACH-418 | Split and subscription prices can each be added twice | positive | Functional | regression | P1 | Approved |
| TC-COACH-419 | A one-time standard plan is no longer offered after one price is added | negative | Functional | regression | P1 | Approved |
| TC-COACH-420 | Both donation plans are no longer offered after one price each | negative | Functional | regression | P1 | Approved |
| TC-COACH-421 | Archiving a price makes its plan available again | positive | Functional | regression | P1 | Approved |
| TC-COACH-430 | A new program offers the five coaching plans | positive | UI | regression | P1 | Approved |
| TC-COACH-440 | The first price is the default and a later one is not | positive | Functional | regression | P2 | Approved |
| TC-COACH-441 | Owner sets another price as default | positive | Functional | regression | P2 | Approved |
| TC-COACH-442 | Owner makes a price private and public again | positive | Functional | regression | P2 | Approved |
| TC-COACH-443 | A private price cannot be set as default | negative | Functional | regression | P2 | Approved |
| TC-COACH-444 | The default price cannot be archived or made private | negative | Functional | regression | P2 | Approved |
| TC-COACH-445 | Updating a price replaces it with the new amount | positive | Functional | regression | P1 | Approved |
| TC-COACH-446 | Cancelling a delete keeps the price | negative | Functional | regression | P2 | Approved |
| TC-COACH-447 | Owner deletes a price | positive | Functional | regression | P1 | Approved |
| TC-COACH-448 | Copying the payment link confirms with a message | positive | Functional | regression | P2 | Approved |
| TC-COACH-450 | An empty one-time standard form asks for the price | negative | Validation | regression | P1 | Approved |
| TC-COACH-451 | An empty subscription form asks for the billing period | negative | Validation | regression | P1 | Approved |
| TC-COACH-452 | An empty split payment form is refused | negative | Validation | regression | P1 | Approved |
| TC-COACH-453 | An empty one-time donation form asks for the access length | negative | Validation | regression | P2 | Approved |
| TC-COACH-454 | An empty recurring donation form asks for the billing period | negative | Validation | regression | P2 | Approved |
| TC-COACH-455 | A split payment with one installment is refused | negative | Validation | regression | P2 | Approved |
| TC-COACH-456 | A maximum donation lower than the minimum is refused | negative | Validation | regression | P2 | Approved |

---

## TC-COACH-401: Owner adds a one-time standard price

- **Type:** positive
- **Group:** Functional
- **Suites:** smoke, regression
- **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P1
- **Status:** Approved
- **Objective:** a coaching program can be given a price at all.

**Test data**
| Field | Value |
|---|---|
| Price | `buildOneTimeStandardPrice()` (random amount) |

**Steps**
1. Reach pricing of a new program (it shows no prices).
2. Add a One-time Standard price with that amount.

**Expected result**
- A card appears with the amount, the tag `One Time` and the tag `Default`.

**Cleanup**
- The fixture deletes the program.

---

## TC-COACH-402: A one-time price with a strike-through price shows both amounts

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P1 / **Status:** Approved
- **Objective:** the "was" price is saved and shown struck through.

**Test data:** strike-through 80, price 50.

**Steps**
1. Reach pricing. 2. Add a One-time Standard price with strike-through 80 and price 50.

**Expected result**
- The card shows both `80` and `50` and the tag `One Time`.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-403: Owner adds a split payment with lifetime access

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P1 / **Status:** Approved
- **Objective:** installments can be sold.

**Test data:** amount per installment 30, Monthly, 3 installments, Lifetime.

**Steps**
1. Reach pricing. 2. Add a Split Payment price with those values.

**Expected result**
- The card shows `30`, `month` and `3 installments`.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-404: A split payment with limited access is saved

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** the "Limited" enrollment expiry of a split payment is accepted.

**Test data:** amount 20, Weekly, 4 installments, Limited 90 days.

**Steps**
1. Reach pricing. 2. Add that Split Payment price.

**Expected result**
- A card is added showing `20`, `week` and `4 installments`.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-405: A split payment with advanced installments and a strike-through price is saved

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** the "advance installment options" (a different first payment) are saved.

**Test data:** strike-through 99, amount 40, Monthly, 4 installments, initial cycle amount 11, initial cycle length 2.

**Steps**
1. Reach pricing. 2. Add that Split Payment price with advanced installments ticked.

**Expected result**
- The card shows the struck `99` and the sentence `for first 2 installments and then`.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-406: Owner adds a subscription

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P1 / **Status:** Approved
- **Objective:** recurring billing can be sold.

**Test data:** price 25, Monthly.

**Steps**
1. Reach pricing. 2. Add a Subscription price with those values.

**Expected result**
- The card shows `25`, `/month` and the tag `Subscription`.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-407: A subscription with a strike-through price shows both amounts

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** the "was" price works for subscriptions too.

**Test data:** strike-through 80, price 40, Yearly.

**Steps**
1. Reach pricing. 2. Add that Subscription price.

**Expected result**
- The card shows `80`, `40` and `year`.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-408: A subscription with advanced installments is saved

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** a different first payment for a subscription is saved.

**Test data:** price 50, Monthly, initial cycle amount 5, initial cycle length 1.

**Steps**
1. Reach pricing. 2. Add that Subscription price with advanced installments ticked.

**Expected result**
- The card shows `first month` (the first payment) and the regular `/month` amount.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-409: A subscription accepts every billing period

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P1 / **Status:** Approved
- **Objective:** none of the six billing periods is broken.

**Test data:** one subscription for each of Daily, Weekly, Monthly, Yearly, Every 3 months, Every 6 months.

**Steps**
1. Reach pricing. 2. Add the six subscriptions one after another.

**Expected result**
- The page shows 6 prices and each new card shows its own period word (`day`, `week`, `month`, `year`,
  `3 months`, `6 months`).

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-410: A split payment accepts every billing period

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** none of the six billing periods is broken for installments.

**Test data:** one split payment for each of the six periods.

**Steps**
1. Reach pricing. 2. Add the six split payments one after another.

**Expected result**
- The page shows 6 prices.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-411: Owner adds a one-time donation

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P1 / **Status:** Approved
- **Objective:** donations can be accepted.

**Test data:** preset amount 15, Lifetime.

**Steps**
1. Reach pricing. 2. Add a Donation (One Time) price.

**Expected result**
- The card shows `Default Price` with `15` and the tag `Donation`.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-412: A one-time donation with limits, text and limited access is saved

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** minimum, maximum, thank-you text and a limited expiry are saved (a past bug risk: the maximum landing in the minimum box).

**Test data:** preset 20, minimum 5, maximum 100, text "Thank you", Limited 30 days.

**Steps**
1. Reach pricing. 2. Add that Donation (One Time) price.

**Expected result**
- The card shows `Minimum Donation` with `5` and `Maximum Donation` with `100`.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-413: Owner adds a recurring donation

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P1 / **Status:** Approved
- **Objective:** monthly donations can be accepted.

**Test data:** preset 10, Monthly.

**Steps**
1. Reach pricing. 2. Add a Donation (Recurring) price.

**Expected result**
- The card shows `Default Price` with `10`, `/month` and the tag `Donation`.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-414: A recurring donation with limits and text is saved

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** limits and text are saved for recurring donations.

**Test data:** preset 10, minimum 2, maximum 50, Yearly, text "Thanks".

**Steps**
1. Reach pricing. 2. Add that Donation (Recurring) price.

**Expected result**
- The card shows `/year`, `Minimum Donation` with `2` and `Maximum Donation` with `50`.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-415: A price of zero is accepted (intended)

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** keeps the known, intended behaviour that a zero price is saved.

**Test data:** One-time Standard, price 0.

**Steps**
1. Reach pricing. 2. Add that price.

**Expected result**
- A card is added (the form closes and the page shows 1 price).

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-416: A strike-through price lower than the price is accepted (intended)

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** keeps the known, intended behaviour that no comparison is made.

**Test data:** One-time Standard, strike-through 5, price 10.

**Steps**
1. Reach pricing. 2. Add that price.

**Expected result**
- A card is added (the page shows 1 price).

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-417: One price of every plan fits on one program

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing, pricing-plan-limit
- **Priority:** P1 / **Status:** Approved
- **Objective:** the five coaching plans can live together, and only the repeatable ones stay on offer.

**Test data:** `buildAllPrices("coaching")`, one valid price per plan.

**Steps**
1. Reach pricing. 2. Add one price of each of the five plans.
3. Open the add form.

**Expected result**
- The page shows 5 prices.
- The plan list offers exactly Split Payment and Subscription Standard.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-418: Split and subscription prices can each be added twice

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing, pricing-plan-limit
- **Priority:** P1 / **Status:** Approved
- **Objective:** repeatable plans really accept several prices.

**Steps**
1. Reach pricing. 2. Add two Split Payment prices and two Subscription prices with different amounts.
3. Open the add form.

**Expected result**
- The page shows 4 prices and both Split Payment and Subscription are still offered.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-419: A one-time standard plan is no longer offered after one price is added

- **Type:** negative / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing, pricing-plan-limit
- **Priority:** P1 / **Status:** Approved
- **Objective:** a program cannot get two one-time prices.

**Steps**
1. Reach pricing. 2. Add a One-time Standard price. 3. Open the add form.

**Expected result**
- One-time Standard is not in the plan list; the other four plans are.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-420: Both donation plans are no longer offered after one price each

- **Type:** negative / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing, pricing-plan-limit
- **Priority:** P1 / **Status:** Approved
- **Objective:** a program cannot get two donation prices of the same kind.

**Steps**
1. Reach pricing. 2. Add a Donation (One Time) price and a Donation (Recurring) price. 3. Open the add form.

**Expected result**
- Neither donation plan is in the plan list; One-time Standard, Split Payment and Subscription Standard are.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-421: Archiving a price makes its plan available again

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing, pricing-plan-limit
- **Priority:** P1 / **Status:** Approved
- **Objective:** an archived price stops counting against the plan limit.

**Steps**
1. Reach pricing. 2. Add a One-time Standard price (the default), then a Donation (One Time) price.
3. Confirm Donation (One Time) is no longer offered. 4. Archive the donation price. 5. Open the add form.

**Expected result**
- The donation card is gone and Donation (One Time) is offered again.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-430: A new program offers the five coaching plans

- **Type:** positive / **Group:** UI / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P1 / **Status:** Approved
- **Objective:** the plan list matches the matrix for coaching (no split missing, no tiered plan appearing).

**Steps**
1. Reach pricing of a new program and open the add form.

**Expected result**
- The plan list offers exactly: One-time Standard, Split Payment, Subscription Standard, Donation (One Time),
  Donation (Recurring).

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-440: The first price is the default and a later one is not

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** a program always has one default price.

**Steps**
1. Reach pricing. 2. Add a One-time Standard price, then a Split Payment price.

**Expected result**
- The first card has the tag `Default`; the second does not.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-441: Owner sets another price as default

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** the default can be moved.

**Steps**
1. Reach pricing. 2. Add a One-time Standard price and a Split Payment price. 3. Set the split price as default.

**Expected result**
- The success toast `Price set as default successfully` appeared; the split card has `Default`, the other does not.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-442: Owner makes a price private and public again

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** private prices are marked and can be published again. (Group chats do not offer this; the coaching
  program is checked here for the first time.)

**Steps**
1. Reach pricing. 2. Add a One-time Standard price (default) and a Split Payment price.
3. Make the split price private. 4. Make it public.

**Expected result**
- After step 3 the split card has the tag `Private`; after step 4 it does not.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-443: A private price cannot be set as default

- **Type:** negative / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** a hidden price can never become the default.

**Steps**
1. Reach pricing. 2. Add a One-time Standard price (default) and a Split Payment price.
3. Make the split price private. 4. Open its menu.

**Expected result**
- The `Set as default` button in the menu is disabled.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-444: The default price cannot be archived or made private

- **Type:** negative / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** the default price stays on sale.

**Steps**
1. Reach pricing. 2. Add one price (it is the default). 3. Open its menu.

**Expected result**
- The `Make it private` and `Archive` buttons are disabled.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-445: Updating a price replaces it with the new amount

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P1 / **Status:** Approved
- **Objective:** an edit takes effect. The app replaces the price, so its id changes.

**Test data:** subscription 40 changed to 77.

**Steps**
1. Reach pricing. 2. Add the 40 subscription. 3. Edit it to 77 and answer `Continue` to the confirmation.

**Expected result**
- A card with a new id shows `77`; the old card is gone; the page still shows 1 price.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-446: Cancelling a delete keeps the price

- **Type:** negative / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** a mistaken click on Delete loses nothing.

**Steps**
1. Reach pricing. 2. Add a price. 3. Choose Delete and answer `Cancel`.

**Expected result**
- The card is still listed and the page shows 1 price.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-447: Owner deletes a price

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P1 / **Status:** Approved
- **Objective:** a price can be removed for good and its plan is offered again.

**Steps**
1. Reach pricing. 2. Add a One-time Standard price. 3. Delete it and confirm.

**Expected result**
- The toast `Price deleted successfully` appeared, the card is gone and One-time Standard is offered again.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-448: Copying the payment link confirms with a message

- **Type:** positive / **Group:** Functional / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing
- **Priority:** P2 / **Status:** Approved
- **Objective:** the owner gets feedback that the link was copied.

**Steps**
1. Reach pricing. 2. Add a price. 3. Choose `Copy Payment URL`.

**Expected result**
- The toast `Link copied to clipboard` is shown.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-450: An empty one-time standard form asks for the price

- **Type:** negative / **Group:** Validation / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing, pricing-validation
- **Priority:** P1 / **Status:** Approved
- **Objective:** a price cannot be created without an amount.

**Steps**
1. Reach pricing, open the add form (One-time Standard is first) and press Create with nothing filled.

**Expected result**
- The message `Please input price!` is shown, the form stays open, and no card is created.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-451: An empty subscription form asks for the billing period

- **Type:** negative / **Group:** Validation / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing, pricing-validation
- **Priority:** P1 / **Status:** Approved
- **Objective:** a subscription must say how often it bills.

**Steps**
1. Reach pricing, open the add form, choose Subscription Standard and press Create with nothing filled.

**Expected result**
- The message `Interval is required!` is shown and no card is created.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-452: An empty split payment form is refused

- **Type:** negative / **Group:** Validation / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing, pricing-validation
- **Priority:** P1 / **Status:** Approved
- **Objective:** a split payment cannot be created empty. (The exact messages were not captured before; the case
  asserts the refusal and the interval message.)

**Steps**
1. Reach pricing, open the add form, choose Split Payment and press Create with nothing filled.

**Expected result**
- The form refuses it (a message appears, including `Interval is required!`) and no card is created.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-453: An empty one-time donation form asks for the access length

- **Type:** negative / **Group:** Validation / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing, pricing-validation
- **Priority:** P2 / **Status:** Approved
- **Objective:** a one-time donation must say how long access lasts.

**Steps**
1. Reach pricing, open the add form, choose Donation (One Time) and press Create with nothing filled.

**Expected result**
- The message `Please input expiry!` is shown and no card is created.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-454: An empty recurring donation form asks for the billing period

- **Type:** negative / **Group:** Validation / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing, pricing-validation
- **Priority:** P2 / **Status:** Approved
- **Objective:** a recurring donation must say how often it repeats.

**Steps**
1. Reach pricing, open the add form, choose Donation (Recurring) and press Create with nothing filled.

**Expected result**
- The message `Interval is required!` is shown and no card is created.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-455: A split payment with one installment is refused

- **Type:** negative / **Group:** Validation / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing, pricing-validation
- **Priority:** P2 / **Status:** Approved
- **Objective:** the field says `minimum 2`.

**Test data:** Split Payment, amount 10, Monthly, total installments `1`.

**Steps**
1. Reach pricing and add that split payment.

**Expected result**
- The form refuses it (stays open with a message) and no card is created.

**Cleanup:** the fixture deletes the program.

---

## TC-COACH-456: A maximum donation lower than the minimum is refused

- **Type:** negative / **Group:** Validation / **Suites:** regression / **Feature tags:** coaching, coaching-pricing, pricing, pricing-validation
- **Priority:** P2 / **Status:** Approved
- **Objective:** donation limits must make sense.

**Test data:** Donation (One Time), preset 50, minimum 100, maximum 20.

**Steps**
1. Reach pricing and add that donation.

**Expected result**
- The form refuses it (stays open with a message) and no card is created.

**Cleanup:** the fixture deletes the program.

---

## Open questions
- Does a coaching program allow private prices? (Group chats do not; TC-COACH-442 and 443 will tell.)
- The text of the card for Daily and Every 6 months subscriptions was not seen before (TC-COACH-409 assumes `day`
  and `6 months`); a failure there means the assumption, not necessarily a bug.
