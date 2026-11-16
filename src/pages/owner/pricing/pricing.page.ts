import type { Page } from "@playwright/test";

import { PricingComponent } from "@/components/pricing/pricing.component";
import { PRODUCT_PRICING } from "@/helpers/data/pricing/pricing.matrix";
import type { PricingProductType } from "@/helpers/data/pricing/pricing.types";
import { BasePage } from "@/pages/base/base.page";

/*
 * The pricing screen of any product. All products share one section, so this page only knows how to
 * reach it (the path differs per product, see PRODUCT_PRICING) and hands the work to PricingComponent.
 */
export class PricingPage extends BasePage {
  readonly pricing: PricingComponent;

  constructor(page: Page) {
    super(page);
    this.pricing = new PricingComponent(page);
  }

  /*
   * Opens the pricing screen of one product and returns once the list is drawn (empty state or cards).
   * `productId` is the id from the product's own list (a course id, a group id ...).
   */
  open = async (product: PricingProductType, productId: number | string): Promise<void> => {
    await this.goto(PRODUCT_PRICING[product].pricingPath(productId));
    await this.pricing.waitUntilLoaded();
  };
}
