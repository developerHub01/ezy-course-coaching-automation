import type { Locator, Page } from "@playwright/test";

import { GlobalOverlaysLocators } from "@/components/global-overlays/global-overlays.locators";

export interface OverlayHandler {
  name: string;
  locator: Locator;
  dismiss: () => Promise<void>;
}

/*
 * Banners and modals that can appear on ANY page of the project, including pages made with the
 * website builder. Each one is dismissed automatically (via addLocatorHandler) at the moment it
 * blocks an action. To support a new overlay, add one entry to getHandlers().
 */
export class GlobalOverlaysComponent {
  readonly locators: GlobalOverlaysLocators;

  constructor(private readonly page: Page) {
    this.locators = new GlobalOverlaysLocators(page);
  }

  private getHandlers = (): Array<OverlayHandler> => [
    {
      name: "cookie consent banner",
      locator: this.locators.acceptCookiesButton(),
      dismiss: async (): Promise<void> => {
        await this.locators.acceptCookiesButton().click();
      },
    },
  ];

  register = async (): Promise<void> => {
    for (const handler of this.getHandlers()) {
      await this.page.addLocatorHandler(handler.locator, handler.dismiss);
    }
  };
}
