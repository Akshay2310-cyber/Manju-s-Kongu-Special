import "server-only";

// Admin key for the dashboard. Set ADMIN_PASSWORD in .env.local (and on Vercel).
export function adminKey(): string {
  return process.env.ADMIN_PASSWORD || "manju-admin";
}

export function isAuthed(req: Request): boolean {
  const key = req.headers.get("x-admin-key");
  return !!key && key === adminKey();
}
