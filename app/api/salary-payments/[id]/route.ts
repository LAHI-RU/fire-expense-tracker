// API routes for individual salary payment operations
import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentId = params.id

    await Database.query("DELETE FROM salary_payments WHERE id = ?", [paymentId])

    return NextResponse.json({ success: true, message: "Salary payment deleted successfully" })
  } catch (error) {
    console.error("Error deleting salary payment:", error)
    return NextResponse.json({ error: "Failed to delete salary payment" }, { status: 500 })
  }
}
