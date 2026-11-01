"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  PackageCheck,
  AlertCircle,
  HelpCircle,
  Phone,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DemoBanner, ErrorBanner } from "@/components/StatusBanner";
import { trackOrder } from "@/lib/data/orders";
import { isSupabaseConfigured } from "@/lib/supabase";
import { formatOrderDate } from "@/lib/utils";
import type { OrderType, TrackedOrder } from "@/types";

const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  PANGKAT: "Badge Pangkat",
  NAMA_DADA: "Nama Dada Bordir",
  LOKASI: "Badge Lokasi / Satuan",
  EMBLEM: "Emblem / Logo",
  LAINNYA: "Lainnya",
};

// Hanya ditampilkan di Mode Demo (cocok dengan getDemoOrders di src/lib/demo-data.ts)
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

      {/* Search Header Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Lacak Status & Antrean Pesanan Bordir
          </h1>
          <p className="text-sm text-gray-600">
            Ketikkan Nomor Tiket Pesanan (contoh: <code>GPT-20261101-042</code>) dan 4 digit terakhir
            Nomor WhatsApp yang Anda daftarkan saat memesan.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(ticket, waLast4);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              aria-label="Nomor tiket pesanan"
              placeholder="Nomor tiket (GPT-YYYYMMDD-NNN)"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              className="w-full bg-white border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-gray-900 placeholder:text-gray-400 shadow-xs"
            />
          </div>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            aria-label="4 digit terakhir nomor WhatsApp"
            placeholder="4 digit akhir WA"
            value={waLast4}
            onChange={(e) => setWaLast4(e.target.value.replace(/\D/g, ""))}
            className="w-full sm:w-40 bg-white border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-gray-900 placeholder:text-gray-400 shadow-xs"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="bg-army hover:bg-army-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{isSearching ? "Mencari..." : "Lacak Pesanan"}</span>
          </button>
        </form>

        {/* Contoh Cepat Tiket (Mode Demo) */}
        {!isSupabaseConfigured && (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>Contoh tiket:</span>
            {DEMO_EXAMPLES.map((example) => (
              <button
                key={example.ticket}
                type="button"
                onClick={() => {
                  setTicket(example.ticket);
                  setWaLast4(example.wa);
                  runSearch(example.ticket, example.wa);
                }}
                className="font-mono bg-gray-100 hover:bg-gray-200 border border-gray-300 px-2.5 py-1 rounded text-gray-900 font-semibold transition-colors"
              >
                {example.ticket}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hasil Pelacakan */}
      {searched && !isSearching && (
        <div>
          {error ? (
            <ErrorBanner message={error} />
          ) : result ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header Hasil */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Nomor Tiket Pesanan
                  </span>
                  <h2 className="text-2xl font-mono font-bold text-army">{result.orderNumber}</h2>
                  <p className="text-xs text-gray-500">Dipesan pada: {formatOrderDate(result.createdAt)}</p>
                </div>

                <div>
                  {stageStatus === "PENDING" && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4" />
                      MENUNGGU ANTREAN MESIN
                    </span>
                  )}
                  {stageStatus === "IN_PROGRESS" && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4 text-blue-600" />
                      SEDANG DIKERJAKAN DI MESIN
                    </span>
                  )}
                  {result.status === "COMPLETED" && (
                    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold px-3 py-1.5 rounded-full">
                      <PackageCheck className="w-4 h-4" />
                      SUDAH DIAMBIL
                    </span>
                  )}
                  {stageStatus === "READY" && result.status !== "COMPLETED" && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      SIAP DIAMBIL DI TOKO
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Timeline 3 Langkah */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Perkembangan Proses Pengerjaan
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1 */}
                  <div
                    className={`border rounded-lg p-4 flex items-start gap-3 ${
                      stageStatus === "PENDING" || stageStatus === "IN_PROGRESS" || stageStatus === "READY"
                        ? "bg-emerald-50/60 border-emerald-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">1. Pesanan Diterima</h4>
                      <p className="text-xs text-gray-500">Data & bahan kain telah disiapkan</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div
                    className={`border rounded-lg p-4 flex items-start gap-3 ${
                      stageStatus === "IN_PROGRESS"
                        ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400/30"
                        : stageStatus === "READY"
                        ? "bg-emerald-50/60 border-emerald-200"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <Clock
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        stageStatus === "IN_PROGRESS"
                          ? "text-amber-700"
                          : stageStatus === "READY"
                          ? "text-emerald-700"
                          : "text-gray-400"
                      }`}
                    />
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">2. Pengerjaan Bordir</h4>
                      <p className="text-xs text-gray-500">Sedang dibordir komputer dengan benang timbul</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div
                    className={`border rounded-lg p-4 flex items-start gap-3 ${
                      stageStatus === "READY"
                        ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-600/20"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <PackageCheck
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        stageStatus === "READY" ? "text-emerald-700" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">3. Siap Diambil</h4>
                      <p className="text-xs text-gray-500">Tersimpan di etalase pick-up toko fisik</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rincian Pesanan Box */}
              <div className="bg-gray-50 rounded-lg p-5 space-y-3 border border-gray-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Rincian Pesanan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <p>
                    <strong className="text-gray-900">Pemesan:</strong> {result.customerName}{" "}
                    {result.customerRank && `(${result.customerRank})`}
                  </p>
                  <p>
                    <strong className="text-gray-900">Jenis Barang:</strong> {ORDER_TYPE_LABEL[result.orderType]}
                  </p>
                  <p>
                    <strong className="text-gray-900">Jumlah:</strong> {result.quantity} pcs
                  </p>
                  <p>
                    <strong className="text-gray-900">Estimasi Selesai:</strong>{" "}
                    <span className="text-army font-bold">
                                          {result.estimatedDone ?? "Menunggu jadwal dari toko"}
                                        </span>
                  </p>
                  <p className="sm:col-span-2">
                    <strong className="text-gray-900">Catatan Benang/Kain:</strong> {result.notes}
                  </p>
                </div>
              </div>

              {/* Petunjuk Pengambilan */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3 text-xs text-emerald-900">
                <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-emerald-800">Petunjuk Pengambilan Pesanan:</p>
                  <p>
                    Jika komandan atau satuan Anda mengutus perwakilan/bawahan untuk mengambil pesanan,
                    cukup tunjukkan atau sebutkan <strong>Nomor Tiket {result.orderNumber}</strong> ke kasir
                    Toko Gaperta.
                  </p>
                </div>
              </div>

              {/* Tombol Bantuan */}
              <div className="pt-2 flex justify-end">
                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20saya%20ingin%20menanyakan%20tiket%20${result.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4 text-army" />
                  <span>Ada Pertanyaan? Chat WhatsApp Pemilik</span>
                </a>
              </div>
            </div>
          ) : (
            /* Jika Tiket Tidak Ditemukan */
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center space-y-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Pesanan Tidak Ditemukan</h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                  Kombinasi nomor tiket <strong>{searchedTicket}</strong> dan 4 digit terakhir WhatsApp tidak
                  ditemukan. Pastikan ejaan nomor tiket sudah sesuai dengan tanda strip (misal:{" "}
                  <code>GPT-20261101-042</code>).
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/pesan"
                  className="inline-flex items-center gap-2 bg-army text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-army-dark transition-colors shadow-sm"
                >
                  <span>Daftarkan Pesanan Bordir Baru</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Suspense fallback={<div className="text-center py-10 text-sm text-gray-500">Memuat data pelacakan...</div>}>
          <TrackingContent />
        </Suspense>
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <p>© 2026 Toko Gaperta — Atribut Dinas & Bordir Komputer. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}
