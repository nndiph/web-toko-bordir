"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Send, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";

type OrderType = "NAMA_DADA" | "PANGKAT" | "LOKASI" | "EMBLEM" | "LAINNYA";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate Nomor Tiket Pesanan Otomatis
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newTicketNumber = `GPT-${dateStr}-${randomSuffix}`;

    setSubmittedTicket(newTicketNumber);
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
          /* ─── Layar Konfirmasi Sukses Voucher ─── */
          <div className="bg-white border border-surface-border rounded-3xl p-6 sm:p-12 shadow-card space-y-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Pendaftaran Berhasil
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight pt-2">
                Pesanan Custom Bordir Terdaftar!
              </h2>
              <p className="text-sm text-ink-muted">
                Nomor Tiket Pesanan resmi Anda telah dibuat. Simpan nomor ini untuk melacak progres bordir atau saat mengambil pesanan di toko fisik.
              </p>
            </div>

            {/* Voucher Box Nomor Tiket */}
            <div className="bg-gradient-to-b from-slate-50 to-slate-100/70 border border-surface-border rounded-2xl p-6 max-w-md mx-auto space-y-3 shadow-xs">
              <span className="text-xs uppercase font-bold tracking-wider text-ink-muted">
                Nomor Tiket Pesanan
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-army tracking-wider">
                  {submittedTicket}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 text-ink-muted hover:text-army bg-white border border-surface-border rounded-xl shadow-xs hover:border-slate-300 transition-all"
                  title="Salin nomor tiket"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-emerald-700 font-bold animate-in fade-in duration-150">
                  ✓ Berhasil disalin ke clipboard!
                </p>
              )}
            </div>

            {/* Rincian Singkat Pesanan */}
            <div className="border border-surface-border bg-slate-50/50 rounded-2xl p-5 max-w-md mx-auto text-left text-xs sm:text-sm space-y-2 text-ink-body">
              <div className="flex justify-between py-1 border-b border-surface-border/60">
                <span className="text-ink-muted">Pemesan:</span>
                <span className="font-bold text-ink">
                  {formData.name} {formData.rank && `(${formData.rank})`}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border/60">
                <span className="text-ink-muted">WhatsApp:</span>
                <span className="font-semibold text-ink">{formData.whatsapp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-border/60">
                <span className="text-ink-muted">Jenis & Jumlah:</span>
                <span className="font-semibold text-ink">
                  {formData.orderType} • {formData.quantity} pcs
                </span>
              </div>
              <div className="py-1">
                <span className="text-ink-muted block mb-1">Catatan Khusus:</span>
                <p className="bg-white p-2.5 rounded-lg border border-surface-border text-ink text-xs font-medium">
                  {formData.notes || "-"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-army hover:bg-army-dark active:scale-[0.98] text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md shadow-army/20"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Tiket ke WhatsApp Toko</span>
              </a>

              <Link
                href={`/tracking?ticket=${submittedTicket}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-ink font-bold px-6 py-3.5 rounded-xl text-sm transition-all border border-surface-border"
              >
                <span>Lacak Status Bordir</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* ─── Formulir Pemesanan ─── */
          <div className="bg-white border border-surface-border rounded-3xl p-6 sm:p-10 shadow-card space-y-8">
            <div className="border-b border-surface-border pb-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-army/10 text-army text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
                Bordir Komputer Bergaransi Presisi
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Formulir Pemesanan Custom Bordir
              </h1>
              <p className="text-sm text-ink-muted">
                Isi rincian di bawah ini agar pesanan nama dada, badge pangkat, lokasi, atau emblem Anda langsung masuk ke antrean pengerjaan mesin bordir toko Gaperta.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Nama & Pangkat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Nama Lengkap Pemesan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Contoh: Bambang Irawan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-surface-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-ink placeholder:text-ink-soft shadow-xs transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="rank" className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Pangkat / Kesatuan (Opsional)
                  </label>
                  <input
                    id="rank"
                    type="text"
                    placeholder="Contoh: Serka / Yonif 100"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    className="w-full bg-white border border-surface-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-ink placeholder:text-ink-soft shadow-xs transition-all"
                  />
                </div>
              </div>

              {/* Row 2: WhatsApp & Jumlah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="whatsapp" className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-white border border-surface-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-ink placeholder:text-ink-soft shadow-xs transition-all"
                  />
                  <p className="text-[11px] text-ink-muted">Foto hasil jadi bordir akan dikirimkan ke nomor ini.</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="quantity" className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Jumlah Pesanan (Pcs / Pasang) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-white border border-surface-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-ink placeholder:text-ink-soft shadow-xs transition-all"
                  />
                </div>
              </div>

              {/* Pilihan Kategori Bordir */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                  Pilih Kategori Bordir <span className="text-rose-500">*</span>
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
                        className={`text-xs sm:text-sm py-3 px-3 rounded-xl font-semibold border transition-all text-center ${
                          isSelected
                            ? "bg-army text-white border-army shadow-sm shadow-army/20"
                            : "bg-white text-ink-body border-surface-border hover:bg-surface-muted hover:border-slate-300"
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
                <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-ink">
                  Rincian Teks Bordir, Warna Benang, & Bahan Kain <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="notes"
                  required
                  rows={4}
                  placeholder="Contoh: Tulisan nama 'AHMAD FAUZI', benang hitam timbul tebal, dasar kain loreng Malvinas, ukuran standar PDL."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-surface-border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-army/20 focus:border-army text-ink placeholder:text-ink-soft shadow-xs transition-all"
                />
              </div>

              {/* Panduan Alur Singkat */}
              <div className="bg-slate-50 border border-surface-border rounded-2xl p-4 flex items-start gap-3 text-xs text-ink-muted">
                <ShieldCheck className="w-5 h-5 text-army shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-ink">Prosedur Pengambilan:</strong> Setelah pesanan didaftarkan, Anda atau anggota/bawahan yang ditugaskan komandan cukup menunjukkan <strong>Nomor Tiket Pesanan</strong> di kasir toko saat mengambil barang.
                </p>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                className="w-full bg-army hover:bg-army-dark active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-army/20 flex items-center justify-center gap-2"
              >
                <span>Daftarkan Pesanan & Dapatkan Nomor Tiket</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-surface-border py-6 text-center text-xs text-ink-muted">
        <p>© 2026 Toko Gaperta — Atribut Dinas & Bordir Komputer. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}
