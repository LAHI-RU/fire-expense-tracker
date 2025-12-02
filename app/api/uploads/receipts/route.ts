import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export const dynamic = "force-dynamic" // ensure edge caching isn't applied

const ACCEPTED = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
])
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ACCEPTED.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const ext =
      file.type === "application/pdf"
        ? ".pdf"
        : file.type === "image/png"
        ? ".png"
        : file.type === "image/webp"
        ? ".webp"
        : ".jpg"

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "receipts")
    await fs.mkdir(uploadsDir, { recursive: true })

    const fullPath = path.join(uploadsDir, safeName)
    await fs.writeFile(fullPath, buffer)

    const url = `/uploads/receipts/${safeName}`
    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error("Receipt upload error:", error)
    return NextResponse.json({ error: "Failed to upload receipt" }, { status: 500 })
  }
}
