"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  PackageCheck,
  Phone,
  Layers,
  ArrowRight,
  AlertCircle,
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

      {/* Box Pencarian Tiket Cerah */}
      <div className="bg-white border border-slate-border rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-brand text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
            <Search className="w-3.5 h-3.5" />
            <span>Pelacakan Antrean Digital</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-ink tracking-tight">
            Lacak Status &amp; Antrean Bordir
          </h1>
          <p className="text-sm text-slate-muted">
            Ketikkan Nomor Tiket Pesanan (contoh: <code className="text-brand font-bold">GPT-20261101-042</code>) dan 4
            digit terakhir nomor WhatsApp pemesan.
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
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nomor Tiket Pesanan
            </label>
            <input
              type="text"
              required
              placeholder="GPT-20261101-042"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              className="w-full bg-slate-50 border border-slate-border focus:border-brand focus:bg-white px-4 py-3 rounded-xl text-sm text-slate-ink placeholder:text-slate-400 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-brand/10 uppercase"
            />
          </div>

          <div className="sm:col-span-3 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              4 Digit Akhir WA
            </label>
            <input
              type="text"
              maxLength={4}
              required
              placeholder="7890"
              value={waLast4}
              onChange={(e) => setWaLast4(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-slate-50 border border-slate-border focus:border-brand focus:bg-white px-4 py-3 rounded-xl text-sm text-slate-ink placeholder:text-slate-400 font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-brand/10 font-bold"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? "Mencari..." : "Lacak Tiket"}</span>
            </button>
          </div>
        </form>

        {!isSupabaseConfigured && (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-slate-700">Contoh Tiket Demo:</span>
            {DEMO_EXAMPLES.map((ex) => (
              <button
                key={ex.ticket}
                type="button"
                onClick={() => {
                  setTicket(ex.ticket);
                  setWaLast4(ex.wa);
                  runSearch(ex.ticket, ex.wa);
                }}
                className="bg-slate-50 border border-slate-200 hover:border-brand text-slate-700 hover:text-brand px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors"
              >
                {ex.ticket} ({ex.wa})
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Hasil Pelacakan Tiket Cerah */}
      {searched && !isSearching && result && (
        <div className="bg-white border border-slate-border rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-gold block">
                Nomor Tiket: {result.orderNumber}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-ink mt-0.5">
                {result.customerName} {result.customerRank ? `(${result.customerRank})` : ""}
              </h2>
              <span className="text-xs text-slate-400">
                Didaftarkan: {formatOrderDate(result.createdAt)}
              </span>
            </div>

            <div>
              {result.status === "PENDING" && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-4 py-2 rounded-xl">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Antre di Mesin
                </span>
              )}
              {result.status === "IN_PROGRESS" && (
                <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold px-4 py-2 rounded-xl">
                  <Layers className="w-4 h-4 text-sky-600 animate-pulse" />
                  Sedang Dibordir
                </span>
              )}
              {result.status === "READY" && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-4 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Selesai — Siap Diambil
                </span>
              )}
              {result.status === "COMPLETED" && (
                <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl">
                  <PackageCheck className="w-4 h-4 text-slate-500" />
                  Sudah Diambil
                </span>
              )}
            </div>
          </div>

          {/* Stepper Timeline 3 Tahap */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div
              className={`p-4 rounded-2xl border transition-all ${
                stageStatus === "PENDING" || stageStatus === "IN_PROGRESS" || stageStatus === "READY"
                  ? "bg-slate-50 border-slate-300 text-slate-ink font-semibold"
                  : "bg-white border-slate-border text-slate-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-brand shadow-2xs">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-sm">Antre di Mesin</h3>
                  <p className="text-[11px] text-slate-500 font-normal">Pesanan terdaftar di sistem</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all ${
                stageStatus === "IN_PROGRESS" || stageStatus === "READY"
                  ? "bg-slate-50 border-slate-300 text-slate-ink font-semibold"
                  : "bg-white border-slate-border text-slate-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-brand shadow-2xs">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-sm">Proses Bordir</h3>
                  <p className="text-[11px] text-slate-500 font-normal">Pengerjaan mesin otomatis</p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all ${
                stageStatus === "READY"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold"
                  : "bg-white border-slate-border text-slate-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-sm text-emerald-800">Siap Diambil</h3>
                  <p className="text-[11px] text-slate-500 font-normal">Tersedia di Toko Medan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rincian Pesanan */}
          <div className="bg-slate-50 border border-slate-border rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rincian Spesifikasi Bordir
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Jenis Bordir</span>
                <span className="font-bold text-slate-ink">{ORDER_TYPE_LABEL[result.orderType]}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Jumlah</span>
                <span className="font-bold text-slate-ink">{result.quantity} Pcs/Set</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status Terkini</span>
                <span className="font-bold text-brand">{result.estimatedDone || "Dalam antrean"}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block text-xs">Catatan / Teks Pesanan:</span>
              <p className="font-medium text-slate-ink text-xs mt-0.5">{result.notes}</p>
            </div>
          </div>

          {/* Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-slate-500">
              Ada pertanyaan? Hubungi kasir toko langsung via WhatsApp.
            </span>
            <a
              href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20saya%20ingin%20tanya%20progres%20tiket%20${result.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-border text-slate-ink text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand" />
              <span>Tanya Kasir via WA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {searched && !isSearching && !result && !error && (
        <div className="bg-white border border-slate-border rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-ink">Tiket Tidak Ditemukan</h3>
          <p className="text-xs text-slate-muted max-w-sm mx-auto">
            Tidak ditemukan pesanan dengan nomor tiket &quot;{searchedTicket}&quot; dan 4 digit WA yang sesuai.
          </p>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-slate-canvas text-slate-ink flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={<div className="text-center py-12 text-slate-400 text-sm">Memuat pelacakan...</div>}>
          <TrackingContent />
        </Suspense>
      </main>
    </div>
  );
}
