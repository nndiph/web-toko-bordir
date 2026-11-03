/** Info toko fisik — satu tempat agar nomor WA/alamat tidak tersebar di banyak file. */
export const STORE = {
  name: "Toko Gaperta Medan",
  address: "Jl. Gaperta No. 12, Medan Helvetia, Kota Medan",
  hours: "Senin – Sabtu, 08.00 – 20.00 WIB",
  waNumber: "6281234567890",
} as const;

/** Link wa.me ke kasir toko, opsional dengan pesan awal. */
export function storeWaLink(message?: string): string {
  const base = `https://wa.me/${STORE.waNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
