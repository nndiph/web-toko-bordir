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
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {submittedTicket ? (
          /* ─── Layar Konfirmasi Sukses ─── */
          <div className="bg-white border border-army-border/80 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
                Pesanan Custom Bordir Berhasil Didaftarkan!
              </h2>
              <p className="text-sm sm:text-base text-ink-muted max-w-lg mx-auto">
                Nomor Tiket Pesanan Anda telah dibuat otomatis. Simpan nomor ini untuk melacak status
                bordir atau saat mengambil barang di toko.
              </p>
            </div>

            {/* Box Nomor Tiket */}
            <div className="bg-surface-muted border border-army-border rounded-xl p-5 max-w-md mx-auto space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-ink-muted">
                Nomor Tiket Pesanan Anda
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-army">
                  {submittedTicket}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 text-ink-muted hover:text-army bg-white border border-army-border rounded-lg shadow-sm transition-colors"
                  title="Salin nomor tiket"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <p className="text-xs text-green-700 font-semibold">Tersalin ke clipboard!</p>}
            </div>

            {/* Rincian Singkat */}
            <div className="border-t border-b border-army-border/60 py-4 max-w-md mx-auto text-left text-xs sm:text-sm space-y-1.5 text-ink-muted">
              <p>
                <strong className="text-ink">Pemesan:</strong> {formData.name}{" "}
                {formData.rank && `(${formData.rank})`}
              </p>
              <p>
                <strong className="text-ink">WhatsApp:</strong> {formData.whatsapp}
              </p>
              <p>
                <strong className="text-ink">Jenis:</strong> {formData.orderType} • {formData.quantity}
              </p>
              <p>
                <strong className="text-ink">Catatan:</strong> {formData.notes || "-"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={`https://wa.me/6281234567890?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-army hover:bg-army-dark text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors shadow"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Tiket ke WhatsApp Toko</span>
              </a>

              <Link
                href={`/tracking?ticket=${submittedTicket}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-ink font-bold px-6 py-3 rounded-lg text-sm transition-colors shadow"
              >
                <span>Lacak Status Pesanan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* ─── Formulir Pemesanan ─── */
          <div className="bg-white border border-army-border/80 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
            <div className="border-b border-army-border/60 pb-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-army-light text-army text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Bordir Komputer Presisi
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
                Formulir Pemesanan Custom Bordir
              </h2>
              <p className="text-sm text-ink-muted">
                Isi form di bawah ini agar pesanan bordir nama dada, badge pangkat, lokasi, atau emblem Anda
                langsung tercatat rapi di antrean sistem toko tanpa terselip.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Nama & Pangkat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Nama Lengkap Pemesan <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Contoh: Bambang Irawan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-army-border px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army text-ink placeholder:text-ink-soft shadow-sm"
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
                    className="w-full bg-white border border-army-border px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army text-ink placeholder:text-ink-soft shadow-sm"
                  />
                </div>
              </div>

              {/* Row 2: WhatsApp & Jumlah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="whatsapp" className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-white border border-army-border px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army text-ink placeholder:text-ink-soft shadow-sm"
                  />
                  <p className="text-xs text-ink-soft">Foto hasil bordir & konfirmasi selesai akan dikirim ke nomor ini.</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="quantity" className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Jumlah Pesanan (Pcs / Pasang) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-white border border-army-border px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army text-ink placeholder:text-ink-soft shadow-sm"
                  />
                </div>
              </div>

              {/* Pilihan Jenis Bordir */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                  Pilih Kategori Bordir <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "PANGKAT", label: "Badge Pangkat" },
                    { id: "NAMA_DADA", label: "Nama Dada" },
                    { id: "LOKASI", label: "Lokasi / Satuan" },
                    { id: "EMBLEM", label: "Emblem / Logo" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, orderType: type.id as OrderType })}
                      className={`text-xs sm:text-sm py-2.5 px-3 rounded-lg font-semibold border transition-all text-center ${
                        formData.orderType === type.id
                          ? "bg-army text-white border-army shadow-sm"
                          : "bg-white text-ink border-army-border hover:bg-surface-muted"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catatan Khusus & Teks Bordir */}
              <div className="space-y-1.5">
                <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-ink">
                  Rincian Teks Bordir, Warna Benang, & Bahan Kain <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="notes"
                  required
                  rows={4}
                  placeholder="Contoh: Tulisan nama 'AHMAD FAUZI', benang hitam timbul tebal, dasar kain loreng Malvinas, ukuran standar PDL."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-army-border px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-army text-ink placeholder:text-ink-soft shadow-sm"
                />
              </div>

              {/* Panduan Alur Singkat */}
              <div className="bg-surface-muted border border-army-border/60 rounded-xl p-4 flex items-start gap-3 text-xs text-ink-muted">
                <ShieldCheck className="w-5 h-5 text-army shrink-0 mt-0.5" />
                <p>
                  <strong>Catatan Pengambilan:</strong> Setelah form dikirim dan dikonfirmasi pemilik toko,
                  Anda atau bawahan yang ditugaskan dapat langsung mengambil hasil bordir di toko fisik Gaperta
                  cukup dengan menyebutkan Nomor Tiket Pesanan.
                </p>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                className="w-full bg-army hover:bg-army-dark text-white font-bold py-3.5 rounded-lg text-sm transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Daftarkan Pesanan & Dapatkan Nomor Tiket</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-army-border/60 py-6 text-center text-xs text-ink-muted">
        <p>© 2026 Toko Gaperta — Atribut Dinas & Bordir Komputer. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}

