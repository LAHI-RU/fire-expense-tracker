// Client-only authentication utilities with database verification
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

// Verify authentication with database (async)
export async function verifyAuth(): Promise<{ valid: boolean; user?: any; error?: string }> {
  try {
    const response = await fetch("/api/auth/verify", {
      method: "GET",
      credentials: "include"
    });
    
    const data = await response.json();
    
    if (response.ok && data.authenticated) {
      return { valid: true, user: data.user };
    } else {
      // Clear invalid token
      document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      return { valid: false, error: data.error || "Authentication failed" };
    }
  } catch (error) {
    return { valid: false, error: "Failed to verify authentication" };
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

// Logout function
export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/verify", {
      method: "DELETE",
      credentials: "include"
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
  
  // Clear token cookie
  document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
  
  // Redirect to login
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
