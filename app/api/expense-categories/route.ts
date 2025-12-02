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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const nameRaw = (body.name || "").toString().trim()
    const description = (body.description || null) as string | null
    if (!nameRaw) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }
    // Normalize spacing and casing minimally
    const name = nameRaw.replace(/\s+/g, " ")

    // Insert or ignore if exists, then fetch
    await Database.query(
      "INSERT INTO expense_categories (name, description, is_active) VALUES (?, ?, TRUE) ON DUPLICATE KEY UPDATE is_active = VALUES(is_active), description = COALESCE(VALUES(description), description)",
      [name, description]
    )

    const [category] = (await Database.query(
      "SELECT * FROM expense_categories WHERE name = ?",
      [name]
    )) as any[]

    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
