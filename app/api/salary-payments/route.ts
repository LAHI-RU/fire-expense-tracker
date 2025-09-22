// API routes for salary payment management with duplicate prevention
import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employee_id")
    const year = searchParams.get("year")
    const month = searchParams.get("month")

    let query = `
      SELECT sp.*, e.full_name as employee_name, e.employee_code, p.name as project_name
      FROM salary_payments sp
      LEFT JOIN employees e ON sp.employee_id = e.id
      LEFT JOIN projects p ON sp.project_id = p.id
      WHERE 1=1
    `
    const params: any[] = []

    if (employeeId) {
      query += " AND sp.employee_id = ?"
      params.push(employeeId)
    }

    if (year) {
      query += " AND sp.payment_year = ?"
      params.push(year)
    }

    if (month) {
      query += " AND sp.payment_month = ?"
      params.push(month)
    }

    query += " ORDER BY sp.payment_date DESC, sp.created_at DESC"

    const payments = await Database.query(query, params)
    return NextResponse.json({ payments })
  } catch (error) {
    console.error("Error fetching salary payments:", error)
    return NextResponse.json({ error: "Failed to fetch salary payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Sanitize all parameters: replace undefined with null
    const sanitize = (v: any) => v === undefined ? null : v
    const employee_id = sanitize(body.employee_id)
    const project_id = sanitize(body.project_id)
    const amount = sanitize(body.amount)
    const payment_date = sanitize(body.payment_date)
    const payment_type = sanitize(body.payment_type)
    const notes = sanitize(body.notes)
    const created_by = sanitize(body.created_by)

    const paymentDateObj = new Date(payment_date)
    const payment_month = paymentDateObj.getMonth() + 1
    const payment_year = paymentDateObj.getFullYear()

    // Check for duplicate monthly salary payment
    if (payment_type === "monthly_salary") {
      const existingPayments = await Database.query(
        "SELECT id FROM salary_payments WHERE employee_id = ? AND payment_month = ? AND payment_year = ? AND payment_type = 'monthly_salary'",
        [employee_id, payment_month, payment_year],
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

    const result = await Database.query(
      `INSERT INTO salary_payments (employee_id, project_id, amount, payment_date, payment_month, payment_year, payment_type, notes, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employee_id, project_id, amount, payment_date, payment_month, payment_year, payment_type, notes, created_by],
    )

    return NextResponse.json({
      success: true,
      paymentId: (result as any).insertId,
      message: "Salary payment recorded successfully",
    })
  } catch (error) {
    console.error("Error creating salary payment:", error)
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          error: "Duplicate payment detected",
          message: "This monthly salary payment has already been recorded.",
        },
        { status: 400 },
      )
    }
    return NextResponse.json({ error: "Failed to record salary payment" }, { status: 500 })
  }
}
