// API routes for project management with MySQL backend
import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = "SELECT * FROM projects ORDER BY created_at DESC"
    let params: any[] = []

    if (status && status !== "all") {
      query = "SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC"
      params = [status]
    }

    const projects = await Database.query(query, params)
    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      client_name,
      client_contact,
      description,
      status,
      start_date,
      end_date,
      estimated_budget,
      created_by,
    } = body

    // Convert undefined to null for SQL
    const safeParams = [
      name ?? null,
      client_name ?? null,
      client_contact ?? null,
      description ?? null,
      status ?? "planning",
      start_date ?? null,
      end_date ?? null,
      estimated_budget ?? null,
      created_by ?? null,
    ];

    const result = await Database.query(
      `INSERT INTO projects (name, client_name, client_contact, description, status, start_date, end_date, estimated_budget, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      safeParams,
    )

    return NextResponse.json({
      success: true,
      projectId: (result as any).insertId,
      message: "Project created successfully",
    })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
