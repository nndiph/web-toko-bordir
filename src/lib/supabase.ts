import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** false = env belum diisi, aplikasi berjalan dalam Mode Demo (data lokal, tidak tersimpan). */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("placeholder")
);

/** Helper untuk mendeteksi error akibat kegagalan jaringan atau server offline. */
export function isNetworkError(err: unknown): boolean {
  if (!err) return false;
  const msg =
    typeof err === "object" && err !== null && "message" in err
      ? String((err as { message: unknown }).message)
      : String(err);

  const lower = msg.toLowerCase();
  return (
    lower.includes("failed to fetch") ||
    lower.includes("fetch failed") ||
    lower.includes("networkerror") ||
    lower.includes("econnrefused") ||
    lower.includes("connection refused") ||
    lower.includes("aborted") ||
    lower.includes("timeout") ||
    lower.includes("err_connection_refused")
  );
}

// Custom fetch dengan timeout 4 detik untuk mencegah aplikasi menggantung jika backend offline
const fetchWithTimeout: typeof fetch = async (input, init) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(input, {
      ...init,
      signal: init?.signal ? AbortSignal.any([init.signal, controller.signal]) : controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: fetchWithTimeout,
    },
  }
);
