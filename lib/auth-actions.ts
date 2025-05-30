"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface RegisterParams {
  name: string
  email: string
  password: string
}

interface LoginParams {
  email: string
  password: string
}

interface UpdateProfileParams {
  id: number
  name: string
  email: string
}

export async function registerUser(params: RegisterParams) {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

    const response = await fetch(`${baseUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Registration failed" }))
      return {
        success: false,
        error: errorData.error || "Registration failed",
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Register action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

export async function loginUser(params: LoginParams) {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

    const response = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Login failed" }))
      return {
        success: false,
        error: errorData.error || "Login failed",
      }
    }

    const data = await response.json()

    // Set the cookie from the response
    const setCookieHeader = response.headers.get("set-cookie")
    if (setCookieHeader) {
      const cookieStore = cookies()
      // Parse the token from set-cookie header
      const tokenMatch = setCookieHeader.match(/token=([^;]+)/)
      if (tokenMatch) {
        cookieStore.set("token", tokenMatch[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        })
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Login action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

export async function updateUserProfile(params: UpdateProfileParams) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return {
        success: false,
        error: "Authentication required",
      }
    }

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

    const response = await fetch(`${baseUrl}/api/profile/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({
        name: params.name,
        email: params.email,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Update failed" }))
      return {
        success: false,
        error: errorData.error || "Update failed",
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Update profile action error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

export async function logoutUser() {
  const cookieStore = cookies()
  cookieStore.delete("token")
  redirect("/login")
}
