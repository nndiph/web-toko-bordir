"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Send, ArrowRight, Info, Minus, Plus, KeyRound, Camera } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { DemoBanner, ErrorBanner } from "@/components/StatusBanner";
import { createOrder } from "@/lib/data/orders";
import { STORE, storeWaLink } from "@/lib/store-info";
import type { OrderType } from "@/types";

/** Panduan isian per jenis bordir — supaya kasir tidak perlu tanya ulang lewat WA. */
const ORDER_TYPES: Array<{ id: OrderType; label: string; hint: string; example: string }> = [
  {
    id: "NAMA_DADA",
    label: "Nama Dada",
    hint: "Tulis nama persis seperti yang dibordir, warna dasar kain, dan warna benang.",
    example: "Nama: BUDI SANTOSO\nDasar: loreng Malvinas\nBenang: hitam",
  },
  {
    id: "PANGKAT",
    label: "Badge Pangkat",
    hint: "Sebutkan matra, pangkat, dan model (timbul / datar).",
    example: "Matra: TNI AD\nPangkat: Serda\nModel: timbul benang emas",
  },
  {
    id: "LOKASI",
    label: "Badge Lokasi / Satuan",
    hint: "Tulis nama satuan atau wilayah persis, dan warna dasar.",
    example: "Tulisan: KODAM I/BUKIT BARISAN\nDasar: hijau PDH",
  },
  {
    id: "EMBLEM",
    label: "Emblem / Logo",
    hint: "Sebutkan nama emblem/satuan dan ukuran. Kirim gambar contoh via WA setelah tiket terbit.",
    example: "Emblem: Yonif 125\nUkuran: 8 cm\nGambar menyusul via WA",
  },
  {
    id: "LAINNYA",
    label: "Lainnya",
    hint: "Jelaskan barang yang ingin dibordir dan tulisannya.",
    example: "Bordir nama di topi lapangan: SERTU ANDI",
  },
];

const fieldClass =
  "w-full bg-slate-50 border border-slate-border focus:border-brand focus:bg-white px-4 h-12 rounded-xl text-base text-slate-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/10";
const labelClass = "block text-sm font-bold text-slate-700";

