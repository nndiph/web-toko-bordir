import { CheckCircle2, PackageX } from "lucide-react";
import { StockBar, stockTone } from "@/components/admin/StockRow";
import type { Product } from "@/types";

interface RestockPanelProps {
  /** Sudah diurutkan: paling sedikit lebih dulu. */
  items: Product[];
  onPick: (name: string) => void;
}

export function RestockPanel({ items, onPick }: RestockPanelProps) {
  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-4 space-y-3 h-fit">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-900">
          <PackageX className="w-4 h-4 text-amber-600" />
          Perlu restock
        </h2>
        {items.length > 0 && (
          <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[11px] font-bold text-white">{items.length}</span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="flex items-start gap-2 text-xs text-gray-500">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          Semua barang stoknya aman (5 pcs atau lebih).
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onPick(item.name)}
                className="flex w-full items-center gap-3 py-2 text-left hover:bg-gray-50 -mx-1 px-1 rounded"
                title="Tampilkan di daftar"
              >
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-gray-900">{item.name}</span>
                <StockBar stock={item.stock} className="w-14" />
                <span className={`w-12 text-right text-[11px] font-bold tabular-nums ${stockTone(item.stock).text}`}>
                  {item.stock === 0 ? "HABIS" : `${item.stock} pcs`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
