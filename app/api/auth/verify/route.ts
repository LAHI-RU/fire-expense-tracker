// API route to verify current authentication status
import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const authResult = await verifyAuthToken(request)
  
  if (!authResult.valid) {
    // Clear invalid token
    const response = NextResponse.json(
      { authenticated: false, error: authResult.error }, 
      { status: 401 }
    )
    
    if (authResult.shouldClearToken) {
      response.cookies.set("token", "", {
        path: "/",
        expires: new Date(0),
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      })
    }
    
    return response
  }

  return NextResponse.json({
    authenticated: true,
    user: authResult.user
  })
}

export async function DELETE(request: NextRequest) {
  // Logout - clear token
  const response = NextResponse.json({ success: true, message: "Logged out successfully" })
  
  response.cookies.set("token", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  })
  
  return response
}