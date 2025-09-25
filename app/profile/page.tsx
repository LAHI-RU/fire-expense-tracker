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
  useEffect(() => {
    const user = typeof window !== "undefined" ? requireAuth() : null;
    if (!user) return;
  }, []);
  const user = typeof window !== "undefined" ? getUserFromCookie() : null;
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  if (!user) {
    router.push("/login");
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
        setForm({ oldPassword: "", newPassword: "" });
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
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
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
          <div className="font-bold text-lg">{user.email}</div>
          <div className="text-xs text-blue-600 font-semibold">
            Role: {user.role}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="oldPassword" className="ml-1 mb-2">Current Password</Label>
            <Input
              id="oldPassword"
              type="password"
              value={form.oldPassword}
              onChange={(e) => handleChange("oldPassword", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="ml-1 mb-2">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={form.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              required
            />
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
  );
}
