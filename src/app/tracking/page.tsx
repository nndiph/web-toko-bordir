"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Check, Clock, MapPin, MessageCircle, AlertCircle, Ticket } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { DemoBanner, ErrorBanner } from "@/components/StatusBanner";
import { trackOrder } from "@/lib/data/orders";
import { STORE, storeWaLink } from "@/lib/store-info";
import { isSupabaseConfigured } from "@/lib/supabase";
import { formatOrderDate } from "@/lib/utils";
import type { OrderStatus, OrderType, TrackedOrder } from "@/types";

const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  PANGKAT: "Badge Pangkat",
  NAMA_DADA: "Nama Dada",
  LOKASI: "Badge Lokasi / Satuan",
  EMBLEM: "Emblem / Logo",
  LAINNYA: "Lainnya",
};

const STEPS: Array<{ status: OrderStatus; title: string; desc: string }> = [
  { status: "PENDING", title: "Antre", desc: "Pesanan masuk antrean mesin" },
  { status: "IN_PROGRESS", title: "Dibordir", desc: "Sedang dikerjakan di mesin" },
  { status: "READY", title: "Siap Diambil", desc: "Silakan datang ke toko" },
  { status: "COMPLETED", title: "Sudah Diambil", desc: "Pesanan selesai" },
];

const STATUS_HEADLINE: Record<OrderStatus, { text: string; tone: string }> = {
  PENDING: { text: "Pesanan sedang antre", tone: "bg-amber-50 text-amber-900 border-amber-200" },
  IN_PROGRESS: { text: "Pesanan sedang dibordir", tone: "bg-sky-50 text-sky-900 border-sky-200" },
  READY: { text: "Pesanan SIAP DIAMBIL", tone: "bg-emerald-50 text-emerald-900 border-emerald-300" },
  COMPLETED: { text: "Pesanan sudah diambil", tone: "bg-slate-100 text-slate-700 border-slate-200" },
};

const DEMO_EXAMPLES = [
  { ticket: "GPT-20261101-042", wa: "7890" },
  { ticket: "GPT-20261101-038", wa: "5432" },
  { ticket: "GPT-20261101-045", wa: "3344" },
];

const fieldClass =
  "w-full h-12 bg-slate-50 border border-slate-border focus:border-brand focus:bg-white px-4 rounded-xl text-base text-slate-ink placeholder:text-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-brand/10";

