import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("Logout API called")

    const response = NextResponse.json({ success: true, message: "Logged out successfully" })

    // Clear the token cookie
    response.cookies.set({
      name: "token",
      value: "",
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    console.log("Logout successful")
    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
