import { AlertTriangle, FlaskConical } from "lucide-react";

export function DemoBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-4 py-3 flex items-start gap-3 text-xs sm:text-sm">
      <FlaskConical className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
      <p>
        <strong>Mode Demo:</strong>{" "}
        {children ?? "Supabase belum dikonfigurasi, data di halaman ini hanya contoh dan tidak tersimpan."}
      </p>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="bg-rose-50 border border-rose-200 text-rose-900 rounded-lg px-4 py-3 flex items-start gap-3 text-xs sm:text-sm"
    >
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-rose-700" />
      <p>{message}</p>
    </div>
  );
}
