import type { Page } from "@playwright/test";

import { StudentAccountMenuLocators } from "@/components/student-account-menu/student-account-menu.locators";

/* The account dropdown opened from the top-right avatar of the student dashboard. */
export class StudentAccountMenuComponent {
  readonly locators: StudentAccountMenuLocators;

  constructor(private readonly page: Page) {
    this.locators = new StudentAccountMenuLocators(page);
  }

  /* Returns only after the browser has left the student dashboard, so the logout is confirmed. */
  logout = async (): Promise<void> => {
    await this.locators.avatar().click();
    await this.locators.logoutItem().click();
    await this.page.waitForURL((url) => !url.pathname.includes("/dashboard"));
  };
}
