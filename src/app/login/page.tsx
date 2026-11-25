"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectToParam = searchParams.get("redirectTo") ?? "/admin";
  const safeRedirectTo =
    redirectToParam.startsWith("/") && !redirectToParam.startsWith("//")
      ? redirectToParam
      : "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      window.location.assign(safeRedirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl">
      <div className="mb-8">
        <Link href="/" className="font-display text-2xl tracking-wide text-[var(--foreground)]">
          RAFI<span className="text-[var(--primary)]">THUB</span>
        </Link>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Staff &amp; Admin Sign In</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Sign in with your Neon Auth staff credentials to manage Rafithub.
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@rafithub.com"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
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
            placeholder="••••••••••••"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-sm disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 border-t border-[var(--border)] pt-5 text-xs text-[var(--muted-foreground)] space-y-2">
        <p>
          Protected by Neon Auth. Only active staff accounts listed in the Rafithub staff directory
          can access the admin console.
        </p>
        <p>
          <Link href="/" className="text-[var(--primary)] hover:underline">
            Return to Rafithub website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-sm text-[var(--muted-foreground)]">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
