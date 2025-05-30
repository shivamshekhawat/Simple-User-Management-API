"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  UserIcon,
  Mail,
  Edit3,
  Save,
  LogOut,
  Home,
  CheckCircle,
  AlertCircle,
  Shield,
  Calendar,
  Settings,
} from "lucide-react"

interface UserType {
  id: number
  name: string
  email: string
  created_at?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })

  useEffect(() => {
    checkAuthentication()
  }, [])

  async function checkAuthentication() {
    try {
      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("authToken")

      if (!storedUser || !storedToken) {
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
        return
      }

      const userData = JSON.parse(storedUser)
      setUser(userData)
      setFormData({ name: userData.name, email: userData.email })

      const response = await fetch(`/api/profile/${userData.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })

      if (response.ok) {
        const profileData = await response.json()
        setUser(profileData)
        setFormData({ name: profileData.name, email: profileData.email })
        setLoading(false)
      } else {
        setError("Authentication failed. Please log in again.")
        setLoading(false)
        setTimeout(() => {
          localStorage.removeItem("user")
          localStorage.removeItem("authToken")
          window.location.href = "/login"
        }, 3000)
      }
    } catch (err) {
      setError("Authentication error occurred")
      setLoading(false)
      setTimeout(() => {
        localStorage.removeItem("user")
        localStorage.removeItem("authToken")
        window.location.href = "/login"
      }, 3000)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    setUpdateLoading(true)
    setError(null)
    setSuccess(null)

    const token = localStorage.getItem("authToken")

    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))

        if (response.status === 401 || response.status === 403) {
          setError("Session expired. Please log in again.")
          setTimeout(() => {
            localStorage.removeItem("user")
            localStorage.removeItem("authToken")
            window.location.href = "/login"
          }, 2000)
          return
        }

        throw new Error(errorData.error || "Failed to update profile")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setFormData({ name: updatedUser.name, email: updatedUser.email })
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setSuccess("Profile updated successfully!")
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setUpdateLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    window.location.href = "/login"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Profile</h2>
            <p className="text-gray-600">Verifying your authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">Redirecting to login...</p>
            <Button onClick={() => (window.location.href = "/login")} className="w-full">
              Go to Login Now
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Please log in to view your profile</p>
            <Button onClick={() => (window.location.href = "/login")} className="w-full">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome back, {user.name}!</h2>
                <p className="text-purple-100">User ID: #{user.id}</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Account Information
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    {!isEditing ? (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="submit"
                          disabled={updateLoading}
                          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          {updateLoading ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Saving...
                            </div>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false)
                            setFormData({ name: user.name, email: user.email })
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </div>

              {/* Account Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Account Details
                </h3>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Account Status</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">User ID</span>
                      <span className="text-sm text-gray-900 font-mono">#{user.id}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Email Status</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                        <Mail className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="flex-1 h-12 border-gray-300 hover:bg-gray-50"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex-1 h-12 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
