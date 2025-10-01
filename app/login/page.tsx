// User login page
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        // Force a full page reload to ensure cookie is available
        window.location.href = "/dashboard";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden">
      {/* Fullscreen blurred gradient background */}
      <div
        className="fixed top-0 left-0 w-full h-full z-0 bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900"
        style={{
          filter: "blur(16px)",
          opacity: 0.85,
        }}
      />
      {/* Overlay for extra glass effect */}
      <div className="fixed top-0 left-0 w-full h-full z-0 bg-white/5" />
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <Card className="max-w-md w-full mx-auto shadow-2xl border-0 rounded-2xl bg-white/90 backdrop-blur-lg">
          <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-16 w-16 rounded-full shadow-lg mb-2"
            />
            <CardTitle className="text-2xl font-bold text-blue-900">
              Sign In
            </CardTitle>
            <span className="text-muted-foreground text-sm">
              Welcome back! Please login to continue.
            </span>
          </CardHeader>
          <CardContent className="pt-2 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="ml-1 mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="bg-white/80"
                />
              </div>
              <div>
                <Label htmlFor="password" className="ml-1 mb-2">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  className="bg-white/80"
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-24 mt-8 mx-auto block"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <span className="text-muted-foreground">
                Don't have an account?
              </span>
              <a
                href="/register"
                className="ml-2 text-blue-600 hover:underline font-semibold"
              >
                Register
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
