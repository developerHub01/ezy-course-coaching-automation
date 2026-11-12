export interface AuthPaths {
  owner: string;
  student: string;
}

// Saved login sessions (git-ignored). Created once by src/tests/setup/auth.setup.ts.
export const AUTH_PATHS: AuthPaths = {
  owner: "playwright/.auth/owner.json",
  student: "playwright/.auth/student.json",
};
