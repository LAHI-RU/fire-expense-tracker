// API routes for individual expense operations
import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const expenseId = params.id
    const body = await request.json()
    const { project_id, category_id, employee_id, description, amount, expense_date, receipt_url, notes } = body

    await Database.query(
      `UPDATE expenses SET 
       project_id = ?, category_id = ?, employee_id = ?, description = ?, 
       amount = ?, expense_date = ?, receipt_url = ?, notes = ?, 
       updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [project_id, category_id, employee_id, description, amount, expense_date, receipt_url, notes, expenseId],
    )

    return NextResponse.json({ success: true, message: "Expense updated successfully" })
  } catch (error) {
    console.error("Error updating expense:", error)
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const expenseId = params.id

    await Database.query("DELETE FROM expenses WHERE id = ?", [expenseId])

    return NextResponse.json({ success: true, message: "Expense deleted successfully" })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 })
  }
}