export default function OrderPage() {
  const [formData, setFormData] = useState({
    name: "",
    rank: "",
    whatsapp: "",
    orderType: "NAMA_DADA" as OrderType,
    quantity: 1,
    notes: "",
  });

  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [waTouched, setWaTouched] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const waDigits = formData.whatsapp.replace(/\D/g, "");
  const waValid = waDigits.length >= 10 && waDigits.length <= 14;
  const whatsappLast4 = waDigits.slice(-4);
  const selectedType = ORDER_TYPES.find((t) => t.id === formData.orderType) ?? ORDER_TYPES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!waValid) {
      setWaTouched(true);
      document.getElementById("whatsapp")?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await createOrder({
        customerName: formData.name.trim(),
        customerRank: formData.rank.trim(),
        whatsappNumber: formData.whatsapp,
        orderType: formData.orderType,
        quantity: formData.quantity,
        notes: formData.notes.trim(),
      });
      setIsDemo(result.demo);
      setSubmittedTicket(result.ticket);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Pesanan gagal didaftarkan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!submittedTicket) return;
    navigator.clipboard.writeText(submittedTicket);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setQuantity = (q: number) => setFormData((f) => ({ ...f, quantity: Math.max(1, Math.min(999, q || 1)) }));

  const whatsappMessage =
    `Halo Toko Gaperta, saya sudah daftar pesanan bordir online.\n\n` +
    `*Nomor Tiket:* ${submittedTicket}\n` +
    `*Nama:* ${formData.name}${formData.rank ? ` (${formData.rank})` : ""}\n` +
    `*Jenis:* ${selectedType.label}\n` +
    `*Jumlah:* ${formData.quantity}\n` +
    `*Rincian:*\n${formData.notes}\n\n` +
    `Mohon dikonfirmasi. Terima kasih!`;

  return (
    <div className="min-h-screen bg-slate-canvas text-slate-ink flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {submittedTicket ? (
          /* ─── TIKET TERBIT ─── */
          <div className="bg-white border border-slate-border rounded-3xl p-5 sm:p-10 shadow-sm space-y-6">
            {isDemo && <DemoBanner>Pesanan disimpan di peramban ini saja karena database belum terhubung.</DemoBanner>}

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pesanan Diterima</h1>
              <p className="text-base text-slate-600">
                Simpan dua data di bawah ini. Keduanya dibutuhkan untuk melacak dan mengambil pesanan.
              </p>
            </div>

            {/* Kunci lacak */}
            <div className="border-2 border-dashed border-brand/40 bg-brand-light/40 rounded-2xl p-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-semibold text-slate-600 block">Nomor Tiket</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-brand tracking-wider font-mono select-all break-all">
                    {submittedTicket}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-accent-gold" />
                  <span className="text-sm text-slate-600">4 digit akhir WA:</span>
                  <span className="text-xl font-extrabold font-mono tracking-widest">{whatsappLast4}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="h-11 inline-flex items-center justify-center gap-2 text-sm font-bold bg-white border border-slate-border px-4 rounded-xl hover:bg-slate-50"
              >
                <Copy className="w-4 h-4 text-brand" />
                {copied ? "Tersalin!" : "Salin Tiket"}
              </button>
            </div>

            <p className="flex items-start gap-2 text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <Camera className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Tips:</strong> screenshot layar ini. Kalau disuruh komandan, kirim screenshot ini ke beliau.
              </span>
            </p>

            {/* Ringkasan */}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t border-slate-border pt-5">
              <div>
                <dt className="text-slate-muted">Pemesan</dt>
                <dd className="font-bold">
                  {formData.name}
                  {formData.rank && <span className="font-medium text-slate-600"> · {formData.rank}</span>}
                </dd>
              </div>
              <div>
                <dt className="text-slate-muted">Jenis &amp; jumlah</dt>
                <dd className="font-bold">
                  {selectedType.label} · {formData.quantity} pcs
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-muted">Rincian bordir</dt>
                <dd className="font-medium whitespace-pre-wrap">{formData.notes}</dd>
              </div>
            </dl>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href={`/tracking?ticket=${submittedTicket}&wa=${whatsappLast4}`}
                className="h-12 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl text-base inline-flex items-center justify-center gap-2"
              >
                Pantau Status
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={storeWaLink(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 bg-white hover:bg-slate-50 border border-slate-300 text-slate-ink font-bold rounded-xl text-base inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-brand" />
                Kirim Rincian via WA
              </a>
            </div>

            <p className="text-sm text-slate-muted text-center">
              Ambil di {STORE.address} · {STORE.hours}
            </p>
          </div>
        ) : (
          /* ─── FORMULIR ─── */
          <div className="bg-white border border-slate-border rounded-3xl p-5 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pesan Bordir</h1>
              <p className="text-base text-slate-600">
                Isi 3 langkah di bawah. Setelah dikirim, Anda langsung dapat <strong>nomor tiket</strong> untuk melacak
                pesanan. Bayar saat mengambil di toko.
              </p>
            </div>

            {submitError && <ErrorBanner message={submitError} />}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Langkah 1 */}
              <fieldset className="space-y-4">
                <legend className="text-lg font-extrabold mb-3">
                  <span className="inline-flex w-7 h-7 rounded-full bg-vibrant text-white text-sm items-center justify-center mr-2">
                    1
                  </span>
                  Data Pemesan
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className={labelClass}>
                      Nama lengkap <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Budi Santoso"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={fieldClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="rank" className={labelClass}>
                      Pangkat / Satuan <span className="font-normal text-slate-muted">(boleh kosong)</span>
                    </label>
                    <input
                      id="rank"
                      type="text"
                      placeholder="Serda / Kodam I BB"
                      value={formData.rank}
                      onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                      className={fieldClass}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="whatsapp" className={labelClass}>
                    Nomor WhatsApp aktif <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    inputMode="numeric"
                    required
                    autoComplete="tel"
                    placeholder="0812 3456 7890"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    onBlur={() => setWaTouched(true)}
                    aria-invalid={waTouched && !waValid}
                    aria-describedby="wa-help"
                    className={`${fieldClass} ${waTouched && !waValid ? "border-red-400 bg-red-50" : ""}`}
                  />
                  <p id="wa-help" className={`text-sm ${waTouched && !waValid ? "text-red-700 font-semibold" : "text-slate-muted"}`}>
                    {waTouched && !waValid
                      ? "Nomor WA harus 10–14 angka, contoh 081234567890."
                      : "Kabar bordir selesai dikirim ke nomor ini. 4 angka terakhirnya dipakai untuk melacak."}
                  </p>
                </div>
              </fieldset>

              {/* Langkah 2 */}
              <fieldset className="space-y-3">
                <legend className="text-lg font-extrabold mb-3">
                  <span className="inline-flex w-7 h-7 rounded-full bg-vibrant text-white text-sm items-center justify-center mr-2">
                    2
                  </span>
                  Jenis Bordir
                </legend>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ORDER_TYPES.map((t) => {
                    const checked = formData.orderType === t.id;
                    return (
                      <label
                        key={t.id}
                        className={`flex items-center gap-2 min-h-12 px-3 rounded-xl border-2 cursor-pointer text-sm font-bold transition-colors ${
                          checked ? "border-brand bg-brand-light text-brand" : "border-slate-border hover:border-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="orderType"
                          value={t.id}
                          checked={checked}
                          onChange={() => setFormData({ ...formData, orderType: t.id })}
                          className="accent-[#14381B] w-4 h-4"
                        />
                        {t.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Langkah 3 */}
              <fieldset className="space-y-4">
                <legend className="text-lg font-extrabold mb-3">
                  <span className="inline-flex w-7 h-7 rounded-full bg-vibrant text-white text-sm items-center justify-center mr-2">
                    3
                  </span>
                  Rincian Bordir
                </legend>

                <div className="space-y-1.5">
                  <div className="flex items-end justify-between gap-2">
                    <label htmlFor="notes" className={labelClass}>
                      Tulisan &amp; spesifikasi <span className="text-red-600">*</span>
                    </label>
                    {!formData.notes && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, notes: selectedType.example })}
                        className="text-sm font-bold text-brand hover:underline"
                      >
                        Pakai contoh
                      </button>
                    )}
                  </div>
                  <p className="flex items-start gap-1.5 text-sm text-slate-600">
                    <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    {selectedType.hint}
                  </p>
                  <textarea
                    id="notes"
                    required
                    rows={4}
                    placeholder={selectedType.example}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className={`${fieldClass} h-auto py-3 leading-relaxed`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="quantity" className={labelClass}>
                    Jumlah (pcs / set) <span className="text-red-600">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(formData.quantity - 1)}
                      disabled={formData.quantity <= 1}
                      aria-label="Kurangi jumlah"
                      className="w-12 h-12 rounded-xl border border-slate-border bg-white flex items-center justify-center disabled:opacity-40"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={999}
                      required
                      value={formData.quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-24 h-12 bg-slate-50 border border-slate-border focus:border-brand focus:bg-white rounded-xl text-center text-lg font-extrabold text-slate-ink focus:outline-none focus:ring-2 focus:ring-brand/10"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(formData.quantity + 1)}
                      aria-label="Tambah jumlah"
                      className="w-12 h-12 rounded-xl border border-slate-border bg-white flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </fieldset>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-vibrant hover:bg-vibrant-hover text-white font-bold rounded-xl text-base transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-vibrant/20"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pesanan & Dapatkan Tiket"}
                  {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                </button>
                <p className="text-sm text-slate-muted text-center">
                  Estimasi selesai 1–2 hari kerja. Tidak ada pembayaran online.
                </p>
              </div>
            </form>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
