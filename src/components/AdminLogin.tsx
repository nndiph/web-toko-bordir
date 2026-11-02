"use client";

import { useState } from "react";
import { Shield, LogIn } from "lucide-react";
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
          setError("Gagal terhubung ke server database (offline atau connection refused).");
        } else {
          setError("Email atau kata sandi tidak cocok.");
        }
        return;
      }
      onSuccess();
    } catch {
      setIsSubmitting(false);
      setError("Gagal menghubungi server database. Periksa koneksi jaringan Anda.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-canvas text-slate-ink flex items-center justify-center px-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-slate-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-5"
      >
        <div className="flex items-center gap-3.5 border-b border-slate-border pb-5">
          <div className="w-11 h-11 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-xs">
            <Shield className="w-6 h-6 text-accent-gold" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-ink">Panel Pemilik Toko</h1>
            <p className="text-xs text-slate-muted">Masuk dengan akun admin Gaperta</p>
          </div>
        </div>

        {notice && <ErrorBanner message={notice} />}
        {error && <ErrorBanner message={error} />}

        <div className="space-y-1.5 text-xs">
          <label htmlFor="admin-email" className="block font-bold text-slate-700 uppercase tracking-wider">
            Email Admin
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-border focus:border-brand focus:bg-white px-3.5 py-2.5 rounded-xl text-sm text-slate-ink focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all"
          />
        </div>

        <div className="space-y-1.5 text-xs">
          <label htmlFor="admin-password" className="block font-bold text-slate-700 uppercase tracking-wider">
            Kata Sandi
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-border focus:border-brand focus:bg-white px-3.5 py-2.5 rounded-xl text-sm text-slate-ink focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand hover:bg-brand-hover active:scale-[0.98] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{isSubmitting ? "Memeriksa..." : "Masuk Dashboard"}</span>
        </button>
      </form>
    </div>
  );
}
