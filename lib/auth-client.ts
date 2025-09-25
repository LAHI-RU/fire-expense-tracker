// Client-only authentication utilities (no Node.js imports)
import { jwtDecode } from "jwt-decode";

export function getUserFromCookie(): null | { id: number; email: string; role: string } {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith("token="));
  if (!tokenCookie) return null;
  const token = tokenCookie.substring("token=".length);
  try {
    return jwtDecode(token) as { id: number; email: string; role: string };
  } catch {
    return null;
  }
}

export function requireAuth(): { id: number; email: string; role: string } | null {
  const user = getUserFromCookie();
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }
  return user;
}
