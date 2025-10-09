// Server-side authentication middleware to verify JWT tokens against database
import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { Database } from "./mysql"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

export async function verifyAuthToken(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("token")?.value
    
    if (!token) {
      return { valid: false, error: "No token provided" }
    }

    // Verify JWT signature
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return { valid: false, error: "Invalid token signature" }
    }

    // CRITICAL: Verify user still exists in database
    const users = await Database.query(
      "SELECT id, email, full_name, role FROM users WHERE id = ? AND email = ?", 
      [decoded.id, decoded.email]
    )

    if (!Array.isArray(users) || users.length === 0) {
      return { 
        valid: false, 
        error: "User no longer exists in database",
        shouldClearToken: true 
      }
    }

    const user = users[0] as any
    
    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    }
    
  } catch (error) {
    console.error("Auth verification error:", error)
    return { valid: false, error: "Authentication verification failed" }
  }
}