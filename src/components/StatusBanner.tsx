import { AlertTriangle, FlaskConical } from "lucide-react";

export function DemoBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="bg-console-surface border border-console-gold/40 text-console-textPrimary px-4 py-3 flex items-start gap-3 text-xs font-mono">
      <FlaskConical className="w-4 h-4 mt-0.5 shrink-0 text-console-gold" />
      <div>
        <span className="text-console-gold font-bold uppercase tracking-wider">MODE DEMO OPERASIONAL: </span>
        <span className="text-console-textSecondary">
          {children ?? "Database offline / belum terhubung. Seluruh data pada tampilan ini adalah simulasi stok fisik."}
        </span>
      </div>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="bg-console-surface border border-console-red/60 text-console-textPrimary px-4 py-3 flex items-start gap-3 text-xs font-mono"
    >
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-console-red" />
      <div>
        <span className="text-console-red font-bold uppercase tracking-wider">SYSTEM ALERT: </span>
        <span className="text-console-textSecondary">{message}</span>
      </div>
    </div>
  );
}
