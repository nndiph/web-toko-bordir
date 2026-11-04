import { AlertCircle, AlertTriangle } from "lucide-react";
import type { Product } from "@/types";

interface RestockPanelProps {
  items: Product[];
  onPick: (query: string) => void;
}

export function RestockPanel({ items, onPick }: RestockPanelProps) {
  const outOfStockCount = items.filter((i) => i.stock === 0).length;

  return (
    <aside className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <h2 className="text-sm font-bold text-amber-950">
            Perlu Restock Segera
          </h2>
        </div>
        <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-extrabold text-amber-900 tabular-nums">
          {items.length}
        </span>
      </div>

      {outOfStockCount > 0 && (
        <div className="flex items-center gap-1.5 text-sm font-bold text-red-700 bg-red-100/80 px-2.5 py-1.5 rounded-lg border border-red-200">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{outOfStockCount} barang kosong total di rak!</span>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-amber-900/80 py-2">
          Semua stok barang fisik di etalase dalam kondisi aman (≥ 5 pcs).
        </p>
      ) : (
        <ul className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
          {items.map((item) => {
            const isZero = item.stock === 0;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onPick(item.name)}
                  className="w-full text-left rounded-xl bg-white/90 hover:bg-white border border-amber-200/80 hover:border-amber-400 p-3 min-h-12 transition-all text-sm flex items-center justify-between gap-2 group"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-ink truncate group-hover:text-brand transition-colors">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-600 truncate">{item.rackLocation}</p>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-extrabold tabular-nums shrink-0 ${
                      isZero ? "bg-red-600 text-white" : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {isZero ? "KOSONG" : `${item.stock} pcs`}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-xs text-amber-900/80 pt-1">
        Klik barang untuk langsung mencarinya dan mengatur stoknya.
      </p>
    </aside>
  );
}
