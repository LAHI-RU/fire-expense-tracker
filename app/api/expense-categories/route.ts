// API routes for expense categories
import { NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function GET() {
  try {
    const categories = await Database.query("SELECT * FROM expense_categories WHERE is_active = TRUE ORDER BY name")
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching expense categories:", error)
    return NextResponse.json({ error: "Failed to fetch expense categories" }, { status: 500 })
  }
}
