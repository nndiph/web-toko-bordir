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
          setError("Gagal terhubung ke server database (offline atau connection refused). Periksa server Supabase Anda.");
        } else {
          setError("Email atau kata sandi salah.");
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
    <div className="min-h-screen bg-tactical-950 text-gray-100 flex items-center justify-center px-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-tactical-900 border border-tactical-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5 border-b border-tactical-800 pb-5">
          <div className="w-11 h-11 rounded-xl bg-tactical-850 border border-tactical-600/70 text-gold flex items-center justify-center shrink-0 shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-black uppercase tracking-wider text-white">Panel Pemilik Toko</h1>
            <p className="text-[11px] text-gray-400">Masuk dengan akun admin Gaperta</p>
          </div>
        </div>

        {notice && <ErrorBanner message={notice} />}
        {error && <ErrorBanner message={error} />}

        <div className="space-y-1.5">
          <label htmlFor="admin-email" className="block text-xs font-black uppercase tracking-wider text-gray-300">
            Email Admin
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-tactical-950 border border-tactical-700 focus:border-gold px-3.5 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/20 shadow-inner"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="admin-password" className="block text-xs font-black uppercase tracking-wider text-gray-300">
            Kata Sandi
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-tactical-950 border border-tactical-700 focus:border-gold px-3.5 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/20 shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-gold-dark via-gold to-amber-500 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm transition-all shadow-lg shadow-amber-950/40 uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{isSubmitting ? "Memeriksa..." : "Masuk Dashboard"}</span>
        </button>
      </form>
    </div>
  );
}