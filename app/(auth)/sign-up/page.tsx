"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Film, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const isConfigured = isSupabaseConfigured()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!isConfigured) {
      setError("Authentication service is not configured. Please add Supabase environment variables.")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    if (!supabase) {
      setError("Failed to initialize authentication. Please check your configuration.")
      setIsLoading(false)
      return
    }

    try {
      const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
          },
        },
      })

      console.log("[v0] Sign up result:", { data, error: signUpError })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      console.error("[v0] Sign up error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-40 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md text-center">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent a confirmation link to <strong className="text-foreground">{email}</strong>. Click the link to
              activate your account.
            </p>
            <Link href="/sign-in">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Film className="w-8 h-8 text-primary" />
          <span className="font-bold text-2xl text-foreground">The Final Cut</span>
        </Link>

        {/* Sign Up Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join us and start discovering movies</p>
          </div>

          {!isConfigured && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-amber-500 text-sm font-medium">Supabase not configured</p>
              <p className="text-amber-500/80 text-xs mt-1">
                Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the Vars section.
              </p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-secondary border-border"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isConfigured}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white py-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Landing */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
