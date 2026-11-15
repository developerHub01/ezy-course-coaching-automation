import type { Page } from "@playwright/test";

export class BasePage {
  constructor(protected readonly page: Page) {}

  /*
   * Waits for the "load" event on purpose. A path without the language prefix is redirected to the
   * owner's language AFTER the first document is ready, so returning earlier lets that redirect
   * reload the page in the middle of a test. Pages are slow to load, so the navigation timeout in
   * playwright.config.ts is generous.
   */
  goto = async (path: string): Promise<void> => {
    await this.page.goto(path);
  };

  getCurrentUrl = (): string => this.page.url();
}
