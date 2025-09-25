import { NextResponse } from "next/server";
import { Database } from "@/lib/mysql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }
    const users = await Database.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const user = users[0] as any;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    // Create JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    // Set cookie
    return NextResponse.json({ success: true }, {
      headers: {
        "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
