import { AlertTriangle, FlaskConical } from "lucide-react";

export function DemoBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-3 flex items-start gap-3 text-xs sm:text-sm">
      <FlaskConical className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
      <div>
        <span className="font-bold">Mode Demo: </span>
        <span>
          {children ?? "Supabase belum terhubung. Seluruh data pada tampilan ini adalah simulasi stok fisik."}
        </span>
      </div>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="bg-red-50 border border-red-200 text-red-900 rounded-xl px-4 py-3 flex items-start gap-3 text-xs sm:text-sm"
    >
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-700" />
      <div>
        <span className="font-bold">Peringatan: </span>
        <span>{message}</span>
      </div>
    </div>
  );
}
