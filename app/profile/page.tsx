"use client";
import { requireAuth } from "@/lib/auth-client";
import { useEffect } from "react";
// User profile page for password change
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getUserFromCookie } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userFromCookie = getUserFromCookie();
        if (!userFromCookie) {
          router.push("/login");
          return;
        }
        setUser(userFromCookie);
      } catch (err) {
        router.push("/login");
        return;
      }
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validate password confirmation
    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match");
      setLoading(false);
      return;
    }

    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setError(data.error || "Password change failed");
      }
    } catch (err) {
      setError("Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col items-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              {/* Modern avatar icon */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-user"
              >
                <path d="M20 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M4 21v-2a4 4 0 0 1 3-3.87"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="font-bold text-base sm:text-lg text-center break-words max-w-full px-2">
              {user.email}
            </div>
            <div className="text-xs text-blue-600 font-semibold">
              Role: {user.role}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="oldPassword" className="ml-1 mb-2 text-sm">
                Current Password
              </Label>
              <Input
                id="oldPassword"
                type="password"
                value={form.oldPassword}
                onChange={(e) => handleChange("oldPassword", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword" className="ml-1 mb-2 text-sm">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={form.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="ml-1 mb-2 text-sm">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                required
                minLength={6}
                className={
                  form.newPassword &&
                  form.confirmPassword &&
                  form.newPassword !== form.confirmPassword
                    ? "border-red-500"
                    : ""
                }
              />
              {form.newPassword &&
                form.confirmPassword &&
                form.newPassword !== form.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    Passwords do not match
                  </p>
                )}
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && (
              <div className="text-green-600 text-sm">
                Password changed successfully!
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
