import { NextResponse } from "next/server";
import { Database } from "@/lib/mysql";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { full_name, email, password, role } = await request.json();
    if (!full_name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Check if user exists
    const existing = await Database.query("SELECT id FROM users WHERE email = ?", [email]);
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    await Database.query(
      "INSERT INTO users (email, full_name, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())",
      [email, full_name, hash, role]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
