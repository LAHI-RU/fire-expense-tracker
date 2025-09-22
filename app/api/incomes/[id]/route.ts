// API routes for individual income operations
import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const incomeId = params.id
    const body = await request.json()
    // Sanitize: replace undefined with null for SQL
    const sanitize = (v: any) => v === undefined ? null : v
    const {
      project_id,
      description,
      amount,
      payment_date,
      payment_method,
      payment_status,
      invoice_number,
      notes
    } = body

    await Database.query(
      `UPDATE incomes SET 
       project_id = ?, description = ?, amount = ?, payment_date = ?, 
       payment_method = ?, payment_status = ?, invoice_number = ?, notes = ?, 
       updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        sanitize(project_id),
        sanitize(description),
        sanitize(amount),
        sanitize(payment_date),
        sanitize(payment_method),
        sanitize(payment_status),
        sanitize(invoice_number),
        sanitize(notes),
        incomeId
      ],
    )

    return NextResponse.json({ success: true, message: "Income updated successfully" })
  } catch (error) {
    console.error("Error updating income:", error)
    return NextResponse.json({ error: "Failed to update income" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const incomeId = params.id

    await Database.query("DELETE FROM incomes WHERE id = ?", [incomeId])

    return NextResponse.json({ success: true, message: "Income deleted successfully" })
  } catch (error) {
    console.error("Error deleting income:", error)
    return NextResponse.json({ error: "Failed to delete income" }, { status: 500 })
  }
}
