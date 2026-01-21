import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  let next = requestUrl.searchParams.get('next') ?? '/protected'

  const origin = process.env.NODE_ENV === 'development'
    ? "http://localhost:3000"
    : requestUrl.origin

  if (!next.startsWith('/')) {
    next = '/'
  }

  if (code) {
    const cookieStore = await cookies()
    const response = NextResponse.redirect(`${origin}${next}`)
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, {
                ...options,
                path: options?.path || '/',
                sameSite: (options?.sameSite as 'lax' | 'strict' | 'none') || 'lax',
                httpOnly: options?.httpOnly || false,
                secure: options?.secure || false,
                maxAge: options?.maxAge || 60 * 60 * 24 * 7,
              })
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      // Manually serialize and set session cookies to work around Next.js 16 + Turbopack timing issue
      const sessionData = JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type,
        user: data.session.user,
      })
      
      const CHUNK_SIZE = 3180
      const chunks = Math.ceil(sessionData.length / CHUNK_SIZE)
      
      for (let i = 0; i < chunks; i++) {
        const chunk = sessionData.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
        const cookieName = chunks > 1 ? `sb-127-auth-token.${i}` : 'sb-127-auth-token'
        
        response.cookies.set(cookieName, chunk, {
          path: '/',
          sameSite: 'lax',
          httpOnly: false,
          secure: false,
          maxAge: 60 * 60 * 24 * 7,
        })
      }
      
      return response
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
