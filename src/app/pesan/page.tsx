"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Send, ArrowRight, Scissors, Info } from "lucide-react";
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
      `*Spesifikasi/Teks:* ${formData.notes}\n\n` +
      `Mohon dikonfirmasi pengerjaannya. Terima kasih!`
  );

  return (
    <div className="min-h-screen bg-slate-canvas text-slate-ink flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {submittedTicket ? (
          /* ─── TIKET KONFIRMASI CERAH ─── */
          <div className="bg-white border border-slate-border rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-center">
            {isDemo && (
              <div className="text-left">
                <DemoBanner>Pesanan disimulasikan dalam mode demo karena server database belum terhubung.</DemoBanner>
              </div>
            )}

            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Antrean Mesin Digital Terdaftar
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-ink tracking-tight">
                Pesanan Custom Bordir Diterima!
              </h1>
              <p className="text-sm text-slate-muted max-w-lg mx-auto leading-relaxed">
                Nomor Tiket Pesanan resmi telah dibuat. Simpan nomor ini untuk melacak status pengerjaan atau saat
                pengambilan barang di toko fisik Jl. Gaperta Medan.
              </p>
            </div>

            {/* Ticket Box */}
            <div className="bg-slate-50 border border-slate-border rounded-2xl p-6 max-w-md mx-auto space-y-3">
              <span className="text-xs font-bold text-slate-muted uppercase tracking-wider block">
                Nomor Tiket Pesanan Anda
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand tracking-wider select-all font-mono">
                {submittedTicket}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-ink bg-white border border-slate-border px-4 py-2 rounded-lg transition-colors shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5 text-brand" />
                <span>{copied ? "Berhasil Disalin!" : "Salin Nomor Tiket"}</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
              <a
                href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-brand hover:bg-brand-hover text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-xs inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Konfirmasi via WA</span>
              </a>

              <Link
                href={`/tracking?ticket=${submittedTicket}&wa=${whatsappLast4}`}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-ink font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors border border-slate-border inline-flex items-center justify-center gap-2"
              >
                <span>Pantau Antrean</span>
                <ArrowRight className="w-4 h-4 text-brand" />
              </Link>
            </div>

            <p className="text-xs text-slate-400 pt-4 border-t border-slate-border max-w-md mx-auto">
              Tunjukkan nomor tiket ini ke kasir toko saat mengambil barang di Jl. Gaperta Medan.
            </p>
          </div>
        ) : (
          /* ─── FORMULIR PEMESANAN CERAH ─── */
          <div className="bg-white border border-slate-border rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-brand text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
                <Scissors className="w-3.5 h-3.5" />
                <span>Bordir Komputer Presisi Standar Mabes</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-ink tracking-tight">
                Formulir Pesanan Custom Bordir
              </h1>
              <p className="text-sm text-slate-muted max-w-2xl leading-relaxed">
                Isi data di bawah untuk memesan bordir nama dada, badge pangkat dinas, lambang korps, atau emblem
                kesatuan tanpa antre panjang di toko fisik Medan.
              </p>
            </div>

            {submitError && <ErrorBanner message={submitError} />}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nama Pemesan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nama Lengkap Pemesan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-border focus:border-brand focus:bg-white px-4 py-3 rounded-xl text-sm text-slate-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all"
                  />
                </div>

                {/* Pangkat / NRP */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pangkat / NRP / Satuan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Serda / Kodam I BB"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-border focus:border-brand focus:bg-white px-4 py-3 rounded-xl text-sm text-slate-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nomor WhatsApp */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-border focus:border-brand focus:bg-white px-4 py-3 rounded-xl text-sm text-slate-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all"
                  />
                  <span className="text-[11px] text-slate-muted block">
                    Notifikasi selesai bordir akan dikirimkan ke nomor ini.
                  </span>
                </div>

                {/* Jenis Bordir */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Jenis Pesanan Bordir <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.orderType}
                    onChange={(e) => setFormData({ ...formData, orderType: e.target.value as OrderType })}
                    className="w-full bg-slate-50 border border-slate-border focus:border-brand focus:bg-white px-4 py-3 rounded-xl text-sm text-slate-ink focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all"
                  >
                    <option value="PANGKAT">Badge Pangkat Timbul</option>
                    <option value="NAMA_DADA">Nama Dada Bordir</option>
                    <option value="LOKASI">Badge Lokasi / Satuan</option>
                    <option value="EMBLEM">Emblem / Logo Satuan</option>
                    <option value="LAINNYA">Lainnya (Custom Khusus)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {/* Jumlah */}
                <div className="sm:col-span-1 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Jumlah (Set/Pcs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-border focus:border-brand focus:bg-white px-4 py-3 rounded-xl text-sm text-slate-ink focus:outline-none focus:ring-2 focus:ring-brand/10 font-bold"
                  />
                </div>

                {/* Catatan / Teks */}
                <div className="sm:col-span-3 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Teks Bordir &amp; Spesifikasi Khusus <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Contoh: Tulisan nama: 'BUDI SANTOSO', font Arial tebal, dasar kain loreng malvinas, bordir timbul benang emas."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-border focus:border-brand focus:bg-white px-4 py-3 rounded-xl text-sm text-slate-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/10 leading-relaxed"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-border p-4 rounded-xl flex items-center gap-3 text-xs text-slate-600">
                <Info className="w-5 h-5 text-brand shrink-0" />
                <span>
                  Pesanan langsung masuk ke antrean mesin digital Toko Gaperta. Estimasi selesai pengerjaan standar
                  1–2 hari kerja.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand hover:bg-brand-hover active:scale-[0.99] text-white font-bold py-4 rounded-xl text-sm transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "Mendaftarkan Antrean..." : "Daftarkan Pesanan Bordir Sekarang"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
