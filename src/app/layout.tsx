import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toko Gaperta — Atribut Dinas & Bordir Komputer TNI",
  description:
    "Verifikasi ketersediaan stok fisik etalase toko dan antrean mesin bordir nama dada, pangkat timbul, serta lencana kesatuan dinas TNI Medan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-body antialiased bg-console-ground text-console-textPrimary selection:bg-console-gold selection:text-black">
        {children}
      </body>
    </html>
  );
}
