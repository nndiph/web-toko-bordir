"use client";

import { useState } from "react";
import { Shield, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ErrorBanner } from "@/components/StatusBanner";

interface AdminLoginProps {
  /** Pesan tambahan, mis. akun yang login bukan admin. */
  notice?: string;
  onSuccess: () => void;
}

export function AdminLogin({ notice, onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);

    if (signInError) {
      setError("Email atau kata sandi salah.");
      return;
    }
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-army text-white flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Panel Pemilik Toko</h1>
            <p className="text-xs text-gray-500">Masuk dengan akun admin Gaperta</p>
          </div>
        </div>

        {notice && <ErrorBanner message={notice} />}
        {error && <ErrorBanner message={error} />}

        <div className="space-y-1.5">
          <label htmlFor="admin-email" className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-gray-900 shadow-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="admin-password" className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
            Kata Sandi
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-gray-900 shadow-xs"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-army hover:bg-army-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{isSubmitting ? "Memeriksa..." : "Masuk"}</span>
        </button>
      </form>
    </div>
  );
}
