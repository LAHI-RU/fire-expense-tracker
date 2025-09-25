// User registration page
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = require("next/navigation").useRouter();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        router.push("/login");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900">
      <Card className="max-w-md w-full mx-auto shadow-2xl border-0 rounded-2xl bg-white/90">
        <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="h-16 w-16 rounded-full shadow-lg mb-2"
          />
          <CardTitle className="text-2xl font-bold text-blue-900">
            Create Account
          </CardTitle>
          <span className="text-muted-foreground text-sm">
            Register to get started with North Central Engineering.
          </span>
        </CardHeader>
        <CardContent className="pt-2 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                required
                className="bg-white/80"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                className="bg-white/80"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full border rounded px-2 py-1 bg-white/80"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-sm text-center">
                Registration successful! You can now login.
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
