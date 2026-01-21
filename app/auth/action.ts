"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const signInWithGoogle = async () => {
  const origin = (await headers()).get("origin")
  const supabase = await createClient()

  const redirectUrl = process.env.NODE_ENV === 'development'
  ? "http://localhost:3000/auth/callback"
  : "https://your-production-domain.com/auth/callback"
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl
    }
  })

  if (data.url) {
    redirect(data.url)
  }
}

export const signOut = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
