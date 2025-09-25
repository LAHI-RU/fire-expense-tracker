// API routes for individual employee operations
import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const employeeId = params.id

    const employees = await Database.query("SELECT * FROM employees WHERE id = ?", [employeeId])

    if ((employees as any[]).length === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json({ employee: (employees as any[])[0] })
  } catch (error) {
    console.error("Error fetching employee:", error)
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const employeeId = params.id
    const body = await request.json()
    // Sanitize: replace undefined with null for SQL
    const sanitize = (v: any) => v === undefined ? null : v
    const {
      employee_code,
      full_name,
      position,
      daily_rate,
      monthly_salary,
      phone,
      address,
      hire_date,
      is_active
    } = body

    await Database.query(
      `UPDATE employees SET 
       employee_code = ?, full_name = ?, position = ?, daily_rate = ?, 
       monthly_salary = ?, phone = ?, address = ?, hire_date = ?, is_active = ?, 
       updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        sanitize(employee_code),
        sanitize(full_name),
        sanitize(position),
        sanitize(daily_rate),
        sanitize(monthly_salary),
        sanitize(phone),
        sanitize(address),
        sanitize(hire_date),
        sanitize(is_active),
        employeeId,
      ],
    )

    return NextResponse.json({ success: true, message: "Employee updated successfully" })
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const employeeId = params.id

    // Soft delete - set is_active to false instead of deleting
    await Database.query("UPDATE employees SET is_active = FALSE WHERE id = ?", [employeeId])

    return NextResponse.json({ success: true, message: "Employee deactivated successfully" })
  } catch (error) {
    console.error("Error deactivating employee:", error)
    return NextResponse.json({ error: "Failed to deactivate employee" }, { status: 500 })
  }
}
