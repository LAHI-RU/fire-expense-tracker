import { requireAuth } from "@/lib/auth-client";
import { useEffect } from "react";
useEffect(() => {
  const user = typeof window !== "undefined" ? requireAuth() : null;
  if (!user) return;
}, []);
