// API routes for individual salary payment operations
import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const paymentId = params.id
    const body = await request.json()
    const sanitize = (v: any) => (v === undefined ? null : v)
    const employee_id = sanitize(body.employee_id)
    const project_id = sanitize(body.project_id)
    const amount = sanitize(body.amount)
    const payment_date = sanitize(body.payment_date)
    const raw_payment_type = sanitize(body.payment_type)
    const normalized_payment_type =
      typeof raw_payment_type === "string"
        ? raw_payment_type.trim().toLowerCase().replace(/\s+/g, "_")
        : raw_payment_type
    const notes = sanitize(body.notes)

    const allowedTypes = new Set([
      "monthly_salary",
      "project_bonus",
      "overtime",
      "other",
    ])

    if (!allowedTypes.has(String(normalized_payment_type))) {
      return NextResponse.json(
        {
          error: "Invalid payment_type",
          message:
            "payment_type must be one of: monthly_salary | project_bonus | overtime | other",
        },
        { status: 400 },
      )
    }

    const paymentDateObj = new Date(payment_date)
    const payment_month = paymentDateObj.getMonth() + 1
    const payment_year = paymentDateObj.getFullYear()

    if (normalized_payment_type === "monthly_salary") {
      const existingPayments = await Database.query(
        "SELECT id FROM salary_payments WHERE employee_id = ? AND payment_month = ? AND payment_year = ? AND payment_type = 'monthly_salary' AND id <> ?",
        [employee_id, payment_month, payment_year, paymentId],
      )

      if ((existingPayments as any[]).length > 0) {
        return NextResponse.json(
          {
            error: "Duplicate payment detected",
            message: `Monthly salary for ${paymentDateObj.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })} has already been paid to this employee.`,
          },
          { status: 400 },
        )
      }
    }

    await Database.query(
      `UPDATE salary_payments 
       SET employee_id = ?, project_id = ?, amount = ?, payment_date = ?, payment_month = ?, payment_year = ?, payment_type = ?, notes = ? 
       WHERE id = ?`,
      [
        employee_id,
        project_id,
        amount,
        payment_date,
        payment_month,
        payment_year,
        normalized_payment_type,
        notes,
        paymentId,
      ],
    )

    return NextResponse.json({
      success: true,
      message: "Salary payment updated successfully",
    })
  } catch (error) {
    console.error("Error updating salary payment:", error)
    return NextResponse.json(
      { error: "Failed to update salary payment" },
      { status: 500 },
    )
  }
}

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
