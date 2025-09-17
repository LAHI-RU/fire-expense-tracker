// API routes for income management with MySQL backend
import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id")
    const paymentStatus = searchParams.get("payment_status")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    let query = `
      SELECT i.*, p.name as project_name
      FROM incomes i
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE 1=1
    `
    const params: any[] = []

    if (projectId) {
      query += " AND i.project_id = ?"
      params.push(projectId)
    }

    if (paymentStatus) {
      query += " AND i.payment_status = ?"
      params.push(paymentStatus)
    }

    if (startDate) {
      query += " AND i.payment_date >= ?"
      params.push(startDate)
    }

    if (endDate) {
      query += " AND i.payment_date <= ?"
      params.push(endDate)
    }

    query += " ORDER BY i.payment_date DESC, i.created_at DESC"

    const incomes = await Database.query(query, params)
    return NextResponse.json({ incomes })
  } catch (error) {
    console.error("Error fetching incomes:", error)
    return NextResponse.json({ error: "Failed to fetch incomes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      project_id,
      description,
      amount,
      payment_date,
      payment_method,
      payment_status,
      invoice_number,
      notes,
      created_by,
    } = body

    const result = await Database.query(
      `INSERT INTO incomes (project_id, description, amount, payment_date, payment_method, payment_status, invoice_number, notes, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id,
        description,
        amount,
        payment_date,
        payment_method,
        payment_status,
        invoice_number,
        notes,
        created_by,
      ],
    )

    return NextResponse.json({
      success: true,
      incomeId: (result as any).insertId,
      message: "Income created successfully",
    })
  } catch (error) {
    console.error("Error creating income:", error)
    return NextResponse.json({ error: "Failed to create income" }, { status: 500 })
  }
}
