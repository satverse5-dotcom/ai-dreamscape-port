import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "resume.pdf");

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Resume not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Satyam_Kumar_Karn_Resume.pdf"',
      "Content-Length": fileBuffer.length.toString(),
    },
  });
}
