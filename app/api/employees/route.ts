import { type NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/mysql";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("is_active");

    let query = "SELECT * FROM employees";
    const params: any[] = [];

    if (isActive !== null) {
      query += " WHERE is_active = ?";
      params.push(isActive === "true");
    }

    // Order by newest first for clarity
    query += " ORDER BY id DESC";

    const employees = await Database.query(query, params);
    return NextResponse.json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    } = body;

    // Convert undefined to null for SQL
    const safeParams = [
      employee_code ?? null,
      full_name ?? null,
      position ?? null,
      hourly_rate ?? null,
      monthly_salary ?? null,
      phone ?? null,
      address ?? null,
      hire_date ?? null,
      is_active ?? null,
    ];

    const result = await Database.query(
      `INSERT INTO employees (employee_code, full_name, position, hourly_rate, monthly_salary, phone, address, hire_date, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      safeParams,
    );

    // Return the newly created employee for immediate frontend update
    const [newEmployee] = await Database.query(
      "SELECT * FROM employees WHERE id = ?",
      [(result as any).insertId]
    );

    return NextResponse.json({
      success: true,
      employee: newEmployee,
      message: "Employee created successfully",
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}