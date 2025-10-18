"use client";
import { useEffect, useState } from "react";
import { verifyAuth } from "@/lib/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await verifyAuth();

      if (!result.valid) {
        // Clear any invalid tokens and redirect to login
        console.warn("Authentication failed:", result.error);
        document.cookie =
          "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        window.location.href = "/login";
        return;
      }

      setIsAuthenticated(true);
      setIsVerifying(false);
    };

    // Only check auth if we're not on login/register pages
    const currentPath = window.location.pathname;
    if (currentPath === "/login" || currentPath === "/register") {
      setIsVerifying(false);
      setIsAuthenticated(true); // Allow access to login/register
      return;
    }

    checkAuth();
  }, []);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}
