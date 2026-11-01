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
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

interface OrderDetail {
  orderNumber: string;
  customerName: string;
  rank?: string;
  whatsapp: string;
  orderType: string;
  quantity: string;
  notes: string;
  status: "PENDING" | "IN_PROGRESS" | "READY" | "COMPLETED";
  orderDate: string;
  estimatedDone: string;
}

const SAMPLE_ORDERS: Record<string, OrderDetail> = {
  "GPT-20261101-042": {
    orderNumber: "GPT-20261101-042",
    customerName: "Serka Bambang",
    rank: "Kopassus",
    whatsapp: "0812-3456-7890",
    orderType: "Badge Pangkat Timbul",
    quantity: "4 pasang",
    notes: "Benang hitam timbul tebal, dasar kain loreng Malvinas.",
    status: "IN_PROGRESS",
    orderDate: "Kemarin, 14:20 WIB",
    estimatedDone: "Hari ini pukul 16:30 WIB",
  },
  "GPT-20261101-038": {
    orderNumber: "GPT-20261101-038",
    customerName: "Lettu Danang",
    rank: "Yonif 100",
    whatsapp: "0811-9876-5432",
    orderType: "Pangkat PDU & PDL",
    quantity: "6 pasang",
    notes: "Dasar hijau TNI, benang emas kuningan.",
    status: "PENDING",
    orderDate: "3 hari yang lalu",
    estimatedDone: "Sedang dijadwalkan ulang oleh pemilik toko",
  },
  "GPT-20261101-045": {
    orderNumber: "GPT-20261101-045",
    customerName: "Kopda Hendra",
    rank: "Kodam I/BB",
    whatsapp: "0813-1122-3344",
    orderType: "Nama Dada Bordir",
    quantity: "2 pcs",
    notes: "Tulisan 'HENDRA S.', kain hijau standar dinas.",
    status: "READY",
    orderDate: "Hari ini, 09:00 WIB",
    estimatedDone: "Sudah selesai — Siap diambil di etalase toko fisik",
  },
};

