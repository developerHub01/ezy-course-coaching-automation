import type { Page } from "@playwright/test";

import { OwnerAccountMenuLocators } from "@/components/owner-account-menu/owner-account-menu.locators";

/* The account dropdown opened from the top-right avatar of the owner dashboard. */
export class OwnerAccountMenuComponent {
  readonly locators: OwnerAccountMenuLocators;

  constructor(private readonly page: Page) {
    this.locators = new OwnerAccountMenuLocators(page);
  }

  /* Returns only after the browser has left the owner dashboard, so the logout is confirmed. */
  logout = async (): Promise<void> => {
    await this.locators.avatar().click();
    await this.locators.logoutItem().click();
    await this.page.waitForURL((url) => !url.pathname.includes("/dashboard"));
  };
}
