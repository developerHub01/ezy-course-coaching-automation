# EzyCourse Coaching Automation: Project Rules

Playwright + TypeScript automation for the **EzyCourse coaching module**.
Package manager: **pnpm**. Browser: **Chromium only** (for now).
Roles covered: **owner first**, then **student**.
Fake data: **@faker-js/faker**.

Every human and every AI agent working here MUST follow this file.

---

## 1. Working agreement (most important)

1. **Discuss before executing.** Never write or run a spec until its test-case `.md`
   has been shown to the human and explicitly approved.
2. **Core tests only.** Cover crucial **positive** and **negative** behaviour. No exhaustive
   permutations, no cosmetic checks, no duplicate cases.
3. **Explain as you go.** The human is not a senior SDET. Briefly say *why* a
   structure or choice was made.
4. **Never guess selectors.** Inspect the live page (snapshot) before writing a locator.
5. **Never hardcode secrets.** Credentials come from `.env` via the env helper. Never print, log or commit them.
6. **Never silence a failure** (`test.skip`, `.only`, weaker assertion, `waitForTimeout`) to make a test pass.
   If the app is wrong, report a bug. If the test is wrong, fix the test.

---

## 2. Folder structure

```
src/                          ALL project code lives here (alias: "@/" = src/)
  pages/                      Page Objects (full screens). Locators and controller are SEPARATE files
    base/
      base.locators.ts
      base.page.ts
    <area>/<name>/
      <name>.locators.ts      ONLY locators (no actions, no assertions)
      <name>.page.ts          Controller: actions + reads, uses the locators class
  components/                 Reusable UI pieces shared by many pages (modal, table, sidebar,
    <name>/                   toast, confirm dialog, pagination, search box ...)
      <name>.locators.ts      Same two-file split as pages
      <name>.component.ts     Controller for the component
  fixtures/                   Custom Playwright fixtures (page objects, roles, data)
  helpers/
    env.ts                    Typed access to .env
    tags.ts                   Tag registry (single source of truth for every tag)
    data/                     Faker-based data factories
  tests/
    setup/                    auth.setup.ts (log in once per role, save session)
    owner/<feature>/
      <feature>.spec.ts
      test-cases/
        <feature>.md          ONE .md holding ALL test cases of the spec
    student/<feature>/
      <feature>.spec.ts
      test-cases/<feature>.md
    e2e/<journey>/
      <journey>.spec.ts
      test-cases/<journey>.md
.claude/agents/               AI agents (designer, generator, healer, reviewer)
.claude/templates/            test-cases.template.md
playwright.config.ts          Root config files stay at the root with package.json,
tsconfig.json                 .env, CLAUDE.md (they are not "code under src")
```

Rules:
- **Every `.spec.ts` has a sibling `test-cases/` folder with exactly one `<feature>.md`** that
  lists all of that spec's test cases (one section per case).
- **Page vs component:** if a UI piece appears on more than one page, or is a self-contained widget
  (modal, table, dropdown), it is a **component**. A page object composes components.
  Never duplicate a component's locators inside a page.

---

## 3. Page Object Model (POM)

Two files per page or component, always: **locators** and **controller**.

**`<name>.locators.ts`**: only locator definitions.

```ts
import type { Locator, Page } from "@playwright/test";

export class StudentListLocators {
  constructor(private readonly page: Page) {}

  readonly addStudentButton = (): Locator => this.page.getByRole("button", { name: "Add student" });
}
```

**`<name>.page.ts`** / **`<name>.component.ts`**: the controller. Contains user-intent
methods (`addStudent`, `deleteStudent`). It owns a locators instance. It does **not** contain
raw selectors.

```ts
export class StudentListPage extends BasePage {
  readonly locators: StudentListLocators;
  readonly deleteDialog: ConfirmDialogComponent;
  // ...
}
```

Rules:
- Tests call **controller methods**; they never use raw selectors.
- Assertions (`expect`) live in the **spec**, not in page objects or components. Controllers may
  expose read methods (`getTitle()`) or locators for the spec to assert on.
- Locator priority: `getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` >
  `getByTestId` > CSS. XPath is forbidden. No positional selectors (`nth`) unless unavoidable.
- No `page.waitForTimeout`. Use web-first assertions and auto-waiting.

---

## 4. Test taxonomy and tagging

Tags are the **only** way a test joins a suite or a feature group.
Tags are **never typed as raw strings in specs**. Import them from `@/helpers/tags`.

```ts
import { Tag } from "@/helpers/tags";

test(
  "TC-STU-004: Owner deletes a student",
  { tag: [Tag.Regression, Tag.Owner, Tag.Positive, Tag.StudentManagement, Tag.StudentDeletion] },
  async ({ studentListPage }) => {
    // ...
  },
);
```

### 4.1 Four kinds of tags (every test needs one from each of the first three)

| Kind | Examples | Rule |
|---|---|---|
| **Suite** | `@smoke` `@sanity` `@regression` `@feature` `@e2e` | at least one |
| **Role** | `@owner` `@student` | exactly one (two for e2e journeys) |
| **Polarity** | `@positive` `@negative` | exactly one |
| **Feature** | `@student-management` `@student-deletion` `@coaching-session` ... | at least one |

