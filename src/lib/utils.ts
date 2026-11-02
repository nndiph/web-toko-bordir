import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Selisih hari penuh antara waktu ISO dan sekarang (minimal 0). */
export function daysSince(iso: string, now: number = Date.now()): number {
  return Math.max(0, Math.floor((now - new Date(iso).getTime()) / MS_PER_DAY));
}

/** Contoh: "1 Nov 2026 14.20 WIB" (zona Asia/Jakarta). */
export function formatOrderDate(iso: string): string {
  const text = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
  return `${text} WIB`;
}

/** "Hari ini", "Kemarin", atau "N hari lalu". */
export function ageLabel(days: number): string {
  if (days <= 0) return "Hari ini";
  if (days === 1) return "Kemarin";
  return `${days} hari lalu`;
}

/** Nomor WhatsApp lokal (08xx, boleh ada strip/spasi) atau 62xx menjadi format wa.me (62xx). */
export function toWaNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  return `62${digits.replace(/^0+/, "")}`;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

