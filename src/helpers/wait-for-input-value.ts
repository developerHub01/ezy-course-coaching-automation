import type { Locator } from "@playwright/test";

/*
 * Returns only once an input really holds `expected`. Filling a field can be overwritten by the
 * app (re-render, default value, late load), so a controller waits for the value instead of
 * trusting that the fill worked. `expect` is not used here because it belongs in specs.
 */
export const waitForInputValue = async (locator: Locator, expected: string): Promise<void> => {
  const handle = await locator.elementHandle();
  await locator
    .page()
    .waitForFunction(
      ([element, value]) => (element as HTMLInputElement).value === value,
      [handle, expected],
    );
};
