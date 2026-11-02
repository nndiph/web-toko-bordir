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
  ArrowUpRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DemoBanner, ErrorBanner } from "@/components/StatusBanner";
import { trackOrder } from "@/lib/data/orders";
import { isSupabaseConfigured } from "@/lib/supabase";
import { formatOrderDate } from "@/lib/utils";
import type { OrderType, TrackedOrder } from "@/types";

const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  PANGKAT: "BADGE PANGKAT TIMBUL",
  NAMA_DADA: "NAMA DADA BORDIR",
  LOKASI: "BADGE LOKASI / SATUAN",
  EMBLEM: "EMBLEM / LOGO KESATUAN",
  LAINNYA: "LAINNYA (CUSTOM KHUSUS)",
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
      setError("Masukkan nomor tiket lengkap dan tepat 4 digit terakhir nomor WhatsApp pemesan.");
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const response = await trackOrder(normalizedTicket, normalizedWa);
      setResult(response.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memverifikasi status tiket.");
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
    <div className="space-y-8 font-mono text-xs">
      {!isSupabaseConfigured && <DemoBanner />}

      {/* Terminal Query Box */}
      <div className="border border-console-rule bg-console-surface p-6 sm:p-10 space-y-6">
        <div className="border-b border-console-rule pb-4 flex items-center justify-between">
          <span className="text-console-gold uppercase">QUERY TERMINAL // 03 // STATUS MESIN BORDIR</span>
          <span className="text-console-textMuted">REAL-TIME INVENTORY READOUT</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-console-textPrimary uppercase tracking-tight">
            PELACAKAN TIKET PESANAN
          </h1>
          <p className="text-console-textSecondary max-w-xl">
            Masukkan Nomor Tiket Pesanan (contoh: <span className="text-console-gold">GPT-20261101-042</span>) dan 4
            digit terakhir nomor WhatsApp yang terdaftar.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(ticket, waLast4);
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2"
        >
          <div className="sm:col-span-6 space-y-2">
            <label className="block text-[11px] text-console-textSecondary uppercase tracking-wider">
              NOMOR TIKET PESANAN
            </label>
            <input
              type="text"
              required
              placeholder="GPT-20261101-042"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              className="w-full bg-console-ground border border-console-rule focus:border-console-gold p-3 text-xs text-console-textPrimary placeholder:text-console-textMuted focus:outline-none uppercase tracking-wider"
            />
          </div>

          <div className="sm:col-span-3 space-y-2">
            <label className="block text-[11px] text-console-textSecondary uppercase tracking-wider">
              4 DIGIT AKHIR WA
            </label>
            <input
              type="text"
              maxLength={4}
              required
              placeholder="7890"
              value={waLast4}
              onChange={(e) => setWaLast4(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-console-ground border border-console-rule focus:border-console-gold p-3 text-xs text-console-textPrimary placeholder:text-console-textMuted focus:outline-none text-center font-bold"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-console-gold hover:bg-console-goldDark text-black font-heading font-bold text-sm tracking-wider uppercase py-3 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? "MEMERIKSA..." : "VERIFIKASI TIKET"}</span>
            </button>
          </div>
        </form>

        {!isSupabaseConfigured && (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-console-textMuted">
            <span className="text-console-gold uppercase">TIKET DEMO:</span>
            {DEMO_EXAMPLES.map((ex) => (
              <button
                key={ex.ticket}
                type="button"
                onClick={() => {
                  setTicket(ex.ticket);
                  setWaLast4(ex.wa);
                  runSearch(ex.ticket, ex.wa);
                }}
                className="border border-console-rule hover:border-console-gold text-console-textSecondary hover:text-white px-2 py-1 transition-colors"
              >
                {ex.ticket} ({ex.wa})
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Result Display */}
      {searched && !isSearching && result && (
        <div className="border border-console-rule bg-console-surface p-6 sm:p-10 space-y-8">
          <div className="border-b border-console-rule pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-console-gold block text-[11px] uppercase tracking-wider">
                TIKET RESMI: {result.orderNumber}
              </span>
              <h2 className="font-heading font-bold text-2xl text-console-textPrimary mt-0.5">
                {result.customerName} {result.customerRank ? `(${result.customerRank})` : ""}
              </h2>
              <span className="text-[11px] text-console-textMuted">
                TANGGAL ENTRY: {formatOrderDate(result.createdAt)}
              </span>
            </div>

            <div>
              {result.status === "PENDING" && (
                <span className="inline-flex items-center gap-2 border border-console-gold text-console-gold px-3 py-1.5 uppercase font-bold text-xs">
                  <Clock className="w-4 h-4" />
                  ANTRE DI MESIN
                </span>
              )}
              {result.status === "IN_PROGRESS" && (
                <span className="inline-flex items-center gap-2 border border-console-green text-console-green px-3 py-1.5 uppercase font-bold text-xs">
                  <Layers className="w-4 h-4 animate-pulse" />
                  PROSES BORDIR AKTIF
                </span>
              )}
              {result.status === "READY" && (
                <span className="inline-flex items-center gap-2 bg-console-green text-black px-3 py-1.5 uppercase font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  SELESAI — SIAP DIAMBIL
                </span>
              )}
              {result.status === "COMPLETED" && (
                <span className="inline-flex items-center gap-2 border border-console-rule text-console-textMuted px-3 py-1.5 uppercase font-bold text-xs">
                  <PackageCheck className="w-4 h-4" />
                  SUDAH DIAMBIL
                </span>
              )}
            </div>
          </div>

          {/* Linear Progress Stepper */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`border p-4 transition-colors ${
                stageStatus === "PENDING" || stageStatus === "IN_PROGRESS" || stageStatus === "READY"
                  ? "border-console-gold bg-console-elevated"
                  : "border-console-rule bg-console-ground opacity-40"
              }`}
            >
              <div className="text-console-gold font-bold">01 // ANTREAN MESIN</div>
              <div className="text-console-textMuted text-[11px] mt-1">Pesanan dalam antrean digital</div>
            </div>

            <div
              className={`border p-4 transition-colors ${
                stageStatus === "IN_PROGRESS" || stageStatus === "READY"
                  ? "border-console-gold bg-console-elevated"
                  : "border-console-rule bg-console-ground opacity-40"
              }`}
            >
              <div className="text-console-gold font-bold">02 // PROSES BORDIR</div>
              <div className="text-console-textMuted text-[11px] mt-1">Pengerjaan bordir timbul aktif</div>
            </div>

            <div
              className={`border p-4 transition-colors ${
                stageStatus === "READY"
                  ? "border-console-green bg-console-elevated"
                  : "border-console-rule bg-console-ground opacity-40"
              }`}
            >
              <div className={stageStatus === "READY" ? "text-console-green font-bold" : "text-console-textMuted"}>
                03 // SIAP DIAMBIL
              </div>
              <div className="text-console-textMuted text-[11px] mt-1">Tersedia di Toko Jl. Gaperta</div>
            </div>
          </div>

          {/* Specification Sheet */}
          <div className="border border-console-rule bg-console-ground p-5 space-y-4">
            <div className="border-b border-console-rule pb-2 text-[11px] text-console-gold uppercase">
              DATA SPESIFIKASI PESANAN
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-console-textMuted block text-[10px]">JENIS BORDIR:</span>
                <span className="text-console-textPrimary font-semibold">{ORDER_TYPE_LABEL[result.orderType]}</span>
              </div>
              <div>
                <span className="text-console-textMuted block text-[10px]">JUMLAH:</span>
                <span className="text-console-textPrimary font-semibold">{result.quantity} SET/PCS</span>
              </div>
              <div>
                <span className="text-console-textMuted block text-[10px]">STATUS OPERASIONAL:</span>
                <span className="text-console-gold font-semibold">{result.estimatedDone || "DALAM ANTREAN"}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-console-rule">
              <span className="text-console-textMuted block text-[10px]">CATATAN / TEKS BORDIR:</span>
              <p className="text-console-textPrimary font-medium mt-1 uppercase">{result.notes}</p>
            </div>
          </div>

          {/* Action Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-console-textMuted text-[11px]">
              Toko Buka: Senin – Sabtu // 08:00 – 20:00 WIB (Jl. Gaperta No. 12 Medan)
            </span>
            <a
              href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20saya%20ingin%20tanya%20progres%20tiket%20${result.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-console-rule hover:border-console-gold text-console-textPrimary px-4 py-2 transition-colors uppercase tracking-wider"
            >
              <Phone className="w-3.5 h-3.5 text-console-green" />
              <span>HUBUNGI KASIR VIA WA</span>
              <ArrowUpRight className="w-3 h-3 text-console-gold" />
            </a>
          </div>
        </div>
      )}

      {searched && !isSearching && !result && !error && (
        <div className="border border-console-rule bg-console-surface p-12 text-center space-y-2">
          <div className="text-console-gold font-bold uppercase">TIKET TIDAK DITEMUKAN</div>
          <div className="text-console-textMuted">
            Tidak ada rekaman pesanan dengan nomor tiket &quot;{searchedTicket}&quot; dan 4 digit WA tersebut.
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-console-ground text-console-textPrimary flex flex-col font-body">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={<div className="font-mono text-xs text-console-textSecondary">MEMUAT TERMINAL...</div>}>
          <TrackingContent />
        </Suspense>
      </main>
    </div>
  );
}
