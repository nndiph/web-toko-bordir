import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toko Gaperta — Atribut Dinas & Bordir Komputer TNI",
  description:
    "Cek ketersediaan stok fisik perlengkapan dinas dan pesan custom bordir komputer nama dada, pangkat, serta lokasi dinas TNI Medan tanpa antre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased bg-slate-canvas text-slate-ink selection:bg-brand selection:text-white">
        {children}
      </body>
    </html>
  );
}
