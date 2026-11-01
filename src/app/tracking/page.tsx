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
    estimatedDone: "Sudah selesai — Siap diambil di toko fisik",
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
    <div className="space-y-8">
      {/* Search Header Box */}
      <div className="bg-white border border-army-border/80 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
            Lacak Status & Antrean Pesanan Bordir
          </h2>
          <p className="text-sm text-ink-muted">
            Ketikkan Nomor Tiket Pesanan (contoh: <code>GPT-20261101-042</code>) atau Nomor WhatsApp aktif
            yang Anda daftarkan saat memesan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-ink-soft" />
            <input
              type="text"
              placeholder="Masukkan nomor tiket atau nomor WhatsApp..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-white border border-army-border pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army text-ink placeholder:text-ink-soft shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => handleSearch()}
            className="bg-army hover:bg-army-dark text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Lacak Pesanan</span>
          </button>
        </div>

        {/* Contoh Cepat */}
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
              className="font-mono bg-surface-muted hover:bg-surface border border-army-border px-2 py-0.5 rounded text-army font-semibold transition-colors"
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
            <div className="bg-white border border-army-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header Hasil */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-army-border/60 pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Nomor Tiket Pesanan
                  </span>
                  <h3 className="text-2xl font-mono font-extrabold text-army">{result.orderNumber}</h3>
                  <p className="text-xs text-ink-muted">Dipesan pada: {result.orderDate}</p>
                </div>

                <div>
                  {result.status === "PENDING" && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4" />
                      MENUNGGU ANTRIAN MESIN
                    </span>
                  )}
                  {result.status === "IN_PROGRESS" && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4 animate-spin text-blue-600" />
                      SEDANG DIKERJAKAN DI MESIN
                    </span>
                  )}
                  {result.status === "READY" && (
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-800 border border-green-200 text-xs font-bold px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      SIAP DIAMBIL DI TOKO
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Timeline 3 Langkah */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Perkembangan Proses Pengerjaan
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1 */}
                  <div
                    className={`border rounded-xl p-4 flex items-start gap-3 ${
                      result.status === "PENDING" || result.status === "IN_PROGRESS" || result.status === "READY"
                        ? "bg-green-50/60 border-green-200"
                        : "bg-surface-muted border-army-border"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-ink">1. Pesanan Diterima</h5>
                      <p className="text-xs text-ink-muted">Data & bahan kain telah disiapkan</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div
                    className={`border rounded-xl p-4 flex items-start gap-3 ${
                      result.status === "IN_PROGRESS"
                        ? "bg-amber-50/80 border-amber-300 ring-2 ring-gold/40"
                        : result.status === "READY"
                        ? "bg-green-50/60 border-green-200"
                        : "bg-surface-muted border-army-border opacity-60"
                    }`}
                  >
                    <Clock
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        result.status === "IN_PROGRESS"
                          ? "text-amber-700 animate-spin"
                          : result.status === "READY"
                          ? "text-green-700"
                          : "text-ink-soft"
                      }`}
                    />
                    <div>
                      <h5 className="font-bold text-xs text-ink">2. Pengerjaan Bordir</h5>
                      <p className="text-xs text-ink-muted">Sedang dibordir komputer dengan benang timbul</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div
                    className={`border rounded-xl p-4 flex items-start gap-3 ${
                      result.status === "READY"
                        ? "bg-green-50 border-green-300 ring-2 ring-green-600/30"
                        : "bg-surface-muted border-army-border opacity-60"
                    }`}
                  >
                    <PackageCheck
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        result.status === "READY" ? "text-green-700" : "text-ink-soft"
                      }`}
                    />
                    <div>
                      <h5 className="font-bold text-xs text-ink">3. Siap Diambil</h5>
                      <p className="text-xs text-ink-muted">Tersimpan di etalase pick-up toko fisik</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rincian Pesanan Box */}
              <div className="bg-surface rounded-xl p-5 space-y-3 border border-army-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Rincian Pesanan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <p>
                    <strong className="text-ink">Pemesan:</strong> {result.customerName}{" "}
                    {result.rank && `(${result.rank})`}
                  </p>
                  <p>
                    <strong className="text-ink">Jenis Barang:</strong> {result.orderType}
                  </p>
                  <p>
                    <strong className="text-ink">Jumlah:</strong> {result.quantity}
                  </p>
                  <p>
                    <strong className="text-ink">Estimasi Selesai:</strong>{" "}
                    <span className="text-army font-bold">{result.estimatedDone}</span>
                  </p>
                  <p className="sm:col-span-2">
                    <strong className="text-ink">Catatan Benang/Kain:</strong> {result.notes}
                  </p>
                </div>
              </div>

              {/* Petunjuk Pengambilan */}
              <div className="bg-army-light/80 border border-army/30 rounded-xl p-4 flex items-start gap-3 text-xs text-army-dark">
                <HelpCircle className="w-5 h-5 text-army shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-army">Petunjuk Pengambilan Pesanan:</p>
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
                  className="inline-flex items-center gap-2 bg-white border border-army-border hover:bg-surface text-ink text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4 text-army" />
                  <span>Ada Pertanyaan? Chat WhatsApp Pemilik</span>
                </a>
              </div>
            </div>
          ) : (
            /* Jika Tiket Tidak Ditemukan */
            <div className="bg-white border border-army-border/80 rounded-2xl p-8 shadow-sm text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-ink">Pesanan Tidak Ditemukan</h3>
                <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
                  Nomor tiket atau nomor WhatsApp <strong>{query}</strong> tidak terdaftar dalam sistem.
                  Pastikan ejaan nomor tiket sudah sesuai dengan tanda strip (misal:{" "}
                  <code>GPT-20261101-042</code>).
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/pesan"
                  className="inline-flex items-center gap-2 bg-army text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-army-dark transition-colors"
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
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Suspense fallback={<div className="text-center py-10 text-sm text-ink-muted">Memuat data pelacakan...</div>}>
          <TrackingContent />
        </Suspense>
      </main>
      <footer className="bg-white border-t border-army-border/60 py-6 text-center text-xs text-ink-muted">
        <p>© 2026 Toko Gaperta — Atribut Dinas & Bordir Komputer. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}
