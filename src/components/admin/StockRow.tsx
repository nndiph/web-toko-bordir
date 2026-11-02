import { MapPin, Minus, Plus } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

/** Stok di atas nilai ini dianggap penuh pada batang. */
const FULL_BAR_STOCK = 20;

export function stockTone(stock: number) {
  if (stock === 0) return { bar: "bg-rose-600", text: "text-rose-700" };
  if (stock < 5) return { bar: "bg-amber-500", text: "text-amber-700" };
  return { bar: "bg-emerald-600", text: "text-emerald-700" };
}

export function StockBar({ stock, className = "w-24" }: { stock: number; className?: string }) {
  const pct = stock === 0 ? 0 : Math.max(6, Math.min(100, (stock / FULL_BAR_STOCK) * 100));
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-gray-100 ${className}`} aria-hidden>
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
  "flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors disabled:opacity-40";

export function StockRow({ item, busy, onAdjust }: StockRowProps) {
  const tone = stockTone(item.stock);

  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3.5">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{item.categoryName}</p>
        <h3 className="truncate text-sm font-bold text-gray-900">{item.name}</h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-700">
          <span className="inline-flex items-center gap-1 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-army shrink-0" />
            {item.rackLocation || "Lokasi belum diisi"}
          </span>
          <span className="text-gray-300">·</span>
          <span className="tabular-nums">{formatRupiah(item.price)}</span>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-1">
        <StockBar stock={item.stock} />
        <span className={`text-[11px] font-bold ${tone.text}`}>
          {item.stock === 0 ? "HABIS" : item.stock < 5 ? "Menipis" : "Aman"}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onAdjust(-1)}
          disabled={busy || item.stock === 0}
          className={`${stepBtn} hover:border-rose-300 hover:text-rose-600`}
          title="Kurang 1 stok (terjual)"
          aria-label={`Kurangi stok ${item.name}`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className={`w-11 text-center text-xl font-extrabold tabular-nums ${tone.text}`}>{item.stock}</span>
        <button
          type="button"
          onClick={() => onAdjust(1)}
          disabled={busy}
          className={`${stepBtn} hover:border-emerald-300 hover:text-emerald-600`}
          title="Tambah 1 stok (restock)"
          aria-label={`Tambah stok ${item.name}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
}
