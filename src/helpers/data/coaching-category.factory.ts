import { faker } from "@faker-js/faker";

/* The category name field accepts at most this many characters (31 is refused). */
export const MAX_COACHING_CATEGORY_NAME_LENGTH = 30;

const NAME_PREFIX = "QA-Cat ";

export interface CoachingCategoryData {
  name: string;
}

/*
 * The name starts with "QA-Cat " and ends with six random characters, so a test can find and delete
 * only its own category on the shared tenant. It is 13 characters, well inside the limit.
 */
export const buildCoachingCategory = (
  overrides: Partial<CoachingCategoryData> = {},
): CoachingCategoryData => ({
  name: `${NAME_PREFIX}${faker.string.alphanumeric(6)}`,
  ...overrides,
});

/* A name of exactly `length` characters that still starts with "QA-Cat " (so it is found and deleted). */
export const buildCoachingCategoryNameOfLength = (length: number): string =>
  `${NAME_PREFIX}${faker.string.alphanumeric(length - NAME_PREFIX.length)}`;
