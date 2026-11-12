import type { Page } from "@playwright/test";

export class BasePage {
  constructor(protected readonly page: Page) {}

  goto = async (path: string): Promise<void> => {
    await this.page.goto(path);
  };

  getCurrentUrl = (): string => this.page.url();
}
