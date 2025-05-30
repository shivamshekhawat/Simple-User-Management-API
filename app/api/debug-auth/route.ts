import { type NextRequest, NextResponse } from "next/server"
import { verifyJwtToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    console.log("=== DEBUG AUTH API START ===")

    const allCookies = request.cookies.getAll()
    console.log("All cookies:", allCookies)

    const token = request.cookies.get("token")?.value
    console.log("Token found:", !!token)

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        error: "No token found",
        cookies: allCookies.map((c) => ({ name: c.name, hasValue: !!c.value, length: c.value?.length || 0 })),
        timestamp: new Date().toISOString(),
      })
    }

    console.log("Token preview:", token.substring(0, 50) + "...")

    const payload = verifyJwtToken(token)
    console.log("Token verification result:", payload)

    return NextResponse.json({
      authenticated: !!payload,
      payload,
      tokenLength: token.length,
      tokenPreview: token.substring(0, 50) + "...",
      cookies: allCookies.map((c) => ({ name: c.name, hasValue: !!c.value, length: c.value?.length || 0 })),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("=== DEBUG AUTH API ERROR ===", error)
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })
  }
}
