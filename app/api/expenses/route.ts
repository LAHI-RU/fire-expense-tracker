// API routes for expense management with MySQL backend
import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id")
    const categoryId = searchParams.get("category_id")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    let query = `
      SELECT e.*, ec.name as category_name, emp.full_name as employee_name, p.name as project_name
      FROM expenses e
      LEFT JOIN expense_categories ec ON e.category_id = ec.id
      LEFT JOIN employees emp ON e.employee_id = emp.id
      LEFT JOIN projects p ON e.project_id = p.id
      WHERE 1=1
    `
    const params: any[] = []

    if (projectId) {
      query += " AND e.project_id = ?"
      params.push(projectId)
    }

    if (categoryId) {
      query += " AND e.category_id = ?"
      params.push(categoryId)
    }

    if (startDate) {
      query += " AND e.expense_date >= ?"
      params.push(startDate)
    }

    if (endDate) {
      query += " AND e.expense_date <= ?"
      params.push(endDate)
    }

    query += " ORDER BY e.expense_date DESC, e.created_at DESC"

    const expenses = await Database.query(query, params)
    return NextResponse.json({ expenses })
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Sanitize all parameters: replace undefined with null
    const sanitize = (v: any) => v === undefined ? null : v;
    const params = [
      sanitize(body.project_id),
      sanitize(body.category_id),
      sanitize(body.employee_id),
      sanitize(body.description),
      sanitize(body.amount),
      sanitize(body.expense_date),
      sanitize(body.receipt_url),
      sanitize(body.notes),
      sanitize(body.created_by)
    ];

    const result = await Database.query(
      `INSERT INTO expenses (project_id, category_id, employee_id, description, amount, expense_date, receipt_url, notes, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params,
    );

    return NextResponse.json({
      success: true,
      expenseId: (result as any).insertId,
      message: "Expense created successfully",
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
