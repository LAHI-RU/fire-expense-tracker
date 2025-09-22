// API routes for individual project operations
import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/mysql"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    const projects = await Database.query("SELECT * FROM projects WHERE id = ?", [projectId])

    if ((projects as any[]).length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project: (projects as any[])[0] })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    const body = await request.json()
    // Sanitize: replace undefined with null for SQL
    const sanitize = (v: any) => v === undefined ? null : v
    const {
      name,
      client_name,
      client_contact,
      description,
      status,
      start_date,
      end_date,
      estimated_budget
    } = body

    await Database.query(
      `UPDATE projects SET 
       name = ?, client_name = ?, client_contact = ?, description = ?, 
       status = ?, start_date = ?, end_date = ?, estimated_budget = ?, 
       updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        sanitize(name),
        sanitize(client_name),
        sanitize(client_contact),
        sanitize(description),
        sanitize(status),
        sanitize(start_date),
        sanitize(end_date),
        sanitize(estimated_budget),
        projectId
      ],
    )

    return NextResponse.json({ success: true, message: "Project updated successfully" })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    await Database.query("DELETE FROM projects WHERE id = ?", [projectId])

    return NextResponse.json({ success: true, message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
