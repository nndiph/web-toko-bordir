"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { supabase, isNetworkError } from "@/lib/supabase";
import { ErrorBanner } from "@/components/StatusBanner";

interface AdminLoginProps {
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

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      setIsSubmitting(false);

      if (signInError) {
        if (isNetworkError(signInError) || signInError.status === 0) {
          setError("Gagal terhubung ke database server (offline / connection refused). Periksa server Supabase.");
        } else {
          setError("Kredensial admin tidak cocok.");
        }
        return;
      }
      onSuccess();
    } catch {
      setIsSubmitting(false);
      setError("Gagal menghubungi server database. Periksa koneksi jaringan.");
    }
  };

  return (
    <div className="min-h-screen bg-console-ground text-console-textPrimary flex items-center justify-center px-4 font-mono">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-console-rule bg-console-surface p-6 sm:p-8 space-y-6"
      >
        <div className="border-b border-console-rule pb-4">
          <div className="text-[10px] text-console-gold uppercase tracking-widest">
            AUTHENTICATION REQUIRED // 04
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-console-textPrimary uppercase tracking-tight mt-1">
            TERMINAL ADMIN
          </h1>
          <p className="text-[11px] text-console-textMuted mt-0.5">
            Masuk dengan kredensial pemilik Toko Gaperta.
          </p>
        </div>

        {notice && <ErrorBanner message={notice} />}
        {error && <ErrorBanner message={error} />}

        <div className="space-y-1.5 text-xs">
          <label htmlFor="admin-email" className="block text-console-textSecondary uppercase tracking-wider text-[11px]">
            IDENTIFIKASI EMAIL
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-console-ground border border-console-rule focus:border-console-gold p-3 text-xs text-console-textPrimary focus:outline-none"
          />
        </div>

        <div className="space-y-1.5 text-xs">
          <label htmlFor="admin-password" className="block text-console-textSecondary uppercase tracking-wider text-[11px]">
            KATA SANDI OTORISASI
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-console-ground border border-console-rule focus:border-console-gold p-3 text-xs text-console-textPrimary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-console-gold hover:bg-console-goldDark text-black font-heading font-bold text-sm tracking-wider uppercase py-3 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{isSubmitting ? "MEMERIKSA..." : "MASUK PANEL PEMILIK"}</span>
        </button>
      </form>
    </div>
  );
}
