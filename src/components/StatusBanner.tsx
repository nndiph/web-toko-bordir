import { AlertTriangle, FlaskConical } from "lucide-react";

export function DemoBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="bg-amber-950/40 border border-amber-600/40 text-amber-200 rounded-xl px-4 py-3 flex items-start gap-3 text-xs sm:text-sm backdrop-blur-xs">
      <FlaskConical className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
      <p>
        <strong className="text-amber-300">Mode Demo:</strong>{" "}
        {children ?? "Supabase belum terhubung, data di halaman ini adalah simulasi dan tidak tersimpan di server."}
      </p>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="bg-rose-950/40 border border-rose-600/40 text-rose-200 rounded-xl px-4 py-3 flex items-start gap-3 text-xs sm:text-sm backdrop-blur-xs"
    >
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
      <p>{message}</p>
    </div>
  );
}
