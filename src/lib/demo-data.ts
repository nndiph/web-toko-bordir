import type { CustomOrder, Product } from "@/types";

/**
 * Data contoh untuk Mode Demo (dipakai hanya bila env Supabase belum diisi).
 * Isinya cerminan supabase/seed.sql.
 */

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=70`;

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Pangkat Bordir TNI AD - Serda (Timbul)",
    slug: "pangkat-serda-tni-ad",
    category: "pangkat",
    categoryName: "Badge & Pangkat",
    price: 35000,
    stock: 24,
    status: "TERSEDIA",
    rackLocation: "Rak A-02 (Etalase Depan)",
    imageUrl: img("1579273166152-d725a4e2b755"),
  },
  {
    id: "2",
    name: "Kopel Rim Hitam Standard TNI",
    slug: "kopel-rim-hitam-tni",
    category: "sabuk",
    categoryName: "Sabuk & Kopel",
    price: 75000,
    stock: 15,
    status: "TERSEDIA",
    rackLocation: "Rak B-01 (Aksesoris)",
    imageUrl: img("1553062407-98eeb64c6a62"),
  },
  {
    id: "3",
    name: "Seragam PDL Loreng Malvinas Size L",
    slug: "seragam-pdl-malvinas-l",
    category: "seragam",
    categoryName: "Seragam PDL/PDH",
    price: 250000,
    stock: 0,
    status: "HABIS",
    rackLocation: "Gudang Belakang",
    imageUrl: img("1542272604-787c3835535d"),
  },
  {
    id: "4",
    name: "Badge Nama Dada Bordir Komputer",
    slug: "badge-nama-dada-bordir",
    category: "bordir",
    categoryName: "Pesanan Custom",
    price: 15000,
    stock: 100,
    status: "CUSTOM",
    rackLocation: "Mesin Bordir Toko",
    imageUrl: img("1584308666744-24d5c474f2ae"),
  },
  {
    id: "5",
    name: "Baret Hijau Kostrad + Emblem Logam",
    slug: "baret-hijau-kostrad",
    category: "topi",
    categoryName: "Topi & Baret",
    price: 110000,
    stock: 8,
    status: "TERSEDIA",
    rackLocation: "Rak C-03 (Topi & Baret)",
    imageUrl: img("1521369909029-2afed882baee"),
  },
  {
    id: "6",
    name: "Sabuk Kopral Kepala Gesper Kuningan",
    slug: "sabuk-kopral-gesper-kuningan",
    category: "sabuk",
    categoryName: "Sabuk & Kopel",
    price: 45000,
    stock: 12,
    status: "TERSEDIA",
    rackLocation: "Rak B-02 (Sisi Depan)",
    imageUrl: img("1624222247344-550fb60583dc"),
  },
  {
    id: "7",
    name: "Pangkat Bordir TNI AD - Kapten (Timbul Emas)",
    slug: "pangkat-kapten-tni-ad",
    category: "pangkat",
    categoryName: "Badge & Pangkat",
    price: 45000,
    stock: 18,
    status: "TERSEDIA",
    rackLocation: "Rak A-03 (Pangkat Perwira)",
    imageUrl: img("1607604276583-eef5d076aa5f"),
  },
  {
    id: "8",
    name: "Badge Lokasi KODAM I / Bukit Barisan",
    slug: "badge-lokasi-kodam-bb",
    category: "bordir",
    categoryName: "Pesanan Custom",
    price: 12500,
    stock: 45,
    status: "TERSEDIA",
    rackLocation: "Rak A-01 (Badge Lokasi)",
    imageUrl: img("1596755094514-f87e34085b2c"),
  },
];

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

/** Dibuat saat dipanggil agar usia pesanan selalu relatif terhadap "sekarang". */
export function getDemoOrders(): CustomOrder[] {
  return [
    {
      id: "1",
      orderNumber: "GPT-20261101-038",
      customerName: "Lettu Danang",
      customerRank: "Yonif 100",
      whatsappNumber: "081198765432",
      orderType: "PANGKAT",
      quantity: 6,
      notes: "Pangkat PDU & PDL timbul tebal, dasar hijau TNI benang emas.",
      status: "PENDING",
      createdAt: hoursAgo(5 * 24 + 2), // lewat 3 hari → alert kartu merah
      estimatedDone: "Sedang dijadwalkan ulang oleh pemilik toko",
    },
    {
      id: "2",
      orderNumber: "GPT-20261101-040",
      customerName: "Kapten Suryo",
      customerRank: "Kodam I/BB",
      whatsappNumber: "081288990011",
      orderType: "LOKASI",
      quantity: 10,
      notes: "Bordir lokasi dinas timbul dasar loreng Malvinas.",
      status: "PENDING",
      createdAt: hoursAgo(4 * 24 + 3), // lewat 3 hari → alert kartu merah
    },
    {
      id: "3",
      orderNumber: "GPT-20261101-042",
      customerName: "Serka Bambang",
      customerRank: "Kopassus",
      whatsappNumber: "081234567890",
      orderType: "PANGKAT",
      quantity: 4,
      notes: "Benang hitam timbul tebal, dasar kain loreng Malvinas.",
      status: "IN_PROGRESS",
      createdAt: hoursAgo(30),
      estimatedDone: "Sedang dibordir di mesin",
    },
    {
      id: "4",
      orderNumber: "GPT-20261101-045",
      customerName: "Kopda Hendra",
      customerRank: "Kodam I/BB",
      whatsappNumber: "081311223344",
      orderType: "NAMA_DADA",
      quantity: 2,
      notes: "Tulisan 'HENDRA S.', kain hijau standar dinas.",
      status: "READY",
      createdAt: hoursAgo(3),
      estimatedDone: "Sudah selesai — Siap diambil di toko",
    },
  ];
}
