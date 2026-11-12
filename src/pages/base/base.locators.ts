import type { Page } from "@playwright/test";

export class BaseLocators {
  constructor(protected readonly page: Page) {}
}
