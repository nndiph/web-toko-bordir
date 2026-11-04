import { AlertTriangle, CheckCircle2, ClipboardList, PackageX } from "lucide-react";

export type KpiKey = "OVERDUE" | "READY" | "ACTIVE" | "LOW_STOCK";

interface KpiStripProps {
  overdue: number;
  ready: number;
  active: number;
  lowStock: number;
  overdueDays: number;
  selected: KpiKey | null;
  onSelect: (key: KpiKey) => void;
}

/** Ringkasan yang selalu terlihat di semua tab. Tiap kartu = pintasan ke daftar terkait. */
export function KpiStrip({ overdue, ready, active, lowStock, overdueDays, selected, onSelect }: KpiStripProps) {
  const cards: Array<{
    key: KpiKey;
    label: string;
    value: number;
    hint: string;
    Icon: typeof AlertTriangle;
    alert: boolean;
    alertTone: string;
  }> = [
    {
      key: "OVERDUE",
      label: "Kartu Merah",
      value: overdue,
      hint: overdue > 0 ? `Tertahan ≥ ${overdueDays} hari` : "Tidak ada yang terlewat",
      Icon: AlertTriangle,
      alert: overdue > 0,
      alertTone: "border-red-400 bg-red-600 text-white",
    },
    {
      key: "READY",
      label: "Siap Diambil",
      value: ready,
      hint: "Tunggu pemesan datang",
      Icon: CheckCircle2,
      alert: false,
      alertTone: "",
    },
    {
      key: "ACTIVE",
      label: "Antrean Aktif",
      value: active,
      hint: "Antre + dibordir + siap",
      Icon: ClipboardList,
      alert: false,
      alertTone: "",
    },
    {
      key: "LOW_STOCK",
      label: "Stok Menipis",
      value: lowStock,
      hint: lowStock > 0 ? "Perlu restock" : "Semua stok aman",
      Icon: PackageX,
      alert: lowStock > 0,
      alertTone: "border-amber-400 bg-amber-50 text-amber-950",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ key, label, value, hint, Icon, alert, alertTone }) => {
        const isSelected = selected === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            aria-pressed={isSelected}
            className={`text-left rounded-2xl border-2 p-3 sm:p-4 transition-colors ${
              alert ? alertTone : "border-slate-border bg-white text-slate-ink hover:border-slate-400"
            } ${isSelected ? "ring-4 ring-brand/25" : ""}`}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold">{label}</span>
              <Icon className="w-5 h-5 shrink-0 opacity-80" />
            </span>
            <span className="block text-3xl font-extrabold tabular-nums mt-1">{value}</span>
            <span className={`block text-xs sm:text-sm ${alert ? "opacity-90" : "text-slate-muted"}`}>{hint}</span>
          </button>
        );
      })}
    </div>
  );
}
