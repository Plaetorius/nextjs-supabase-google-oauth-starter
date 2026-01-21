import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-b-foreground/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 text-sm">
          <Link href="/" className="font-semibold hover:underline">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <Suspense>
              <AuthButton />
            </Suspense>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="w-full border-t py-8 text-center text-xs text-muted-foreground">
        <p>
          Built with{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            className="font-semibold hover:underline"
            rel="noreferrer"
          >
            Next.js
          </a>
          {" "}and{" "}
          <a
            href="https://supabase.com"
            target="_blank"
            className="font-semibold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}
