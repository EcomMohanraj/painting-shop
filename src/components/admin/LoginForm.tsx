"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, LogIn } from "lucide-react";

const messages: Record<string, string> = {
  CredentialsSignin: "Incorrect email or password.",
  TooManyAttempts: "Too many failed attempts. Please wait 15 minutes and try again.",
};

function errorMessage(code?: string | null) {
  if (!code) return null;
  return messages[code] ?? "Sign-in failed. Please try again.";
}

export function LoginForm({ callbackUrl, initialError }: { callbackUrl: string; initialError?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(errorMessage(initialError));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", { email, password, redirect: false, callbackUrl });

    if (!result || result.error) {
      setError(errorMessage(result?.error ?? "unknown"));
      setLoading(false);
      return;
    }
    router.replace(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-navy-900">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-navy-900">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          className="field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" disabled={loading} className="btn-navy w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <LogIn className="h-4 w-4" aria-hidden />}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
