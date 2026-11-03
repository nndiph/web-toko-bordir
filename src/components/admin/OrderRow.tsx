"use client";

import { useState } from "react";
import { CheckCircle2, Clock, MessageCircle, Package, RefreshCw, Send, ChevronDown } from "lucide-react";
import { ORDER_TYPE_LABEL } from "@/lib/labels";
import { ageLabel, formatOrderDate, toWaNumber } from "@/lib/utils";
import type { CustomOrder, OrderStatus } from "@/types";

interface OrderRowProps {
  order: CustomOrder;
  overdue: boolean;
  days: number;
  /** Batas hari sebelum pesanan dianggap terlewat. */
  overdueDays: number;
  busy: boolean;
  onAdvance: (status: OrderStatus) => void;
}

const STATUS_META: Record<OrderStatus, { label: string; pill: string; stripe: string; Icon: typeof Clock }> = {
  PENDING: { label: "Antre di Mesin", pill: "bg-amber-100 text-amber-800 border-amber-200", stripe: "bg-amber-500", Icon: Clock },
  IN_PROGRESS: { label: "Sedang Dibordir", pill: "bg-sky-100 text-sky-800 border-sky-200", stripe: "bg-sky-600", Icon: RefreshCw },
  READY: { label: "Siap Diambil", pill: "bg-emerald-100 text-emerald-800 border-emerald-200", stripe: "bg-emerald-600", Icon: CheckCircle2 },
  COMPLETED: { label: "Sudah Diambil", pill: "bg-slate-100 text-slate-700 border-slate-200", stripe: "bg-slate-400", Icon: Package },
};

const primaryBtn =
  "inline-flex items-center justify-center gap-1.5 bg-brand hover:bg-brand-hover active:scale-[0.98] disabled:opacity-50 text-white font-bold px-4 h-11 rounded-xl text-sm transition-all whitespace-nowrap";
const secondaryBtn =
  "inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50 text-slate-700 border border-slate-border font-semibold px-3.5 h-11 rounded-xl text-sm transition-all whitespace-nowrap";

export function OrderRow({ order, overdue, days, overdueDays, busy, onAdvance }: OrderRowProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[order.status];
  const wa = toWaNumber(order.whatsappNumber);
  const isCompleted = order.status === "COMPLETED";

  const ageTone = days >= overdueDays ? "bg-red-600" : days >= overdueDays - 1 ? "bg-amber-500" : "bg-emerald-600";
  const agePct = Math.max(8, Math.min(100, (days / overdueDays) * 100));

  const readyMessage = encodeURIComponent(
    `Halo Bpk/Ibu ${order.customerName}, pesanan custom bordir Anda dengan nomor tiket ${order.orderNumber} sudah selesai dan siap diambil di Toko Gaperta (Jl. Gaperta No. 12, Medan).`
  );

  return (
    <li
      className={`flex overflow-hidden rounded-2xl border transition-all ${
        overdue
          ? "border-red-300 bg-red-50/40"
          : "border-slate-border bg-white hover:border-slate-300"
      }`}
    >
      {/* Stripe warna status */}
      <span className={`w-1.5 shrink-0 ${overdue ? "bg-red-600" : meta.stripe}`} aria-hidden />

      <div className="flex-1 min-w-0 p-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        {/* Info Pemesan */}
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-ink">{order.customerName}</h3>
            {order.customerRank && (
              <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {order.customerRank}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold border ${meta.pill}`}
            >
              <meta.Icon className="w-3 h-3" />
              {meta.label}
            </span>
            {overdue && (
              <span className="rounded-md bg-red-600 px-2 py-0.5 text-xs font-extrabold text-white">
                Terlewat {days} hari
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600">
            <span className="font-bold text-slate-ink">{ORDER_TYPE_LABEL[order.orderType]}</span>
            {" · "}
            <span className="font-semibold">{order.quantity} pcs</span>
            {" · "}
            <span className="font-mono text-brand font-bold text-base">{order.orderNumber}</span>
          </p>

          {/* Toggle Catatan */}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex items-center gap-1 min-h-9 text-sm text-slate-600 hover:text-brand font-medium text-left"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
            <span>{expanded ? "Sembunyikan rincian" : `Rincian: ${order.notes.length > 40 ? `${order.notes.slice(0, 40)}…` : order.notes}`}</span>
          </button>

          {expanded && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-700 space-y-1">
              <p className="whitespace-pre-wrap font-medium">{order.notes}</p>
            </div>
          )}

          {/* Batang Usia Pesanan */}
          {!isCompleted && (
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100" aria-hidden>
                <div className={`h-full rounded-full ${ageTone}`} style={{ width: `${agePct}%` }} />
              </div>
              <span className="font-medium text-slate-500">
                {ageLabel(days)} · Didaftarkan {formatOrderDate(order.createdAt)}
              </span>
            </div>
          )}
        </div>

        {/* Tombol Aksi Kasir */}
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {order.status === "PENDING" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onAdvance("IN_PROGRESS")}
              className={primaryBtn}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Mulai Bordir</span>
            </button>
          )}

          {order.status === "IN_PROGRESS" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onAdvance("READY")}
              className={primaryBtn}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tandai Siap</span>
            </button>
          )}

          {order.status === "READY" && (
            <>
              {wa && (
                <a
                  href={`https://wa.me/${wa}?text=${readyMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold px-4 h-11 rounded-xl text-sm transition-all"
                  title="Buka chat WhatsApp dengan pesan konfirmasi siap diambil"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim WA</span>
                </a>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  if (confirm(`Konfirmasi penyerahan barang untuk tiket ${order.orderNumber}?`)) {
                    onAdvance("COMPLETED");
                  }
                }}
                className={secondaryBtn}
                title="Tandai pesanan sudah diserahkan ke pelanggan"
              >
                <Package className="w-3.5 h-3.5 text-slate-500" />
                <span>Sudah Diambil</span>
              </button>
            </>
          )}

          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 font-medium px-2 py-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Selesai &amp; Diserahkan
            </span>
          )}

          {wa && order.status !== "READY" && !isCompleted && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryBtn}
              title={`Hubungi WhatsApp pemesan (${order.whatsappNumber})`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chat WA</span>
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