function Stepper({ status }: { status: OrderStatus }) {
  const current = STEPS.findIndex((s) => s.status === status);
  return (
    <ol className="grid gap-3 sm:grid-cols-4">
      {STEPS.map((step, i) => {
        const done = i < current || status === "COMPLETED";
        const active = i === current && status !== "COMPLETED";
        return (
          <li
            key={step.status}
            aria-current={active ? "step" : undefined}
            className={`flex sm:flex-col items-center sm:items-start gap-3 p-3 rounded-2xl border ${
              active
                ? "border-brand bg-brand-light"
                : done
                ? "border-emerald-200 bg-white"
                : "border-dashed border-slate-300 bg-white text-slate-400"
            }`}
          >
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 ${
                done ? "bg-emerald-600 text-white" : active ? "bg-brand text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {done ? <Check className="w-5 h-5" /> : i + 1}
            </span>
            <span>
              <span className={`block font-bold text-base ${active ? "text-brand" : done ? "text-slate-ink" : ""}`}>
                {step.title}
              </span>
              <span className="block text-sm text-slate-muted">{active ? "Saat ini · " : ""}{step.desc}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

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

  const runSearch = useCallback(async (ticketToSearch: string, waToSearch: string) => {
    const normalizedTicket = ticketToSearch.trim().toUpperCase();
    const normalizedWa = waToSearch.replace(/\D/g, "");

    setSearched(true);
    setSearchedTicket(normalizedTicket);
    setResult(null);

    if (!normalizedTicket || normalizedWa.length !== 4) {
      setError("Isi nomor tiket dan tepat 4 angka terakhir nomor WhatsApp yang didaftarkan.");
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
    <div className="space-y-6">
      {!isSupabaseConfigured && <DemoBanner />}

      <div className="bg-white border border-slate-border rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Lacak Pesanan Bordir</h1>
          <p className="text-base text-slate-600">
            Masukkan nomor tiket dan 4 angka terakhir nomor WhatsApp yang dipakai saat memesan.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(ticket, waLast4);
          }}
          className="grid gap-4 sm:grid-cols-12 sm:items-end"
        >
          <div className="sm:col-span-6 space-y-1.5">
            <label htmlFor="ticket" className="block text-sm font-bold text-slate-700">
              Nomor tiket
            </label>
            <input
              id="ticket"
              type="text"
              required
              autoCapitalize="characters"
              placeholder="GPT-20261101-042"
              value={ticket}
              onChange={(e) => setTicket(e.target.value.toUpperCase())}
              className={`${fieldClass} tracking-wider`}
            />
          </div>

          <div className="sm:col-span-3 space-y-1.5">
            <label htmlFor="wa4" className="block text-sm font-bold text-slate-700">
              4 angka akhir WA
            </label>
            <input
              id="wa4"
              type="text"
              inputMode="numeric"
              maxLength={4}
              required
              placeholder="7890"
              value={waLast4}
              onChange={(e) => setWaLast4(e.target.value.replace(/\D/g, ""))}
              className={`${fieldClass} tracking-[0.3em] text-center font-bold`}
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="sm:col-span-3 h-12 bg-vibrant hover:bg-vibrant-hover text-white font-bold rounded-xl text-base transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-vibrant/20"
          >
            <Search className="w-5 h-5" />
            {isSearching ? "Mencari..." : "Lacak"}
          </button>
        </form>

        <p className="text-sm text-slate-muted">
          Lupa nomor tiket? Tanyakan ke kasir lewat{" "}
          <a href={storeWaLink()} target="_blank" rel="noopener noreferrer" className="font-bold text-brand underline">
            WhatsApp
          </a>{" "}
          dengan menyebut nama pemesan.
        </p>

        {!isSupabaseConfigured && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 border-t border-slate-border pt-4">
            <span className="font-bold">Coba tiket demo:</span>
            {DEMO_EXAMPLES.map((ex) => (
              <button
                key={ex.ticket}
                type="button"
                onClick={() => {
                  setTicket(ex.ticket);
                  setWaLast4(ex.wa);
                  runSearch(ex.ticket, ex.wa);
                }}
                className="h-9 bg-slate-50 border border-slate-200 hover:border-brand hover:text-brand px-3 rounded-lg font-mono text-xs"
              >
                {ex.ticket} · {ex.wa}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <ErrorBanner message={error} />}

      {searched && !isSearching && result && (
        <div className="bg-white border border-slate-border rounded-3xl p-5 sm:p-8 shadow-sm space-y-6" aria-live="polite">
          <div className={`rounded-2xl border px-4 py-3 text-lg font-extrabold ${STATUS_HEADLINE[result.status].tone}`}>
            {STATUS_HEADLINE[result.status].text}
          </div>

          <Stepper status={result.status} />

          {result.status === "READY" && (
            <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 sm:p-5 space-y-2 text-emerald-950">
              <p className="font-extrabold text-base">Silakan ambil di toko</p>
              <p className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                {STORE.address}
              </p>
              <p className="flex items-start gap-2 text-sm">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                {STORE.hours}
              </p>
              <p className="flex items-start gap-2 text-sm font-semibold">
                <Ticket className="w-4 h-4 shrink-0 mt-0.5" />
                Tunjukkan nomor tiket {result.orderNumber} ke kasir. Pembayaran di toko.
              </p>
            </div>
          )}

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t border-slate-border pt-5">
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-slate-muted">Nomor tiket</dt>
              <dd className="font-extrabold font-mono text-brand">{result.orderNumber}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-slate-muted">Pemesan</dt>
              <dd className="font-bold">
                {result.customerName}
                {result.customerRank && <span className="font-medium text-slate-600"> · {result.customerRank}</span>}
              </dd>
            </div>
            <div>
              <dt className="text-slate-muted">Jenis &amp; jumlah</dt>
              <dd className="font-bold">
                {ORDER_TYPE_LABEL[result.orderType]} · {result.quantity} pcs
              </dd>
            </div>
            <div>
              <dt className="text-slate-muted">Didaftarkan</dt>
              <dd className="font-bold">{formatOrderDate(result.createdAt)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-slate-muted">Rincian bordir</dt>
              <dd className="font-medium whitespace-pre-wrap">{result.notes}</dd>
            </div>
          </dl>

          <a
            href={storeWaLink(`Halo Toko Gaperta, saya mau tanya pesanan tiket ${result.orderNumber}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-ink text-base font-bold px-5 rounded-xl"
          >
            <MessageCircle className="w-5 h-5 text-brand" />
            Tanya Kasir via WA
          </a>
        </div>
      )}

      {searched && !isSearching && !result && !error && (
        <div className="bg-white border border-slate-border rounded-3xl p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold">Tiket tidak ditemukan</h2>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Periksa lagi nomor tiket &quot;{searchedTicket}&quot; dan 4 angka akhir WA. Huruf O dan angka 0 sering
            tertukar.
          </p>
          <Link href="/pesan" className="inline-block text-sm font-bold text-brand underline">
            Belum pesan? Isi formulir bordir
          </Link>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-slate-canvas text-slate-ink flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Suspense fallback={<div className="text-center py-12 text-slate-500 text-base">Memuat pelacakan...</div>}>
          <TrackingContent />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
