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
    let {
      employee_code,
      full_name,
      position,
      daily_rate,
      monthly_salary,
      phone,
      address,
      hire_date,
      is_active = true,
    } = body

    // Auto-generate employee_code if not provided
    if (!employee_code) {
      // Get latest employee_code
      const rows = await Database.query("SELECT employee_code FROM employees ORDER BY id DESC LIMIT 1") as any[];
      let nextNum = 1;
      if (Array.isArray(rows) && rows.length > 0 && rows[0]?.employee_code) {
        const match = (rows[0].employee_code as string).match(/EMP(\d+)/);
        if (match) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }
      employee_code = `EMP-${nextNum.toString().padStart(2, "0")}`;
    }

    // Convert undefined to null for SQL
    const safeParams = [
      employee_code ?? null,
      full_name ?? null,
      position ?? null,
      daily_rate ?? null,
      monthly_salary ?? null,
      phone ?? null,
      address ?? null,
      hire_date ?? null,
      is_active ?? null,
    ];

    const result = await Database.query(
      `INSERT INTO employees (employee_code, full_name, position, daily_rate, monthly_salary, phone, address, hire_date, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      safeParams,
    )

    return NextResponse.json({
      success: true,
      employeeId: (result as any).insertId,
      employee_code,
      message: "Employee created successfully",
    })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
