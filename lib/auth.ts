import { createHmac } from "crypto"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-for-development"

interface JwtPayload {
  userId: number
  email: string
  iat?: number
  exp?: number
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function base64UrlDecode(str: string): string {
  str += new Array(5 - (str.length % 4)).join("=")
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
}

function createSignature(data: string, secret: string): string {
  const hmac = createHmac("sha256", secret)
  hmac.update(data)
  const signature = hmac.digest("base64")
  return signature.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

export function generateJwtToken(payload: JwtPayload): string {
  try {
    const header = { alg: "HS256", typ: "JWT" }
    const now = Math.floor(Date.now() / 1000)
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + 7 * 24 * 60 * 60, // 7 days
    }

    const encodedHeader = base64UrlEncode(JSON.stringify(header))
    const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload))
    const data = `${encodedHeader}.${encodedPayload}`
    const signature = createSignature(data, JWT_SECRET)

    return `${data}.${signature}`
  } catch (error) {
    console.error("JWT generation error:", error)
    throw new Error("Failed to generate authentication token")
  }
}

export function verifyJwtToken(token: string): JwtPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, signature] = parts
    const data = `${encodedHeader}.${encodedPayload}`
    const expectedSignature = createSignature(data, JWT_SECRET)

    if (signature !== expectedSignature) return null

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch (error) {
    console.error("JWT verification error:", error)
    return null
  }
}
