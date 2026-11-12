import "dotenv/config";

export interface Credentials {
  email: string;
  password: string;
}

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name} (see .env.example).`);
  return value;
};

export const getSiteUrl = (): string => requireEnv("SITE_URL");

export const getOwnerCredentials = (): Credentials => ({
  email: requireEnv("SITE_OWNER_EMAIL"),
  password: requireEnv("SITE_OWNER_PASSWORD"),
});

export const getStudentCredentials = (): Credentials => ({
  email: requireEnv("BASE_STUDENT_EMAIL"),
  password: requireEnv("BASE_STUDENT_PASSWORD"),
});