function TrackingContent() {
  const searchParams = useSearchParams();
  const ticketParam = searchParams.get("ticket") || "";

  const [query, setQuery] = useState(ticketParam);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<OrderDetail | null>(null);

  const handleSearch = useCallback((ticketToSearch?: string) => {
    const q = (ticketToSearch !== undefined ? ticketToSearch : query).trim().toUpperCase();
    setSearched(true);

    if (SAMPLE_ORDERS[q]) {
      setResult(SAMPLE_ORDERS[q]);
      return;
    }

    // Cari berdasarkan nomor WhatsApp jika input angka
    const matchByWa = Object.values(SAMPLE_ORDERS).find((order) =>
      order.whatsapp.replace(/[^0-9]/g, "").includes(q.replace(/[^0-9]/g, ""))
    );

    if (matchByWa) {
      setResult(matchByWa);
    } else {
      setResult(null);
    }
  }, [query]);

  useEffect(() => {
    if (ticketParam) {
      setQuery(ticketParam);
      handleSearch(ticketParam);
    }
  }, [ticketParam, handleSearch]);

  return (
    <div className="space-y-8 font-sans">
      {/* Search Header Box */}
      <div className="bg-white border border-surface-border rounded-3xl p-6 sm:p-10 shadow-card space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-army/10 text-army text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Lacak Real-Time
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Lacak Status & Antrean Pesanan Bordir
          </h1>
          <p className="text-sm text-ink-muted">
            Ketikkan Nomor Tiket Pesanan (contoh: <code>GPT-20261101-042</code>) atau Nomor WhatsApp yang Anda daftarkan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-ink-soft" />
            <input
              type="text"
              placeholder="Masukkan nomor tiket (GPT-...) atau nomor WhatsApp..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-white border border-surface-border pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-ink placeholder:text-ink-soft shadow-xs transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => handleSearch()}
            className="bg-army hover:bg-army-dark active:scale-[0.98] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-army/20 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Lacak Pesanan</span>
          </button>
        </div>

        {/* Contoh Cepat Tiket */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <span>Contoh tiket pengujian:</span>
          {Object.keys(SAMPLE_ORDERS).map((ticket) => (
            <button
              key={ticket}
              type="button"
              onClick={() => {
                setQuery(ticket);
                handleSearch(ticket);
              }}
              className="font-mono bg-slate-50 hover:bg-slate-100 border border-surface-border px-2.5 py-1 rounded-lg text-army font-bold transition-all"
            >
              {ticket}
            </button>
          ))}
        </div>
      </div>

      {/* Hasil Pelacakan */}
      {searched && (
        <div className="animate-in fade-in duration-200">
          {result ? (
            <div className="bg-white border border-surface-border rounded-3xl p-6 sm:p-10 shadow-card space-y-8">
              {/* Header Hasil */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Nomor Tiket Pesanan
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-mono font-extrabold text-army tracking-wide">
                    {result.orderNumber}
                  </h2>
                  <p className="text-xs text-ink-muted mt-1">Didaftarkan: {result.orderDate}</p>
                </div>

                <div>
                  {result.status === "PENDING" && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-bold px-3.5 py-1.5 rounded-full">
                      <Clock className="w-4 h-4 text-amber-600" />
                      MENUNGGU ANTREAN MESIN
                    </span>
                  )}
                  {result.status === "IN_PROGRESS" && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200/80 text-xs font-bold px-3.5 py-1.5 rounded-full">
                      <Clock className="w-4 h-4 animate-spin text-blue-600" />
                      SEDANG DIKERJAKAN DI MESIN
                    </span>
                  )}
                  {result.status === "READY" && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold px-3.5 py-1.5 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      SIAP DIAMBIL DI TOKO
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Timeline 3 Langkah */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Perkembangan Proses Pengerjaan
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1 */}
                  <div
                    className={`border rounded-2xl p-4 flex items-start gap-3 transition-all ${
                      result.status === "PENDING" || result.status === "IN_PROGRESS" || result.status === "READY"
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-slate-50 border-surface-border"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-ink">1. Pesanan Diterima</h4>
                      <p className="text-[11px] text-ink-muted">Data & bahan kain telah disiapkan</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div
                    className={`border rounded-2xl p-4 flex items-start gap-3 transition-all ${
                      result.status === "IN_PROGRESS"
                        ? "bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20"
                        : result.status === "READY"
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-slate-50 border-surface-border opacity-60"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        result.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700"
                          : result.status === "READY"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <Clock className={`w-4 h-4 ${result.status === "IN_PROGRESS" ? "animate-spin" : ""}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-ink">2. Pengerjaan Bordir</h4>
                      <p className="text-[11px] text-ink-muted">Sedang dibordir komputer dengan benang timbul</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div
                    className={`border rounded-2xl p-4 flex items-start gap-3 transition-all ${
                      result.status === "READY"
                        ? "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-600/20"
                        : "bg-slate-50 border-surface-border opacity-60"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        result.status === "READY" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <PackageCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-ink">3. Siap Diambil</h4>
                      <p className="text-[11px] text-ink-muted">Tersimpan di etalase pick-up toko fisik</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rincian Pesanan Box */}
              <div className="bg-slate-50/70 rounded-2xl p-6 space-y-4 border border-surface-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Rincian Informasi Pesanan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-ink-muted block text-xs">Pemesan:</span>
                    <strong className="text-ink text-sm">
                      {result.customerName} {result.rank && `(${result.rank})`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-xs">Jenis Barang:</span>
                    <strong className="text-ink text-sm">{result.orderType}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-xs">Jumlah:</span>
                    <strong className="text-ink text-sm">{result.quantity}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-xs">Estimasi Selesai:</span>
                    <span className="text-army font-bold text-sm">{result.estimatedDone}</span>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-surface-border/60">
                    <span className="text-ink-muted block text-xs mb-1">Catatan Khusus Benang & Bahan:</span>
                    <p className="bg-white p-3 rounded-xl border border-surface-border text-ink text-xs font-medium">
                      {result.notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Petunjuk Pengambilan */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900">
                <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-emerald-800">Petunjuk Pengambilan Pesanan:</p>
                  <p className="leading-relaxed">
                    Jika komandan atau satuan Anda mengutus perwakilan/bawahan untuk mengambil pesanan, cukup tunjukkan atau sebutkan <strong>Nomor Tiket {result.orderNumber}</strong> kepada kasir Toko Gaperta.
                  </p>
                </div>
              </div>

              {/* Tombol Bantuan WA */}
              <div className="pt-2 flex justify-end">
                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Toko%20Gaperta,%20saya%20ingin%20menanyakan%20status%20tiket%20${result.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border border-surface-border hover:bg-slate-50 text-ink text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs"
                >
                  <Phone className="w-4 h-4 text-army" />
                  <span>Ada Pertanyaan? Chat WhatsApp Pemilik Toko</span>
                </a>
              </div>
            </div>
          ) : (
            /* Jika Tiket Tidak Ditemukan */
            <div className="bg-white border border-surface-border rounded-3xl p-10 shadow-card text-center space-y-4">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-ink">Pesanan Tidak Ditemukan</h3>
                <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
                  Nomor tiket atau nomor WhatsApp <strong>&quot;{query}&quot;</strong> tidak terdaftar dalam sistem. Pastikan format penulisan nomor tiket sesuai (misal: <code>GPT-20261101-042</code>).
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/pesan"
                  className="inline-flex items-center gap-2 bg-army hover:bg-army-dark active:scale-[0.98] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-army/20"
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
        <Suspense fallback={<div className="text-center py-10 text-sm text-ink-muted">Memuat data pelacakan...</div>}>
          <TrackingContent />
        </Suspense>
      </main>
      <footer className="bg-white border-t border-surface-border py-6 text-center text-xs text-ink-muted">
        <p>© 2026 Toko Gaperta — Atribut Dinas & Bordir Komputer. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}
