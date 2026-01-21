# Next.js + Supabase Google OAuth Starter

A clean, minimal starter template for Next.js 16 with Supabase Google OAuth
authentication. This template solves the tricky cookie handling issues with
Next.js 16 + Turbopack and Supabase SSR.

## Features

- ✅ **Google OAuth** - One-click sign-in with Google
- ✅ **Next.js 16** - Latest App Router with Server Components
- ✅ **Supabase Auth** - Secure authentication with Supabase
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Modern, responsive UI
- ✅ **Local Development** - Works with Supabase local instance

## Quick Start

> **📚 Official Documentation**
>
> - [Supabase Local Development Guide](https://supabase.com/docs/guides/local-development?queryGroups=package-manager&package-manager=pnpm)
> - [Google OAuth Setup Guide](https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=server&queryGroups=platform&platform=web)

This guide covers **local development** setup. For production deployment, see
the [Deployment](#deployment) section below.

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd nextjs-supabase-google-oauth-starter
pnpm install
```

### 2. Set up Supabase locally

> **🔧 Local Development Only**\
> This step uses
> [Supabase CLI](https://supabase.com/docs/guides/local-development) to run a
> local Supabase instance on your machine.\
> For production, skip to [Deployment → Supabase Cloud](#supabase-cloud).

Install the Supabase CLI:

```bash
brew install supabase/tap/supabase
```

Start Supabase:

```bash
supabase start
```

This will output your local Supabase credentials. You'll need:

- `API URL` (usually `http://127.0.0.1:54321`)
- `anon key`

### 3. Set up Google OAuth

> **🌍 For Both Local & Production**\
> Google OAuth credentials work for both environments. You'll configure
> different redirect URIs for each.

#### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** user type
   - Fill in app name, user support email, and developer contact
   - Add the required scopes (see below)
   - Add test users if needed during development
5. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
6. Set **Application type** to **Web application**

#### Local Development URIs

7. Configure **Authorized JavaScript origins**
   ([console.cloud.google.com/auth/clients](https://console.cloud.google.com/auth/clients)):
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   ```
8. Configure **Authorized redirect URIs**:
   ```
   http://localhost:54321/auth/v1/callback
   http://127.0.0.1:54321/auth/v1/callback
   ```
   ⚠️ **Important**: These URIs point to your **Supabase Auth server** (port
   54321), not your Next.js app (port 3000)

#### Production URIs (Add these when deploying)

When you deploy to production, **add** these URIs to the same OAuth client:

**Authorized JavaScript origins:**

```
https://yourdomain.com
```

**Authorized redirect URIs:**

```
https://your-project-ref.supabase.co/auth/v1/callback
```

(Get this URL from your Supabase project dashboard → Authentication → Providers
→ Google)

#### Configure OAuth Scopes

9. Configure **OAuth Scopes**
   ([console.cloud.google.com/auth/scopes](https://console.cloud.google.com/auth/scopes)):
   - `.../auth/userinfo.email` - See your primary Google Account email address
   - `.../auth/userinfo.profile` - See your personal info, including any
     personal info you've made publicly available
   - `openid` - Associate you with your personal info on Google

10. Save and copy your **Client ID** and **Client Secret**

#### Configure Supabase (Local)

> **🔧 Local Development Only**\
> For production, you'll configure this in the Supabase Dashboard instead.

Edit `supabase/config.toml`:

```toml
[auth]
site_url = "http://127.0.0.1:3000"
additional_redirect_urls = [
  "http://127.0.0.1:3000/auth/callback",
  "http://localhost:3000/auth/callback"
]

[auth.external.google]
enabled = true
client_id = "YOUR_GOOGLE_CLIENT_ID"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET)"
skip_nonce_check = false
```

### 4. Create environment files

> **🔧 Local Development Only**\
> For production, you'll set these as environment variables in Vercel/your
> hosting platform.

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

Create `supabase/.env` (for Supabase local):

```bash
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 5. Restart Supabase and run Next.js

```bash
# Restart Supabase to pick up the new config
supabase stop
supabase start

# Run Next.js dev server on 127.0.0.1
pnpm dev --hostname 127.0.0.1
```

### 6. Open your browser

Navigate to `http://127.0.0.1:3000` and click **Continue with Google**!

## Important Notes

### Why 127.0.0.1 instead of localhost?

Browsers treat `localhost` and `127.0.0.1` as different origins. This causes
cookie mismatches during OAuth. Always use `127.0.0.1:3000` for local
development.

### Next.js 16 + Turbopack Cookie Handling

This starter includes a custom solution for handling Supabase session cookies in
Next.js 16 Route Handlers. The standard `@supabase/ssr` cookie handling doesn't
work correctly with Next.js 16 + Turbopack due to timing issues where the
`setAll` callback executes after the response is sent.

Our solution (`app/auth/callback/route.ts`) manually serializes the session and
sets cookies on the response object before returning it.

## Project Structure

```
├── app/
│   ├── auth/
│   │   ├── action.ts          # Server actions for sign in/out
│   │   ├── callback/
│   │   │   └── route.ts       # OAuth callback handler (custom cookie logic)
│   │   └── error/
│   │       └── page.tsx       # Auth error page
│   ├── protected/
│   │   ├── layout.tsx         # Protected route layout
│   │   └── page.tsx           # Example protected page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page with Google sign-in
├── components/
│   ├── auth-button.tsx        # User info + sign out button
│   ├── theme-switcher.tsx     # Dark/light mode toggle
│   └── ui/                    # shadcn/ui components
├── lib/
│   └── supabase/
│       ├── client.ts          # Browser Supabase client
│       ├── server.ts          # Server Supabase client
│       └── proxy.ts           # Middleware session refresh
├── proxy.ts                   # Next.js 16 middleware (renamed from middleware.ts)
└── supabase/
    └── config.toml            # Supabase local configuration
```

## Customization

### Change redirect after sign-in

Edit `app/auth/action.ts`:

```typescript
export const signInWithGoogle = async () => {
  // ...
  const redirectUrl = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:3000/auth/callback" // Change this
    : "https://your-production-domain.com/auth/callback";
  // ...
};
```

### Protect additional routes

The middleware (`proxy.ts`) automatically protects all routes except `/`,
`/auth/*`. To protect more routes, edit `lib/supabase/proxy.ts`:

```typescript
if (
  request.nextUrl.pathname !== "/" &&
  !user &&
  !request.nextUrl.pathname.startsWith("/login") &&
  !request.nextUrl.pathname.startsWith("/auth") &&
  !request.nextUrl.pathname.startsWith("/public") // Add exclusions
) {
  // Redirect to login
}
```

## Deployment

### Environment Differences

| Configuration             | Local Development                   | Production                                     |
| ------------------------- | ----------------------------------- | ---------------------------------------------- |
| **Supabase**              | Local CLI (`supabase start`)        | [Supabase Cloud](https://supabase.com) project |
| **Database**              | Local Docker container              | Managed PostgreSQL                             |
| **Auth Config**           | `supabase/config.toml`              | Supabase Dashboard                             |
| **Environment Variables** | `.env.local` file                   | Vercel/hosting platform settings               |
| **Google OAuth URIs**     | `localhost:3000`, `127.0.0.1:54321` | Your domain + Supabase project URL             |

### Vercel

> **📚 See also**:
> [Supabase + Vercel Deployment Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel project settings:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_production_anon_key
   ```
4. Update `app/auth/action.ts` to use your production domain:
   ```typescript
   const redirectUrl = process.env.NODE_ENV === "development"
     ? "http://127.0.0.1:3000/auth/callback"
     : "https://yourdomain.com/auth/callback"; // Your production domain
   ```
5. Update Google OAuth redirect URIs to include:
   - **Authorized JavaScript origins**: `https://yourdomain.com`
   - **Authorized redirect URIs**:
     `https://your-project-ref.supabase.co/auth/v1/callback`
6. Deploy!

### Supabase Cloud

For production, use [Supabase Cloud](https://supabase.com) instead of the local
CLI:

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Authentication** → **Providers** → **Google**
3. Enable Google provider and add your Google OAuth credentials:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
4. Copy your production credentials:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **Anon/Public Key**
5. Use these credentials in your production environment variables (Vercel, etc.)

## Troubleshooting

### Cookies not persisting

- Make sure you're accessing the app via `http://127.0.0.1:3000`, not
  `localhost:3000`
- Clear all cookies for both `127.0.0.1:3000` and `localhost:3000`
- Restart both Supabase and the Next.js dev server

### Google OAuth redirect error

- Verify the redirect URIs in Google Cloud Console match exactly:
  - `http://127.0.0.1:54321/auth/v1/callback` (for Supabase Auth)
  - NOT your app's callback route
- Check that `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` is set in
  `supabase/.env`

### Session not found after sign-in

This means the OAuth callback route isn't setting cookies correctly. Make sure:

- You're using the custom callback handler in `app/auth/callback/route.ts`
- The dev server is running with `--hostname 127.0.0.1`
- You've restarted the dev server after making changes

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SSR Package](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

## License

MIT
