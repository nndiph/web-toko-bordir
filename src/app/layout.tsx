import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toko Gaperta — Atribut Dinas & Bordir Custom TNI",
  description:
    "Cek ketersediaan stok perlengkapan dinas dan pesan custom bordir komputer nama dada, pangkat, serta lokasi dinas tanpa antre panjang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased bg-surface text-ink selection:bg-army/15 selection:text-army min-h-screen">
        {children}
      </body>
    </html>
  );
}
