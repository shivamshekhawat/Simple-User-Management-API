import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: number
  name: string
  email: string
  password: string
  created_at: Date
  updated_at: Date
}

let isInitialized = false

export async function initializeDatabase() {
  if (isInitialized) return

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `

    isInitialized = true
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}

export async function createUser(user: { name: string; email: string; password: string }) {
  await initializeDatabase()

  const result = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${user.name}, ${user.email}, ${user.password})
    RETURNING *
  `
  return result[0] as User
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await initializeDatabase()

  const result = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `
  return result.length > 0 ? (result[0] as User) : null
}

export async function getUserById(id: number): Promise<User | null> {
  await initializeDatabase()

  const result = await sql`
    SELECT * FROM users WHERE id = ${id} LIMIT 1
  `
  return result.length > 0 ? (result[0] as User) : null
}

export async function updateUser(id: number, data: { name?: string; email?: string }): Promise<User> {
  await initializeDatabase()

  const result = await sql`
    UPDATE users
    SET 
      name = COALESCE(${data.name}, name),
      email = COALESCE(${data.email}, email),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `
  return result[0] as User
}
