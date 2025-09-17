// API routes for employee management with MySQL backend
import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get("is_active")

    let query = "SELECT * FROM employees"
    const params: any[] = []

    if (isActive !== null) {
      query += " WHERE is_active = ?"
      params.push(isActive === "true")
    }

    query += " ORDER BY full_name"

    const employees = await Database.query(query, params)
    return NextResponse.json({ employees })
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employee_code,
      full_name,
      position,
      hourly_rate,
      monthly_salary,
      phone,
      address,
      hire_date,
      is_active = true,
    } = body

    const result = await Database.query(
      `INSERT INTO employees (employee_code, full_name, position, hourly_rate, monthly_salary, phone, address, hire_date, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employee_code, full_name, position, hourly_rate, monthly_salary, phone, address, hire_date, is_active],
    )

    return NextResponse.json({
      success: true,
      employeeId: (result as any).insertId,
      message: "Employee created successfully",
    })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
