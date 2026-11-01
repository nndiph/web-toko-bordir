"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Send, ArrowRight, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DemoBanner, ErrorBanner } from "@/components/StatusBanner";
import { createOrder } from "@/lib/data/orders";
import type { OrderType } from "@/types";

export default function OrderPage() {
  const [formData, setFormData] = useState({
    name: "",
    rank: "",
    whatsapp: "",
    orderType: "PANGKAT" as OrderType,
    quantity: "2",
    notes: "",
  });

  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const whatsappLast4 = formData.whatsapp.replace(/\D/g, "").slice(-4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Nomor tiket dibuat oleh database (atau lokal bila Mode Demo)
      const result = await createOrder({
        customerName: formData.name,
        customerRank: formData.rank,
        whatsappNumber: formData.whatsapp,
        orderType: formData.orderType,
        quantity: Number(formData.quantity),
        notes: formData.notes,
      });
      setIsDemo(result.demo);
      setSubmittedTicket(result.ticket);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Pesanan gagal disimpan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Halo Pemilik Toko Gaperta, saya telah mengisi formulir pesanan custom bordir.\n\n` +
      `*Nomor Tiket:* ${submittedTicket}\n` +
      `*Nama Pemesan:* ${formData.name} ${formData.rank ? `(${formData.rank})` : ""}\n` +
      `*Jenis Bordir:* ${formData.orderType}\n` +
      `*Jumlah:* ${formData.quantity}\n` +
      `*Catatan/Teks:* ${formData.notes}\n\n` +
      `Mohon dikonfirmasi pengerjaannya. Terima kasih!`
  );

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {submittedTicket ? (
          /* ─── Layar Konfirmasi Sukses ─── */
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-8 text-center">
            {isDemo && (
              <div className="text-left">
                <DemoBanner>Pesanan ini hanya contoh dan tidak tersimpan di database.</DemoBanner>
              </div>
            )}
            <div className="w-14 h-14 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Pesanan Custom Bordir Berhasil Didaftarkan!
              </h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto">
                Nomor Tiket Pesanan Anda telah dibuat otomatis. Simpan nomor ini untuk melacak status
                bordir atau saat mengambil barang di toko.
              </p>
            </div>

            {/* Box Nomor Tiket */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 max-w-md mx-auto space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
                Nomor Tiket Pesanan Anda
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-army">
                  {submittedTicket}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 text-gray-500 hover:text-gray-900 bg-white border border-gray-300 rounded-lg shadow-xs transition-colors"
                  title="Salin nomor tiket"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <p className="text-xs text-emerald-700 font-semibold">Tersalin ke clipboard!</p>}
              <p className="text-xs text-gray-500">
                Untuk melacak pesanan, siapkan nomor tiket ini dan 4 digit terakhir WhatsApp Anda
                (<strong className="font-mono text-gray-900">{whatsappLast4}</strong>).
              </p>
            </div>

            {/* Rincian Singkat */}
            <div className="border-t border-b border-gray-200 py-4 max-w-md mx-auto text-left text-xs sm:text-sm space-y-1.5 text-gray-600">
              <p>
                <strong className="text-gray-900">Pemesan:</strong> {formData.name}{" "}
                {formData.rank && `(${formData.rank})`}
              </p>
              <p>
                <strong className="text-gray-900">WhatsApp:</strong> {formData.whatsapp}
              </p>
              <p>
                <strong className="text-gray-900">Jenis:</strong> {formData.orderType} • {formData.quantity} pcs
              </p>
              <p>
                <strong className="text-gray-900">Catatan:</strong> {formData.notes || "-"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-army hover:bg-army-dark text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Tiket ke WhatsApp Toko</span>
              </a>

              <Link
                href={`/tracking?ticket=${submittedTicket}&wa=${whatsappLast4}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-xs"
              >
                <span>Lacak Status Pesanan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* ─── Formulir Pemesanan ─── */
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-8">
            <div className="border-b border-gray-200 pb-6 space-y-2">
              <span className="inline-block text-xs font-semibold text-army uppercase tracking-wider">
                Layanan Khusus Dinas & Satuan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Formulir Pemesanan Custom Bordir
              </h2>
              <p className="text-sm text-gray-600">
                Isi form di bawah ini agar pesanan bordir nama dada, badge pangkat, lokasi, atau emblem Anda
                langsung tercatat rapi di antrean sistem toko tanpa terselip.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && <ErrorBanner message={submitError} />}
              {/* Row 1: Nama & Pangkat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Nama Lengkap Pemesan <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Contoh: Bambang Irawan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-gray-900 placeholder:text-gray-400 shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="rank" className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Pangkat / Kesatuan (Opsional)
                  </label>
                  <input
                    id="rank"
                    type="text"
                    placeholder="Contoh: Serka / Yonif 100"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-gray-900 placeholder:text-gray-400 shadow-xs"
                  />
                </div>
              </div>

              {/* Row 2: WhatsApp & Jumlah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="whatsapp" className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    required
                    minLength={8}
                    maxLength={20}
                    placeholder="Contoh: 081234567890"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-gray-900 placeholder:text-gray-400 shadow-xs"
                  />
                  <p className="text-xs text-gray-500">Konfirmasi selesai akan dikirim ke nomor ini.</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="quantity" className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Jumlah Pesanan (Pcs / Pasang) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-gray-900 placeholder:text-gray-400 shadow-xs"
                  />
                </div>
              </div>

              {/* Pilihan Jenis Bordir */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Pilih Kategori Bordir <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "PANGKAT", label: "Badge Pangkat" },
                    { id: "NAMA_DADA", label: "Nama Dada" },
                    { id: "LOKASI", label: "Lokasi / Satuan" },
                    { id: "EMBLEM", label: "Emblem / Logo" },
                  ].map((type) => {
                    const isSelected = formData.orderType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, orderType: type.id as OrderType })}
                        className={`text-xs sm:text-sm py-2.5 px-3 rounded-lg font-semibold border transition-all text-center ${
                          isSelected
                            ? "bg-army text-white border-army shadow-xs"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Catatan Khusus & Teks Bordir */}
              <div className="space-y-1.5">
                <label htmlFor="notes" className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Rincian Teks Bordir, Warna Benang, & Bahan Kain <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="notes"
                  required
                  maxLength={1000}
                  rows={4}
                  placeholder="Contoh: Tulisan nama 'AHMAD FAUZI', benang hitam timbul tebal, dasar kain loreng Malvinas, ukuran standar PDL."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-gray-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-gray-900 placeholder:text-gray-400 shadow-xs"
                />
              </div>

              {/* Panduan Alur Singkat */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3 text-xs text-gray-600">
                <ShieldCheck className="w-5 h-5 text-army shrink-0 mt-0.5" />
                <p>
                  <strong className="text-gray-900">Catatan Pengambilan:</strong> Setelah form dikirim dan dikonfirmasi pemilik toko,
                  Anda atau bawahan yang ditugaskan dapat langsung mengambil hasil bordir di toko fisik Gaperta
                  cukup dengan menyebutkan Nomor Tiket Pesanan.
                </p>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-army hover:bg-army-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "Menyimpan pesanan..." : "Daftarkan Pesanan & Dapatkan Nomor Tiket"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <p>© 2026 Toko Gaperta — Atribut Dinas & Bordir Komputer. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}
