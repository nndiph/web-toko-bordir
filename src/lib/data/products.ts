import { supabase, isSupabaseConfigured, isNetworkError } from "@/lib/supabase";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import {
  adjustStoredStock,
  getStoredProducts,
  setStoredProducts,
} from "@/lib/local-store";
import type { Product, StockStatus } from "@/types";

export interface Loaded<T> {
  data: T;
  /** true = data contoh lokal karena Supabase belum dikonfigurasi atau offline. */
  demo: boolean;
}

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  status: StockStatus;
  rack_location: string;
  description: string | null;
  image_url: string | null;
  categories: { name: string; slug: string } | null;
}

const PRODUCT_COLUMNS =
  "id, name, slug, price, stock, status, rack_location, description, image_url, categories(name, slug)";

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.categories?.slug ?? "",
    categoryName: row.categories?.name ?? "",
    price: row.price,
    stock: row.stock,
    status: row.status,
    rackLocation: row.rack_location,
    description: row.description ?? undefined,
    imageUrl: row.image_url ?? undefined,
  };
}

/**
 * Daftar produk untuk katalog publik dan Kasir Quick-Check.
 * Demo mode: cek LocalStorage dulu, baru pakai DEMO_PRODUCTS sebagai seed.
 */
export async function getProducts(): Promise<Loaded<Product[]>> {
  if (!isSupabaseConfigured) {
    // Ambil dari LocalStorage (mungkin sudah dimodifikasi kasir di /admin)
    const stored = getStoredProducts();
    if (stored) {
      return { data: stored, demo: true };
    }
    // Pertama kali: seed LocalStorage dengan DEMO_PRODUCTS
    setStoredProducts(DEMO_PRODUCTS);
    return { data: DEMO_PRODUCTS, demo: true };
  }

  try {
    const { data, error } = await supabase.from("products").select(PRODUCT_COLUMNS).order("name");
    if (error) {
      if (isNetworkError(error)) {
        console.warn("Koneksi Supabase offline/gagal. Beralih otomatis ke data demo.");
        const stored = getStoredProducts();
        if (stored) return { data: stored, demo: true };
        setStoredProducts(DEMO_PRODUCTS);
        return { data: DEMO_PRODUCTS, demo: true };
      }
      throw new Error(`Gagal memuat produk: ${error.message}`);
    }
    return { data: (data as unknown as ProductRow[]).map(mapProduct), demo: false };
  } catch (err) {
    if (isNetworkError(err)) {
      console.warn("Koneksi Supabase offline/gagal (catch). Beralih otomatis ke data demo.");
      const stored = getStoredProducts();
      if (stored) return { data: stored, demo: true };
      setStoredProducts(DEMO_PRODUCTS);
      return { data: DEMO_PRODUCTS, demo: true };
    }
    throw err;
  }
}

/**
 * Tambah/kurang stok secara atomik.
 * - Supabase online → RPC adjust_stock di PostgreSQL.
 * - Demo mode → update LocalStorage.
 */
export async function adjustStock(
  productId: string,
  delta: number
): Promise<{ stock: number; status: StockStatus }> {
  if (!isSupabaseConfigured) {
    const result = adjustStoredStock(productId, delta);
    if (!result) throw new Error("Produk tidak ditemukan di store demo.");
    return result;
  }

  try {
    const { data, error } = await supabase.rpc("adjust_stock", {
      p_product_id: productId,
      p_delta: delta,
    });
    if (error) {
      if (isNetworkError(error)) {
        throw new Error("Gagal terhubung ke database. Pastikan koneksi atau server database aktif.");
      }
      throw new Error(`Gagal mengubah stok: ${error.message}`);
    }

    const row = data as { stock: number | null; status: StockStatus | null } | null;
    if (!row || row.stock === null || row.status === null) {
      throw new Error("Gagal mengubah stok: produk tidak ditemukan atau akun tidak punya izin admin.");
    }
    return { stock: row.stock, status: row.status };
  } catch (err) {
    if (isNetworkError(err)) {
      throw new Error("Gagal terhubung ke database. Pastikan koneksi atau server database aktif.");
    }
    throw err;
  }
}
