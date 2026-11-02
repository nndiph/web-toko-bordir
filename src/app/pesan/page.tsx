"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Send, ArrowRight, Sparkles, Scissors, Info } from "lucide-react";
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
      setSubmitError(err instanceof Error ? err.message : "Pesanan gagal didaftarkan. Coba lagi.");
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
    `Halo Toko Gaperta, saya telah mendaftarkan pesanan custom bordir secara online.\n\n` +
      `*Nomor Tiket:* ${submittedTicket}\n` +
      `*Nama Pemesan:* ${formData.name} ${formData.rank ? `(${formData.rank})` : ""}\n` +
      `*Jenis Bordir:* ${formData.orderType}\n` +
      `*Jumlah:* ${formData.quantity}\n` +
      `*Catatan/Teks:* ${formData.notes}\n\n` +
      `Mohon dikonfirmasi pengerjaannya. Terima kasih!`
  );

  return (
    <div className="min-h-screen bg-tactical-950 text-gray-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {submittedTicket ? (
          /* ─── Layar Konfirmasi Sukses Taktis ─── */
          <div className="bg-tactical-900 border border-tactical-700 rounded-3xl p-6 sm:p-12 shadow-2xl space-y-8 text-center relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-24 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

            {isDemo && (
              <div className="text-left relative z-10">
                <DemoBanner>Pesanan ini disimulasikan dalam mode demo karena backend belum aktif.</DemoBanner>
              </div>
            )}

            <div className="w-16 h-16 bg-tactical-850 border border-emerald-500/40 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg relative z-10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2 relative z-10">
              <span className="text-xs font-black uppercase tracking-widest text-gold bg-tactical-800 border border-gold-dark/40 px-3 py-1 rounded-full">
                Antrean Mesin Terdaftar
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                Pesanan Custom Bordir Diterima!
              </h2>
              <p className="text-sm text-gray-400 max-w-lg mx-auto">
                Nomor Tiket Pesanan resmi telah dibuat. Simpan nomor ini untuk melacak status pengerjaan atau saat pengambilan di toko fisik.
              </p>
            </div>

            {/* Box Nomor Tiket */}
            <div className="bg-tactical-950 border border-tactical-700 rounded-2xl p-6 max-w-md mx-auto space-y-4 shadow-inner relative z-10">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 block">
                Nomor Tiket Pesanan Anda
              </span>
              <div className="text-2xl sm:text-3xl font-black text-gold tracking-wider select-all font-mono">
                {submittedTicket}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white bg-tactical-850 border border-tactical-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-gold" />
                <span>{copied ? "Berhasil Disalin!" : "Salin Nomor Tiket"}</span>
              </button>
            </div>

            {/* Tindakan Lanjutan */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto relative z-10">
              <a
                href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:brightness-110 text-white font-extrabold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-950/40 inline-flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>Konfirmasi via WA</span>
              </a>

              <Link
                href={`/tracking?ticket=${submittedTicket}&wa=${whatsappLast4}`}
                className="flex-1 bg-tactical-800 hover:bg-tactical-700 border border-tactical-600 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Pantau Antrean</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>

            <div className="pt-4 text-xs text-gray-500 border-t border-tactical-800 max-w-md mx-auto">
              Tunjukkan nomor tiket ini ke kasir toko saat mengambil barang di Jl. Gaperta Medan.
            </div>
          </div>
        ) : (
          /* ─── Formulir Pemesanan Custom Bordir Taktis ─── */
          <div className="space-y-8">
            <div className="bg-tactical-900 border border-tactical-700 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-tactical-850 border border-tactical-700 text-gold-light text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  <Scissors className="w-3.5 h-3.5 text-gold" />
                  <span>Bordir Komputer Presisi Tinggi</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                  Formulir Pesanan Custom Bordir
                </h1>
                <p className="text-sm text-gray-300 max-w-2xl">
                  Isi data di bawah untuk memesan bordir nama dada, badge pangkat dinas, lambang korps, atau emblem kesatuan tanpa antre di toko fisik Medan.
                </p>
              </div>

              {submitError && (
                <div className="mt-6">
                  <ErrorBanner message={submitError} />
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Nama Pemesan */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-300">
                      Nama Lengkap Pemesan <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-tactical-950 border border-tactical-700 focus:border-gold px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>

                  {/* Pangkat / Korps */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-300">
                      Pangkat / NRP / Satuan (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Serda / Kodam I BB"
                      value={formData.rank}
                      onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                      className="w-full bg-tactical-950 border border-tactical-700 focus:border-gold px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Nomor WhatsApp */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-300">
                      Nomor WhatsApp Aktif <span className="text-gold">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full bg-tactical-950 border border-tactical-700 focus:border-gold px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                    <p className="text-[11px] text-gray-400">
                      Notifikasi selesai bordir akan dikirimkan ke nomor ini.
                    </p>
                  </div>

                  {/* Jenis Bordir */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-300">
                      Jenis Pesanan Bordir <span className="text-gold">*</span>
                    </label>
                    <select
                      value={formData.orderType}
                      onChange={(e) => setFormData({ ...formData, orderType: e.target.value as OrderType })}
                      className="w-full bg-tactical-950 border border-tactical-700 focus:border-gold px-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/20"
                    >
                      <option value="PANGKAT">Badge Pangkat Timbul</option>
                      <option value="NAMA_DADA">Nama Dada Bordir</option>
                      <option value="LOKASI">Badge Lokasi / Satuan</option>
                      <option value="EMBLEM">Emblem / Logo Satuan</option>
                      <option value="LAINNYA">Lainnya (Custom Khusus)</option>
                    </select>
                  </div>
                </div>

                {/* Jumlah & Catatan Detail */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  <div className="sm:col-span-1 space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-300">
                      Jumlah (Pcs/Set) <span className="text-gold">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full bg-tactical-950 border border-tactical-700 focus:border-gold px-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/20 font-bold"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-300">
                      Teks Bordir & Spesifikasi Khusus <span className="text-gold">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Contoh: Tulisan nama: 'BUDI SANTOSO', font Arial tebal, dasar kain loreng malvinas, bordir timbul benang emas."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-tactical-950 border border-tactical-700 focus:border-gold px-4 py-3 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/20 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Jaminan Pengerjaan */}
                <div className="bg-tactical-850 border border-tactical-800 p-4 rounded-2xl flex items-center gap-3 text-xs text-gray-300">
                  <Info className="w-5 h-5 text-gold shrink-0" />
                  <span>
                    Pesanan Anda masuk antrean mesin digital Toko Gaperta. Estimasi selesai pengerjaan standar 1-2 hari kerja.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-gold-dark via-gold to-amber-500 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-white font-black py-4 rounded-xl text-sm transition-all shadow-xl shadow-amber-950/40 uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? "Mendaftarkan Antrean..." : "Daftarkan Pesanan Bordir Sekarang"}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}