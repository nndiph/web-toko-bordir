import { CheckCircle2, Clock, RefreshCw } from "lucide-react";

export type PipelineStage = "PENDING" | "IN_PROGRESS" | "READY";

interface PipelineBarProps {
  counts: Record<PipelineStage, number>;
  selected: string;
  onSelect: (stage: PipelineStage) => void;
}

const STAGES: {
  id: PipelineStage;
  label: string;
  hint: string;
  Icon: typeof Clock;
  idle: string;
  active: string;
  bar: string;
}[] = [
  {
    id: "PENDING",
    label: "Antre",
    hint: "Menunggu dikerjakan",
    Icon: Clock,
    idle: "bg-white border-gray-200 hover:border-amber-300",
    active: "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20",
    bar: "bg-amber-500",
  },
  {
    id: "IN_PROGRESS",
    label: "Dibordir",
    hint: "Sedang di mesin",
    Icon: RefreshCw,
    idle: "bg-white border-gray-200 hover:border-blue-300",
    active: "bg-blue-50 border-blue-600 ring-2 ring-blue-600/20",
    bar: "bg-blue-600",
  },
  {
    id: "READY",
    label: "Siap diambil",
    hint: "Menunggu pemesan",
    Icon: CheckCircle2,
    idle: "bg-white border-gray-200 hover:border-emerald-300",
    active: "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20",
    bar: "bg-emerald-600",
  },
];

/** Alur proses 3 tahap. Tiap tahap bisa diklik sebagai filter; batang di bawah menunjukkan proporsi. */
export function PipelineBar({ counts, selected, onSelect }: PipelineBarProps) {
  const total = counts.PENDING + counts.IN_PROGRESS + counts.READY;

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {STAGES.map(({ id, label, hint, Icon, idle, active }) => {
          const isSelected = selected === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-pressed={isSelected}
              className={`text-left rounded-xl border p-3 sm:p-4 transition-colors ${isSelected ? active : idle}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-600">
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </div>
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-gray-900 tabular-nums leading-none">
                {counts[id]}
              </div>
              <div className="mt-1 hidden sm:block text-[11px] text-gray-500">{hint}</div>
            </button>
          );
        })}
      </div>

      <div
        className="flex h-2 w-full overflow-hidden rounded-full bg-gray-100"
        role="img"
        aria-label={`Proporsi antrean: ${counts.PENDING} antre, ${counts.IN_PROGRESS} dibordir, ${counts.READY} siap diambil`}
      >
        {total > 0 &&
          STAGES.map(({ id, bar }) =>
            counts[id] > 0 ? (
              <div key={id} className={bar} style={{ width: `${(counts[id] / total) * 100}%` }} />
            ) : null
          )}
      </div>
    </div>
  );
}
