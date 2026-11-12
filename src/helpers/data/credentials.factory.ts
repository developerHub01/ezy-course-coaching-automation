import { faker } from "@faker-js/faker";

import type { Credentials } from "@/helpers/env";

/*
 * Random credentials that belong to nobody. The email uses the example.com domain so it can never
 * match a real user. Pass overrides to force a specific value in a negative test.
 */
export const buildCredentials = (overrides: Partial<Credentials> = {}): Credentials => ({
  email: faker.internet
    .email({
      firstName: "qa",
      lastName: faker.string.alphanumeric(8),
      provider: "example.com",
    })
    .toLowerCase(),
  password: faker.internet.password({
    length: 14,
  }),
  ...overrides,
});
