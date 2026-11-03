"use client";

import { useState } from "react";
import { MapPin, Minus, Plus } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

/** Stok di atas nilai ini dianggap penuh pada batang. */
const FULL_BAR_STOCK = 20;

export function stockTone(stock: number) {
  if (stock === 0) return { bar: "bg-red-600", text: "text-red-600", bg: "bg-red-50 text-red-700 border-red-200" };
  if (stock < 5) return { bar: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50 text-amber-800 border-amber-200" };
  return { bar: "bg-emerald-600", text: "text-emerald-700", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
}

export function StockBar({ stock, className = "w-24" }: { stock: number; className?: string }) {
  const pct = stock === 0 ? 0 : Math.max(6, Math.min(100, (stock / FULL_BAR_STOCK) * 100));
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-slate-100 ${className}`} aria-hidden>
      <div className={`h-full rounded-full ${stockTone(stock).bar}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

interface StockRowProps {
  item: Product;
  busy: boolean;
  onAdjust: (delta: number) => void;
  /** Atur stok ke jumlah persis (mis. setelah hitung ulang rak atau barang datang). */
  onSet: (target: number) => void;
}

const stepBtn =
  "flex h-11 w-11 items-center justify-center rounded-xl border border-slate-border bg-white text-slate-700 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-30";

export function StockRow({ item, busy, onAdjust, onSet }: StockRowProps) {
  const tone = stockTone(item.stock);
  const isCustom = item.status === "CUSTOM";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(item.stock));

  const submitDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Math.max(0, Math.floor(Number(draft)));
    if (Number.isFinite(target)) onSet(target);
    setEditing(false);
  };

  return (
    <li className="rounded-2xl border border-slate-border bg-white p-4 hover:border-slate-300 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-base font-bold text-slate-ink leading-snug">{item.name}</h3>
          {/* Lokasi rak ditonjolkan: ini yang dicari kasir saat ada pembeli */}
          <p className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-sm font-extrabold text-amber-900">
            <MapPin className="w-4 h-4 shrink-0" />
            {item.rackLocation || "Lokasi belum diisi"}
          </p>
          <p className="text-sm text-slate-600">
            {item.categoryName} · <span className="font-bold text-slate-ink tabular-nums">{formatRupiah(item.price)}</span>
          </p>
        </div>

        {isCustom ? (
          <span className="text-sm font-semibold text-slate-500">Dibuat sesuai pesanan</span>
        ) : editing ? (
          <form onSubmit={submitDraft} className="flex items-center gap-2">
            <label htmlFor={`stock-${item.id}`} className="text-sm font-semibold text-slate-600">
              Stok jadi
            </label>
            <input
              id={`stock-${item.id}`}
              type="number"
              inputMode="numeric"
              min={0}
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-20 h-11 rounded-xl border-2 border-brand px-2 text-center text-lg font-extrabold focus:outline-none"
            />
            <button type="submit" className="h-11 px-4 rounded-xl bg-brand text-white text-sm font-bold">
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="h-11 px-3 rounded-xl border border-slate-border text-sm font-semibold"
            >
              Batal
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${tone.bg}`}>
                {item.stock === 0 ? "HABIS" : item.stock < 5 ? "Menipis" : "Aman"}
              </span>
              <StockBar stock={item.stock} className="w-20" />
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onAdjust(-1)}
                disabled={busy || item.stock === 0}
                className={`${stepBtn} hover:border-red-300 hover:text-red-600`}
                aria-label={`Kurangi 1 stok ${item.name} (terjual)`}
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(String(item.stock));
                  setEditing(true);
                }}
                disabled={busy}
                title="Klik untuk mengisi jumlah stok persis"
                className={`min-w-14 h-11 px-2 rounded-xl border border-dashed border-slate-300 hover:border-brand text-2xl font-extrabold tabular-nums ${tone.text}`}
              >
                {item.stock}
              </button>
              <button
                type="button"
                onClick={() => onAdjust(1)}
                disabled={busy}
                className={`${stepBtn} hover:border-emerald-300 hover:text-emerald-600`}
                aria-label={`Tambah 1 stok ${item.name}`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
