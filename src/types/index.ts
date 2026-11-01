export type StockStatus = "TERSEDIA" | "HABIS" | "PRE_ORDER" | "CUSTOM";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string; // slug kategori, contoh: "pangkat"
  categoryName: string; // nama tampilan, contoh: "Badge & Pangkat"
  price: number;
  stock: number;
  status: StockStatus;
  rackLocation: string; // contoh: "Rak A-02"
  description?: string;
  imageUrl?: string;
}

export type OrderStatus = "PENDING" | "IN_PROGRESS" | "READY" | "COMPLETED";
export type OrderType = "NAMA_DADA" | "PANGKAT" | "LOKASI" | "EMBLEM" | "LAINNYA";

export interface CustomOrder {
  id: string;
  orderNumber: string; // contoh: "GPT-20261101-042"
  customerName: string;
  customerRank?: string; // pangkat (Serka, Kopda, dll)
  whatsappNumber: string;
  orderType: OrderType;
  quantity: number;
  notes: string;
  status: OrderStatus;
  createdAt: string; // ISO 8601
  estimatedDone?: string;
}

/** Input form pemesanan publik. */
export interface NewOrderInput {
  customerName: string;
  customerRank?: string;
  whatsappNumber: string;
  orderType: OrderType;
  quantity: number;
  notes: string;
}

/** Hasil pelacakan publik. Sengaja tanpa nomor WhatsApp. */
export interface TrackedOrder {
  orderNumber: string;
  customerName: string;
  customerRank?: string;
  orderType: OrderType;
  quantity: number;
  notes: string;
  status: OrderStatus;
  estimatedDone?: string;
  createdAt: string; // ISO 8601
}
