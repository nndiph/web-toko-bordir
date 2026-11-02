"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Send, ArrowRight } from "lucide-react";
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
      `*Spesifikasi/Catatan:* ${formData.notes}\n\n` +
      `Mohon verifikasi antrean pengerjaan mesin. Terima kasih!`
  );

  return (
    <div className="min-h-screen bg-console-ground text-console-textPrimary flex flex-col font-body">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {submittedTicket ? (
          /* ─── TIKET KONFIRMASI TEKNIS ─── */
          <div className="border border-console-rule bg-console-surface p-6 sm:p-10 space-y-8">
            <div className="border-b border-console-rule pb-4 flex items-center justify-between font-mono text-xs">
              <span className="text-console-green flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-console-green" />
                <span>SYS-ACK // ANTREAN MESIN DIGITAL BERHASIL DIDAFTARKAN</span>
              </span>
              <span className="text-console-textMuted">ENTRY RECORDED</span>
            </div>

            {isDemo && (
              <DemoBanner>
                Tiket ini dibuat dalam simulasi mode demo offline karena server database belum terhubung.
              </DemoBanner>
            )}

            <div className="space-y-2">
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-console-textPrimary uppercase tracking-tight">
                NOMOR TIKET PESANAN RESMI
              </h1>
              <p className="font-mono text-xs text-console-textSecondary max-w-xl">
                Simpan nomor tiket ini. Tunjukkan ke kasir saat pengambilan pesanan bordir di toko fisik Jl. Gaperta Medan.
              </p>
            </div>

            {/* Ticket Box */}
            <div className="border border-console-gold bg-console-ground p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
              <div>
                <span className="text-[10px] text-console-textMuted uppercase tracking-widest block">
                  NOMOR TIKET ANTREAN
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-console-gold tracking-widest select-all">
                  {submittedTicket}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 border border-console-rule hover:border-console-textSecondary bg-console-surface px-4 py-2 text-xs text-console-textPrimary transition-colors uppercase font-mono"
              >
                <Copy className="w-3.5 h-3.5 text-console-gold" />
                <span>{copied ? "BERHASIL DISALIN" : "SALIN TIKET"}</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 font-mono text-xs">
              <a
                href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-console-gold hover:bg-console-goldDark text-black font-heading font-bold py-3 text-center uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>KIRIM NOTIFIKASI KE WA KASIR</span>
              </a>

              <Link
                href={`/tracking?ticket=${submittedTicket}&wa=${whatsappLast4}`}
                className="flex-1 border border-console-rule hover:border-console-gold text-console-textPrimary bg-console-surface py-3 text-center uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 text-xs font-mono"
              >
                <span>PANTAU STATUS ANTREAN</span>
                <ArrowRight className="w-3.5 h-3.5 text-console-gold" />
              </Link>
            </div>
          </div>
        ) : (
          /* ─── DRAFTING REQUISITION FORM ─── */
          <div className="border border-console-rule bg-console-surface p-6 sm:p-10 space-y-8">
            <div className="border-b border-console-rule pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
              <span className="text-console-gold uppercase">REQUISITION FORM // 02 // CUSTOM BORDIR</span>
              <span className="text-console-textMuted">ESTIMASI SELESAI 24–48 JAM</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-console-textPrimary uppercase tracking-tight">
                FORMULIR PESANAN BORDIR KOMPUTER
              </h1>
              <p className="font-mono text-xs text-console-textSecondary max-w-2xl">
                Isi spesifikasi pesanan bordir nama dada, badge pangkat dinas, lokasi kesatuan, atau emblem resmi. Sistem
                akan menerbitkan nomor antrean tiket digital secara langsung.
              </p>
            </div>

            {submitError && <ErrorBanner message={submitError} />}

            <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div className="space-y-2">
                  <label className="block text-[11px] text-console-textSecondary uppercase tracking-wider">
                    NAMA LENGKAP PEMESAN <span className="text-console-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="CONTOH: BUDI SANTOSO"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-console-ground border border-console-rule focus:border-console-gold p-3 text-xs text-console-textPrimary placeholder:text-console-textMuted focus:outline-none uppercase"
                  />
                </div>

                {/* Pangkat / NRP */}
                <div className="space-y-2">
                  <label className="block text-[11px] text-console-textSecondary uppercase tracking-wider">
                    PANGKAT / NRP / SATUAN (OPSIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="CONTOH: SERDA / KODAM I BB"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    className="w-full bg-console-ground border border-console-rule focus:border-console-gold p-3 text-xs text-console-textPrimary placeholder:text-console-textMuted focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* WhatsApp */}
                <div className="space-y-2">
                  <label className="block text-[11px] text-console-textSecondary uppercase tracking-wider">
                    NOMOR WHATSAPP AKTIF <span className="text-console-gold">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="CONTOH: 081234567890"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-console-ground border border-console-rule focus:border-console-gold p-3 text-xs text-console-textPrimary placeholder:text-console-textMuted focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-console-textMuted block">
                    Notifikasi selesai pengerjaan bordir dikirimkan ke nomor ini.
                  </span>
                </div>

                {/* Jenis Pesanan */}
                <div className="space-y-2">
                  <label className="block text-[11px] text-console-textSecondary uppercase tracking-wider">
                    JENIS PESANAN BORDIR <span className="text-console-gold">*</span>
                  </label>
                  <select
                    value={formData.orderType}
                    onChange={(e) => setFormData({ ...formData, orderType: e.target.value as OrderType })}
                    className="w-full bg-console-ground border border-console-rule focus:border-console-gold p-3 text-xs text-console-textPrimary focus:outline-none uppercase"
                  >
                    <option value="PANGKAT">BADGE PANGKAT TIMBUL</option>
                    <option value="NAMA_DADA">NAMA DADA BORDIR</option>
                    <option value="LOKASI">BADGE LOKASI / SATUAN</option>
                    <option value="EMBLEM">EMBLEM / LOGO KESATUAN</option>
                    <option value="LAINNYA">LAINNYA (CUSTOM KHUSUS)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {/* Jumlah */}
                <div className="sm:col-span-1 space-y-2">
                  <label className="block text-[11px] text-console-textSecondary uppercase tracking-wider">
                    JUMLAH (SET/PCS) <span className="text-console-gold">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-console-ground border border-console-rule focus:border-console-gold p-3 text-xs text-console-textPrimary focus:outline-none font-bold"
                  />
                </div>

                {/* Catatan / Teks */}
                <div className="sm:col-span-3 space-y-2">
                  <label className="block text-[11px] text-console-textSecondary uppercase tracking-wider">
                    TEKS BORDIR &amp; SPESIFIKASI KHUSUS <span className="text-console-gold">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="CONTOH: TULISAN: 'BUDI SANTOSO', DASAR LORENG MALVINAS, TIMBUL BENANG EMAS, UKURAN STANDAR MABES."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-console-ground border border-console-rule focus:border-console-gold p-3 text-xs text-console-textPrimary placeholder:text-console-textMuted focus:outline-none uppercase leading-relaxed"
                  />
                </div>
              </div>

              {/* Technical Note */}
              <div className="border border-console-rule bg-console-ground p-4 text-[11px] text-console-textSecondary flex items-center justify-between">
                <span>VERIFIKASI FISIK: PEMBAYARAN DAN PENGAMBILAN DILAKUKAN LANGSUNG DI TOKO MEDAN</span>
                <span className="text-console-gold font-bold">SYARAT &amp; KETENTUAN MABES</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-console-gold hover:bg-console-goldDark text-black font-heading font-bold text-sm tracking-widest uppercase py-3.5 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "MENDAFTARKAN KE MESIN..." : "TERBITKAN TIKET PESANAN BORDIR"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
