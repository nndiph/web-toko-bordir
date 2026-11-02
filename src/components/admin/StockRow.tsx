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
}

const stepBtn =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-slate-border bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.95] transition-all disabled:opacity-30 shadow-2xs";

export function StockRow({ item, busy, onAdjust }: StockRowProps) {
  const tone = stockTone(item.stock);

  return (
    <li className="flex items-center gap-3.5 rounded-2xl border border-slate-border bg-white p-4 hover:border-slate-300 transition-all hover:shadow-xs">
      <div className="min-w-0 flex-1 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          {item.categoryName}
        </span>
        <h3 className="truncate text-sm font-bold text-slate-ink">{item.name}</h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-accent-gold shrink-0" />
            {item.rackLocation || "Lokasi belum diisi"}
          </span>
          <span className="text-slate-300">·</span>
          <span className="tabular-nums font-bold text-slate-900">{formatRupiah(item.price)}</span>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-1">
        <StockBar stock={item.stock} />
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${tone.bg}`}>
          {item.stock === 0 ? "STOK HABIS" : item.stock < 5 ? "Menipis" : "Stok Aman"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onAdjust(-1)}
          disabled={busy || item.stock === 0}
          className={`${stepBtn} hover:border-red-300 hover:text-red-600`}
          title="Kurang 1 stok (terjual di kasir)"
          aria-label={`Kurangi stok ${item.name}`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className={`w-10 text-center text-xl font-extrabold tabular-nums ${tone.text}`}>
          {item.stock}
        </span>
        <button
          type="button"
          onClick={() => onAdjust(1)}
          disabled={busy}
          className={`${stepBtn} hover:border-emerald-300 hover:text-emerald-600`}
          title="Tambah 1 stok (restock barang)"
          aria-label={`Tambah stok ${item.name}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
}
