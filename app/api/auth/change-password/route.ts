import { NextResponse } from "next/server";
import { Database } from "@/lib/mysql";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { userId, oldPassword, newPassword } = await request.json();
    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Get user
    const users = await Database.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = users[0] as any;
    // Check old password
  const valid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }
    // Hash new password
    const hash = await bcrypt.hash(newPassword, 10);
  await Database.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, userId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Password change failed" }, { status: 500 });
  }
}
