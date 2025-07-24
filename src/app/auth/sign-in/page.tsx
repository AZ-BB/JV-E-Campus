"use client"
import { createBrowserClient } from "@supabase/ssr"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Static image component with logo
const StaticImage = () => {
  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700">
      {/* Static first image */}
      <img
        src="/auth/1.jpeg"
        alt="JV Campus Training Center"
        className="w-full h-full object-cover"
      />

      {/* Overlay gradient with green theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/50 to-emerald-900/50"></div>

      {/* Logo and text overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">JV Campus</h1>
          <p className="text-xl opacity-90 drop-shadow-md max-w-md">
            Excellence in Training & Development
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        // Redirect based on role
        const role = user.user_metadata?.role
        if (role === "ADMIN") {
          router.push("/admin")
        } else if (role === "STAFF") {
          router.push("/staff")
        } else {
          router.push("/")
        }
      }
    }
    checkUser()
  }, [router, supabase])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (data.user) {
        // Redirect based on role
        const role = data.user.user_metadata?.role
        console.log("User signed in with role:", role)
        if (role === "ADMIN") {
          router.push("/admin")
        } else if (role === "STAFF") {
          router.push("/staff")
        } else {
          router.push("/")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Sign in error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Static Image */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
        <StaticImage />
      </div>

      {/* Right side - Sign In Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center bg-white p-8">
        <div className="max-w-md w-full">
          {/* Logo/Header Section */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="mb-6 flex justify-center p-2 py-4 bg-[#01a252] rounded-lg">
              <img
                src="/logo.jpg"
                alt="JV Campus Logo"
                className="h-20 w-auto rounded-lg"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your training portal
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      Sign in failed
                    </h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <span className="font-medium text-green-600">
                Contact your administrator
              </span>
            </p>
          </div>

          {/* Mobile image preview */}
          <div className="lg:hidden mt-8">
            <div className="relative h-32 rounded-lg overflow-hidden">
              <StaticImage />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