Suite meanings:
- `@smoke`: tiny, critical "is the app alive?" set. Runs on every change. Under ~5 min total.
- `@sanity`: narrow check that a recent fix or change works.
- `@regression`: full protective suite of existing behaviour.
- `@feature`: standalone-runnable feature tests.
- `@e2e`: multi-step cross-role journey (owner creates, student consumes).

### 4.2 Feature tags (the "run everywhere X is used" rule)

Feature tags are defined by the **human** as the product grows (e.g. `@students`,
`@student-deletion`, `@student-management`). They are kebab-case and live in `src/helpers/tags.ts`.

**Tag by what the test exercises, not by which file it sits in.** If feature X is used in five
places, every test that touches X in any spec carries `@x`. Then one command runs X everywhere:

```
pnpm tag @student-deletion
```

and the HTML report shows whether X works or what broke, across all the places it is used.

Adding a new feature tag:
1. Add it to `src/helpers/tags.ts` (a human-approved name).
2. Mention it in the **Feature tags** line of the relevant test-case `.md`.
3. Use `Tag.<Name>` in specs. Never a raw string.

### 4.3 Running (scripts live in `package.json`)

| Goal | Command |
|---|---|
| Smoke / sanity / regression / e2e | `pnpm test:smoke`, `pnpm test:sanity`, `pnpm test:regression`, `pnpm test:e2e` |
| One feature everywhere it is used | `pnpm tag @student-deletion` |
| Any of several tags (OR) | `pnpm tag "@student-deletion|@student-management"` |
| All of several tags (AND) | `pnpm tag "(?=.*@owner)(?=.*@negative)"` |
| One spec or folder (standalone) | `pnpm test -- src/tests/owner/<feature>` |
| Open the report | `pnpm report` |

Title format: `TC-<AREA>-<NNN>: <behaviour in plain English>` (matches the ID in the `.md`).

---

## 5. Test case `.md` file (one per spec)

Use `.claude/templates/test-cases.template.md`. Location:
`src/tests/<role>/<feature>/test-cases/<feature>.md`.

The file has a header (feature, role, feature tags, overall status) and **one section per test case**.
Each case carries: `id`, `title`, `type` (positive/negative), `suites`, `feature tags`, `priority`,
`status`, steps, expected result, data, cleanup.

Per-case `status` lifecycle: `Draft` -> `Approved` (human says so) -> `Automated`.
**Agents may only generate a test from a case with `status: Approved`.**

---

## 6. Code style (strict)

1. **Always double quotes `""`** for strings. Never single quotes. (Backticks only for template literals.)
2. **Always end statements with a semicolon `;`.**
3. **Arrow functions only.** No `function` declarations or expressions. Class methods may be written
   as arrow-function properties.
4. **Single-expression bodies skip `{}` and `return`:**
   `const fullName = (first: string, last: string): string => `${first} ${last}`;`
   Use `{}` only when the body has more than one statement.
5. **Arrays:** `Array<string>`, never `string[]`.
6. **`interface` over `type`** for object shapes and contracts. Use `type` only when an interface
   cannot express it (unions, mapped types, literal unions).
7. Explicit return types on exported functions and methods.
8. `import type` for type-only imports. No `any`. Prefer `unknown` plus narrowing.
9. `const` by default. Descriptive names. No abbreviations (`btn`, `elem`).
10. One behaviour per test. Tests are independent and may run in parallel.

Example that follows every rule:

```ts
import { faker } from "@faker-js/faker";

export interface StudentData {
  fullName: string;
  email: string;
}

export const buildStudent = (): StudentData => ({
  fullName: faker.person.fullName(),
  email: faker.internet.email({ provider: "example.com" }).toLowerCase(),
});

export const buildStudents = (count: number): Array<StudentData> =>
  Array.from({ length: count }, buildStudent);
```

---

## 7. Imports (absolute, with `@/`)

- **Always absolute imports via the `@/` alias**, which maps to `src/` (set in `tsconfig.json`
  `paths` and respected by Playwright). Example: `import { StudentListPage } from "@/pages/students/student-list/student-list.page";`
- **Never relative imports that climb** (`../../`). A same-folder `./` import is allowed only
  between a controller and its own locators file.
- Imports are ordered: external packages, then `@/` imports, then `./` imports. Use `import type`
  for type-only imports.

---

## 8. Test data (faker.js)

- **All fake data comes from `@faker-js/faker`**, wrapped in factories under `src/helpers/data/`
  (`buildStudent()`, `buildCoachingProgram()`). Specs never call `faker` directly.
- Factories return typed `interface` objects and accept optional overrides
  (`buildStudent({ email: "x@example.com" })`) so a test can force a specific value
  (e.g. an invalid email for a negative case).
- Names must be traceable and collision-safe: add a short unique suffix
  (e.g. `` `${faker.company.name()} ${faker.string.alphanumeric(6)}` ``).
- Test-created data is **deleted in cleanup** (`afterEach` or fixture teardown). Prefer API
  setup/teardown over UI when available.
- Never use real people's data. Use the `example.com` domain for emails.
- Never fake data for the login credentials. Those come from `.env`.

---

## 9. Agents (see `.claude/agents/`)

Flow, with a human gate at each arrow:

`test-case-designer` -> **human approves the .md** -> `test-generator` -> **human reviews code** ->
`test-reviewer` -> run -> `test-healer` (only on failures)

Each agent must stop and ask the human at its gate. Never chain past a gate.
