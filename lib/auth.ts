// Get user info from JWT cookie (client-side)
export function getUserFromCookie(): null | { id: number; email: string; role: string } {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/token=([^;]+)/);
  if (!match) return null;
  try {
    return jwt.decode(match[1]) as { id: number; email: string; role: string };
  } catch {
    return null;
  }
}

// Redirect to login if not authenticated (client-side)
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
// Authentication utilities for MySQL backend
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Database, type User } from "./mysql"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this"

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  static generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return null
    }
  }

  static async login(email: string, password: string) {
    try {
      const users = (await Database.query("SELECT * FROM users WHERE email = ?", [email])) as User[]

      if (users.length === 0) {
        throw new Error("User not found")
      }

      const user = users[0]
      const isValidPassword = await this.verifyPassword(password, user.password_hash)

      if (!isValidPassword) {
        throw new Error("Invalid password")
      }

      const token = this.generateToken(user)

      return {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
        token,
      }
    } catch (error) {
      throw error
    }
  }

  static async register(email: string, password: string, fullName: string, role: "admin" | "employee" = "employee") {
    try {
      const hashedPassword = await this.hashPassword(password)

      const result = await Database.query(
        "INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)",
        [email, hashedPassword, fullName, role],
      )

      return { success: true, userId: (result as any).insertId }
    } catch (error) {
      throw error
    }
  }
}
