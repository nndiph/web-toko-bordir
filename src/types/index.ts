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
  category: string;
  price: number;
  stock: number;
  status: StockStatus;
  rackLocation: string; // contoh: "Rak A-02"
  description?: string;
  imageUrl?: string;
}

export type OrderStatus = "PENDING" | "IN_PROGRESS" | "READY" | "COMPLETED";

export interface CustomOrder {
  id: string;
  orderNumber: string; // contoh: "GPT-20261101-042"
  customerName: string;
  customerRank?: string; // pangkat (Serka, Kopda, dll)
  whatsappNumber: string;
  orderType: "NAMA_DADA" | "PANGKAT" | "LOKASI" | "EMBLEM" | "LAINNYA";
  quantity: number;
  notes: string;
  status: OrderStatus;
  createdAt: string;
  estimatedDone?: string;
}

