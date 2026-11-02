"use client";

import { useState } from "react";
import { CheckCircle2, Clock, MessageCircle, Package, RefreshCw, Send } from "lucide-react";
import { ORDER_TYPE_LABEL } from "@/lib/labels";
import { ageLabel, formatOrderDate, toWaNumber } from "@/lib/utils";
import type { CustomOrder, OrderStatus } from "@/types";

interface OrderRowProps {
  order: CustomOrder;
  overdue: boolean;
  days: number;
  /** Batas hari sebelum pesanan dianggap terlewat (untuk skala batang usia). */
  overdueDays: number;
  busy: boolean;
  onAdvance: (status: OrderStatus) => void;
}

const STATUS_META: Record<OrderStatus, { label: string; pill: string; stripe: string; Icon: typeof Clock }> = {
  PENDING: { label: "Antre", pill: "bg-amber-100 text-amber-800", stripe: "bg-amber-500", Icon: Clock },
  IN_PROGRESS: { label: "Dibordir", pill: "bg-blue-100 text-blue-800", stripe: "bg-blue-600", Icon: RefreshCw },
  READY: { label: "Siap diambil", pill: "bg-emerald-100 text-emerald-800", stripe: "bg-emerald-600", Icon: CheckCircle2 },
  COMPLETED: { label: "Sudah diambil", pill: "bg-gray-100 text-gray-700", stripe: "bg-gray-300", Icon: Package },
};

const primaryBtn =
  "inline-flex items-center justify-center gap-1.5 bg-army hover:bg-army-dark disabled:opacity-60 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors shadow-xs whitespace-nowrap";
const secondaryBtn =
  "inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-900 border border-gray-300 font-semibold px-3 py-2 rounded-lg text-xs transition-colors whitespace-nowrap";

export function OrderRow({ order, overdue, days, overdueDays, busy, onAdvance }: OrderRowProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[order.status];
  const wa = toWaNumber(order.whatsappNumber);
  const isCompleted = order.status === "COMPLETED";

  const ageTone = days >= overdueDays ? "bg-rose-600" : days >= overdueDays - 1 ? "bg-amber-500" : "bg-emerald-600";
  const agePct = Math.max(8, Math.min(100, (days / overdueDays) * 100));

  const readyMessage = encodeURIComponent(
    `Halo Bpk/Ibu ${order.customerName}, pesanan custom bordir Anda dengan tiket ${order.orderNumber} sudah selesai dan siap diambil di Toko Gaperta.`
  );

  return (
    <li
      className={`flex overflow-hidden rounded-lg border ${
        overdue ? "border-rose-300 bg-rose-50/40" : "border-gray-200 bg-white"
      }`}
    >
      <span className={`w-1.5 shrink-0 ${overdue ? "bg-rose-600" : meta.stripe}`} aria-hidden />

      <div className="flex-1 min-w-0 p-3.5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-bold text-sm text-gray-900">{order.customerName}</h3>
            {order.customerRank && <span className="text-xs text-gray-500">{order.customerRank}</span>}
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${meta.pill}`}>
              <meta.Icon className="w-3 h-3" />
              {meta.label}
            </span>
            {overdue && (
              <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[11px] font-extrabold text-white">
                Terlewat {days} hari
              </span>
            )}
          </div>

          <p className="text-xs text-gray-600">
            <span className="font-semibold text-gray-900">{ORDER_TYPE_LABEL[order.orderType]}</span>
            {" · "}
            {order.quantity} pcs
            {" · "}
            <span className="font-mono text-gray-500">{order.orderNumber}</span>
          </p>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="block w-full text-left"
            title={expanded ? "Ciutkan catatan" : "Lihat catatan lengkap"}
          >
            <span className={`block text-xs text-gray-500 ${expanded ? "" : "line-clamp-1"}`}>{order.notes}</span>
          </button>

          {!isCompleted && (
            <div className="flex items-center gap-2 pt-0.5" title={`Masuk ${formatOrderDate(order.createdAt)}`}>
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-gray-100">
                <div className={`h-full rounded-full ${ageTone}`} style={{ width: `${agePct}%` }} />
              </div>
              <span className="text-[11px] tabular-nums text-gray-500">{ageLabel(days)}</span>
            </div>
          )}
        </div>

        {!isCompleted && (
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {order.status === "PENDING" && (
              <button type="button" disabled={busy} onClick={() => onAdvance("IN_PROGRESS")} className={primaryBtn}>
                Mulai Bordir
              </button>
            )}
            {order.status === "IN_PROGRESS" && (
              <button type="button" disabled={busy} onClick={() => onAdvance("READY")} className={primaryBtn}>
                Tandai Siap Diambil
              </button>
            )}
            {order.status === "READY" && (
              <>
                <a
                  href={`https://wa.me/${wa}?text=${readyMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={primaryBtn}
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim WA Selesai
                </a>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    if (window.confirm(`Tandai pesanan ${order.orderNumber} sudah diambil pemesan?`)) {
                      onAdvance("COMPLETED");
                    }
                  }}
                  className={secondaryBtn}
                >
                  <Package className="w-3.5 h-3.5" />
                  Sudah Diambil
                </button>
              </>
            )}
            {order.status !== "READY" && (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryBtn}
                title={`Chat ${order.whatsappNumber}`}
                aria-label={`Chat WhatsApp ${order.customerName}`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="sr-only sm:not-sr-only">Chat</span>
              </a>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
