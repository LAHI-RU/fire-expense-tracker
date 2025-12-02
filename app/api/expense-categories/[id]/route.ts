// API for single expense category update
import { NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    const body = await request.json()
    const name = (body.name ?? "").toString().trim()
    const description = body.description === undefined ? null : (body.description as string | null)
    const is_active = body.is_active === undefined ? null : Boolean(body.is_active)

    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid category id" }, { status: 400 })
    }
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    await Database.query(
      `UPDATE expense_categories 
       SET name = ?, description = COALESCE(?, description), is_active = COALESCE(?, is_active), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, description, is_active, id]
    )

    const [category] = (await Database.query("SELECT * FROM expense_categories WHERE id = ?", [id])) as any[]
    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}
