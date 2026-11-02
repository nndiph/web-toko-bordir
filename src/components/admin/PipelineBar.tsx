"use client";

import { CheckCircle2, Clock, RefreshCw } from "lucide-react";

export type PipelineStage = "PENDING" | "IN_PROGRESS" | "READY";

interface PipelineBarProps {
  counts: Record<PipelineStage, number>;
  selected: string;
  onSelect: (stage: PipelineStage) => void;
}

const STAGES: Array<{
  key: PipelineStage;
  label: string;
  sub: string;
  tone: {
    active: string;
    idle: string;
    dot: string;
    badge: string;
  };
  Icon: typeof Clock;
}> = [
  {
    key: "PENDING",
    label: "Antre di Mesin",
    sub: "Menunggu giliran",
    tone: {
      active: "border-amber-500 bg-amber-50/80 text-amber-950 ring-2 ring-amber-500/20",
      idle: "border-slate-border bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50/30",
      dot: "bg-amber-500",
      badge: "bg-amber-100 text-amber-800",
    },
    Icon: Clock,
  },
  {
    key: "IN_PROGRESS",
    label: "Sedang Dibordir",
    sub: "Proses jarum/mesin",
    tone: {
      active: "border-sky-500 bg-sky-50/80 text-sky-950 ring-2 ring-sky-500/20",
      idle: "border-slate-border bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50/30",
      dot: "bg-sky-500",
      badge: "bg-sky-100 text-sky-800",
    },
    Icon: RefreshCw,
  },
  {
    key: "READY",
    label: "Siap Diambil",
    sub: "Tersedia di etalase",
    tone: {
      active: "border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20",
      idle: "border-slate-border bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/30",
      dot: "bg-emerald-500",
      badge: "bg-emerald-100 text-emerald-800",
    },
    Icon: CheckCircle2,
  },
];

export function PipelineBar({ counts, selected, onSelect }: PipelineBarProps) {
  const total = counts.PENDING + counts.IN_PROGRESS + counts.READY;

  return (
    <div className="space-y-3">
      {/* 3 Kartu Tahapan Visual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STAGES.map((s) => {
          const isSelected = selected === s.key;
          const count = counts[s.key];
          const Icon = s.Icon;

          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onSelect(s.key)}
              className={`rounded-2xl border p-4 text-left transition-all shadow-2xs ${
                isSelected ? s.tone.active : s.tone.idle
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                  <span className={`w-2 h-2 rounded-full ${s.tone.dot}`} />
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{s.label}</span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold tabular-nums ${s.tone.badge}`}
                >
                  {count}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{s.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Batang Proporsi Antrean */}
      {total > 0 && (
        <div className="space-y-1">
          <div className="flex h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
            {counts.PENDING > 0 && (
              <div
                className="bg-amber-500 transition-all"
                style={{ width: `${(counts.PENDING / total) * 100}%` }}
                title={`Antre: ${counts.PENDING}`}
              />
            )}
            {counts.IN_PROGRESS > 0 && (
              <div
                className="bg-sky-500 transition-all"
                style={{ width: `${(counts.IN_PROGRESS / total) * 100}%` }}
                title={`Dibordir: ${counts.IN_PROGRESS}`}
              />
            )}
            {counts.READY > 0 && (
              <div
                className="bg-emerald-500 transition-all"
                style={{ width: `${(counts.READY / total) * 100}%` }}
                title={`Siap: ${counts.READY}`}
              />
            )}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
            <span>Total antrean aktif: {total} pesanan</span>
            <span>Klik kartu di atas untuk filter cepat</span>
          </div>
        </div>
      )}
    </div>
  );
}
