"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, User, Lock, ArrowRight, Star, Users, Zap, UserPlus, Edit3 } from "lucide-react"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Error parsing stored user:", e)
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AuthSystem</span>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
                  <Button onClick={() => (window.location.href = "/profile")} size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      localStorage.removeItem("user")
                      localStorage.removeItem("authToken")
                      setUser(null)
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild size="sm">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8">
            <Lock className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Secure Authentication
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A complete authentication system built with Next.js, PostgreSQL, and JWT. Secure, scalable, and ready for
            production.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            ) : (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/profile">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* API Endpoints Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">API Endpoints</h2>
            <p className="text-xl text-gray-600">Complete authentication system with secure endpoints</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 border border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">POST /api/register</h3>
              <p className="text-gray-600 mb-3">Register a new user with name, email, and password</p>
              <div className="bg-white rounded-lg p-3 font-mono text-sm text-gray-700">
                {`{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">POST /api/login</h3>
              <p className="text-gray-600 mb-3">Login with email and password, returns JWT token</p>
              <div className="bg-white rounded-lg p-3 font-mono text-sm text-gray-700">
                {`{ "email": "john@example.com", "password": "password123" }`}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">GET /api/profile/{`{id}`}</h3>
              <p className="text-gray-600 mb-3">Get user profile by ID (requires JWT token)</p>
              <div className="bg-white rounded-lg p-3 font-mono text-sm text-gray-700">
                Authorization: Bearer {`{token}`}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                <Edit3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">PUT /api/profile/{`{id}`}</h3>
              <p className="text-gray-600 mb-3">Update user profile (requires JWT token)</p>
              <div className="bg-white rounded-lg p-3 font-mono text-sm text-gray-700">
                {`{ "name": "Updated Name", "email": "new@example.com" }`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Built with modern technologies</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">JWT Security</h3>
              <p className="text-blue-100">Secure token-based authentication with bcrypt password hashing</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">PostgreSQL</h3>
              <p className="text-blue-100">Reliable database with proper indexing and data validation</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Next.js 15</h3>
              <p className="text-blue-100">Modern React framework with server-side rendering and API routes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AuthSystem</span>
            </div>

            <div className="flex items-center space-x-6">
              <span className="text-gray-400">Built with Next.js & PostgreSQL</span>
              <div className="flex items-center space-x-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm">Star on GitHub</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AuthSystem. Built for demonstration purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
