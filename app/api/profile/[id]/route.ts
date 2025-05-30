import { type NextRequest, NextResponse } from "next/server"
import { getUserById, updateUser, getUserByEmail } from "@/lib/db"
import { verifyJwtToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyJwtToken(token)

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Only allow users to access their own profile
    const requestedId = Number.parseInt(params.id)
    if (payload.userId !== requestedId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get user from database
    const user = await getUserById(requestedId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyJwtToken(token)

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Only allow users to update their own profile
    const requestedId = Number.parseInt(params.id)
    if (payload.userId !== requestedId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { name, email } = body

    // Input validation
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Check if email is being changed and if it's already taken
    const existingUser = await getUserById(requestedId)
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (email !== existingUser.email) {
      const emailTaken = await getUserByEmail(email)
      if (emailTaken && emailTaken.id !== requestedId) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
    }

    // Update user
    const updatedUser = await updateUser(requestedId, { name, email })

    // Return updated user without password
    const { password, ...userWithoutPassword } = updatedUser
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
