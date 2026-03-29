import { NextRequest, NextResponse } from "next/server";

// Proxy to the Express backend deploy route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:5000/api/deploy/vercel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Deploy proxy error: " + err.message },
      { status: 500 }
    );
  }
}
