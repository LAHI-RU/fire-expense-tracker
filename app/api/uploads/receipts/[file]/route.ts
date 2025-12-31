import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: { file: string } }
) {
  try {
    const fileName = params.file
    const filePath = path.join(process.cwd(), "uploads", "receipts", fileName)
    const data = await fs.readFile(filePath)

    const ext = path.extname(fileName).toLowerCase()
    const mime =
      ext === ".pdf"
        ? "application/pdf"
        : ext === ".png"
        ? "image/png"
        : ext === ".webp"
        ? "image/webp"
        : ext === ".heic" || ext === ".heif"
        ? "image/heif"
        : "image/jpeg"

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Receipt fetch error:", error)
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }
}
