"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  PackageCheck,
  AlertCircle,
  Phone,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DemoBanner, ErrorBanner } from "@/components/StatusBanner";
import { trackOrder } from "@/lib/data/orders";
import { isSupabaseConfigured } from "@/lib/supabase";
import { formatOrderDate } from "@/lib/utils";
import type { OrderType, TrackedOrder } from "@/types";

const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  PANGKAT: "Badge Pangkat Timbul",
  NAMA_DADA: "Nama Dada Bordir",
  LOKASI: "Badge Lokasi / Satuan",
  EMBLEM: "Emblem / Logo Satuan",
  LAINNYA: "Lainnya (Custom Khusus)",
};

const DEMO_EXAMPLES = [
  { ticket: "GPT-20261101-042", wa: "7890" },
  { ticket: "GPT-20261101-038", wa: "5432" },
  { ticket: "GPT-20261101-045", wa: "3344" },
];

function TrackingContent() {
  const searchParams = useSearchParams();
  const ticketParam = searchParams.get("ticket") || "";
  const waParam = searchParams.get("wa") || "";

  const [ticket, setTicket] = useState(ticketParam);
  const [waLast4, setWaLast4] = useState(waParam);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedTicket, setSearchedTicket] = useState("");
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stageStatus = result?.status === "COMPLETED" ? "READY" : result?.status;

  const runSearch = useCallback(async (ticketToSearch: string, waToSearch: string) => {
    const normalizedTicket = ticketToSearch.trim().toUpperCase();
    const normalizedWa = waToSearch.replace(/\D/g, "");

    setSearched(true);
    setSearchedTicket(normalizedTicket);
    setResult(null);

    if (!normalizedTicket || normalizedWa.length !== 4) {
      setError("Isi nomor tiket dan tepat 4 digit terakhir nomor WhatsApp yang Anda daftarkan.");
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const response = await trackOrder(normalizedTicket, normalizedWa);
      setResult(response.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal melacak pesanan. Coba lagi.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (ticketParam && waParam) {
      runSearch(ticketParam, waParam);
    }
  }, [ticketParam, waParam, runSearch]);

  return (
    <div className="space-y-8 font-sans">
      {!isSupabaseConfigured && <DemoBanner />}

      {/* Box Pencarian Tiket Taktis */}
      <div className="bg-tactical-900 border border-tactical-700 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-tactical-850 border border-tactical-700 text-gold text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
            <Search className="w-3.5 h-3.5" />
            <span>Pelacakan Antrean Digital</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Lacak Status & Antrean Bordir
          </h1>
          <p className="text-sm text-gray-300">
            Ketikkan Nomor Tiket Pesanan (contoh: <code className="text-gold font-mono">GPT-20261101-042</code>) dan 4 digit terakhir Nomor WhatsApp pemesan.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(ticket, waLast4);
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-4"
        >
          <div className="sm:col-span-6 space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-gray-300">
              Nomor Tiket Pesanan
            </label>
            <input
              type="text"
              required
              placeholder="GPT-20261101-042"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              className="w-full bg-tactical-950 border border-tactical-700 focus:border-gold px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-500 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>

          <div className="sm:col-span-3 space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-gray-300">
              4 Digit Terakhir WA
            </label>
            <input
              type="text"
              maxLength={4}
              required
              placeholder="7890"
              value={waLast4}
              onChange={(e) => setWaLast4(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-tactical-950 border border-tactical-700 focus:border-gold px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-500 font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-gold/20 font-bold"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-gradient-to-r from-gold-dark via-gold to-amber-500 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 text-white font-black py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-950/40 uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? "Mencari..." : "Lacak Tiket"}</span>
            </button>
          </div>
        </form>

        {!isSupabaseConfigured && (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <span className="font-bold text-gold uppercase tracking-wider">Tiket Demo:</span>
            {DEMO_EXAMPLES.map((ex) => (
              <button
                key={ex.ticket}
                type="button"
                onClick={() => {
                  setTicket(ex.ticket);
                  setWaLast4(ex.wa);
                  runSearch(ex.ticket, ex.wa);
                }}
                className="bg-tactical-850 border border-tactical-700 hover:border-gold text-gray-300 hover:text-white px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors"
              >
                {ex.ticket} ({ex.wa})
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Hasil Pelacakan Tiket */}
      {searched && !isSearching && result && (
        <div className="bg-tactical-900 border border-tactical-700 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Status Badge & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tactical-850 pb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-gold block">
                Tiket: {result.orderNumber}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {result.customerName} {result.customerRank ? `(${result.customerRank})` : ""}
              </h2>
              <span className="text-xs text-gray-400">
                Didaftarkan: {formatOrderDate(result.createdAt)}
              </span>
            </div>

            <div>
              {result.status === "PENDING" && (
                <span className="inline-flex items-center gap-1.5 bg-amber-950/90 text-amber-300 border border-amber-600/50 text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Antre di Mesin
                </span>
              )}
              {result.status === "IN_PROGRESS" && (
                <span className="inline-flex items-center gap-1.5 bg-sky-950/90 text-sky-300 border border-sky-500/50 text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-sky-400 animate-pulse" />
                  Sedang Dibordir
                </span>
              )}
              {result.status === "READY" && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Selesai — Siap Diambil
                </span>
              )}
              {result.status === "COMPLETED" && (
                <span className="inline-flex items-center gap-1.5 bg-tactical-800 text-gray-300 border border-tactical-600 text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider">
                  <PackageCheck className="w-4 h-4 text-gray-400" />
                  Sudah Diambil
                </span>
              )}
            </div>
          </div>

          {/* Stepper Timeline 3 Tahap Taktis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Step 1 */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                stageStatus === "PENDING" || stageStatus === "IN_PROGRESS" || stageStatus === "READY"
                  ? "bg-tactical-850 border-tactical-700 text-white"
                  : "bg-tactical-950/50 border-tactical-850 text-gray-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-tactical-800 border border-tactical-700 flex items-center justify-center text-xs font-black text-gold">
                  1
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Antre di Mesin</h3>
                  <p className="text-[11px] text-gray-400">Pesanan diverifikasi toko</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                stageStatus === "IN_PROGRESS" || stageStatus === "READY"
                  ? "bg-tactical-850 border-tactical-700 text-white"
                  : "bg-tactical-950/50 border-tactical-850 text-gray-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-tactical-800 border border-tactical-700 flex items-center justify-center text-xs font-black text-gold">
                  2
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Proses Bordir</h3>
                  <p className="text-[11px] text-gray-400">Pengerjaan mesin komputer</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                stageStatus === "READY"
                  ? "bg-emerald-950/40 border-emerald-600/40 text-emerald-200"
                  : "bg-tactical-950/50 border-tactical-850 text-gray-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-xs font-black text-emerald-400">
                  3
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-emerald-300">Siap Diambil</h3>
                  <p className="text-[11px] text-gray-400">Tersedia di Toko Medan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rincian Pesanan */}
          <div className="bg-tactical-950 border border-tactical-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
              Rincian Spesifikasi Bordir
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-500 block">Jenis Bordir</span>
                <span className="font-bold text-white">{ORDER_TYPE_LABEL[result.orderType]}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Jumlah</span>
                <span className="font-bold text-white">{result.quantity} Pcs/Set</span>
              </div>
              <div>
                <span className="text-gray-500 block">Status Terkini</span>
                <span className="font-bold text-gold">{result.estimatedDone || "Dalam antrean"}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-tactical-850">
              <span className="text-gray-500 block text-xs">Teks / Catatan Pesanan:</span>
              <p className="font-medium text-white text-xs mt-0.5">{result.notes}</p>
            </div>
          </div>

          {/* Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-gray-400">
              Pertanyaan mengenai pesanan? Hubungi kasir toko via WhatsApp.
            </div>
            <a
              href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20saya%20ingin%20tanya%20progres%20tiket%20${result.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-tactical-800 hover:bg-tactical-700 border border-tactical-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tanya Kasir via WA</span>
            </a>
          </div>
        </div>
      )}

      {searched && !isSearching && !result && !error && (
        <div className="bg-tactical-900 border border-tactical-700 rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-tactical-800 border border-tactical-700 rounded-full flex items-center justify-center mx-auto text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white">Tiket Tidak Ditemukan</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Tidak ditemukan pesanan dengan nomor tiket &quot;{searchedTicket}&quot; dan 4 digit WA yang sesuai. Periksa kembali tiket atau hubungi kasir.
          </p>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-tactical-950 text-gray-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Suspense fallback={<div className="text-center py-12 text-gray-400 text-sm">Memuat halaman pelacakan...</div>}>
          <TrackingContent />
        </Suspense>
      </main>
    </div>
  );
}