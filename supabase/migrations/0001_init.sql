-- ============================================================================
-- Toko Gaperta — Skema awal (Fase 5)
-- Jalankan di Supabase Dashboard > SQL Editor, lalu jalankan supabase/seed.sql
--
-- Model akses:
--   * Publik (anon)  : baca katalog, buat pesanan (RPC create_order),
--                      lacak pesanan (RPC track_order). Tidak bisa baca tabel orders.
--   * Admin          : user Supabase Auth dengan app_metadata.role = 'admin'.
--                      Jadikan akun admin dengan SQL berikut (ganti email):
--
--     update auth.users
--        set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
--      where email = 'pemilik@contoh.com';
--
--   Matikan "Allow new users to sign up" di Authentication > Providers > Email.
-- ============================================================================

-- ─── Enum ───────────────────────────────────────────────────────────────────
create type public.stock_status as enum ('TERSEDIA', 'HABIS', 'PRE_ORDER', 'CUSTOM');
create type public.order_status as enum ('PENDING', 'IN_PROGRESS', 'READY', 'COMPLETED');
create type public.order_type   as enum ('NAMA_DADA', 'PANGKAT', 'LOKASI', 'EMBLEM', 'LAINNYA');

-- ─── Helper: apakah pemanggil admin? ────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

-- ─── Helper: updated_at otomatis ────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── categories ─────────────────────────────────────────────────────────────
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ─── products ───────────────────────────────────────────────────────────────
create table public.products (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.categories (id) on update cascade,
  name          text not null,
  slug          text not null unique,
  price         integer not null check (price >= 0),
  stock         integer not null default 0 check (stock >= 0),
  status        public.stock_status not null default 'TERSEDIA',
  rack_location text not null default '',
  description   text,
  image_url     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index products_category_id_idx on public.products (category_id);

-- TERSEDIA/HABIS selalu mengikuti stok. CUSTOM & PRE_ORDER tidak diubah.
create or replace function public.products_sync_status()
returns trigger
language plpgsql
as $$
begin
  if new.status in ('TERSEDIA', 'HABIS') then
    new.status = case
      when new.stock = 0 then 'HABIS'::public.stock_status
      else 'TERSEDIA'::public.stock_status
    end;
  end if;
  return new;
end;
$$;

create trigger products_sync_status
  before insert or update of stock, status on public.products
  for each row execute function public.products_sync_status();

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ─── orders ─────────────────────────────────────────────────────────────────
create table public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text not null unique,
  customer_name  text not null check (char_length(customer_name) between 1 and 100),
  customer_rank  text check (char_length(customer_rank) <= 100),
  whatsapp       text not null check (char_length(whatsapp) between 8 and 20),
  order_type     public.order_type not null,
  quantity       integer not null check (quantity between 1 and 10000),
  notes          text not null check (char_length(notes) between 1 and 1000),
  status         public.order_status not null default 'PENDING',
  estimated_done text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index orders_status_created_at_idx on public.orders (status, created_at);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- Penghitung nomor tiket harian (tidak diekspos ke klien).
create table public.order_counters (
  day         date primary key,
  last_number integer not null default 0
);

-- ─── RPC: buat pesanan (publik) ─────────────────────────────────────────────
-- Satu-satunya jalur anon untuk menambah pesanan. Nomor tiket dibuat di server:
-- GPT-YYYYMMDD-NNN (hari mengikuti zona Asia/Jakarta).
create or replace function public.create_order(
  p_customer_name text,
  p_customer_rank text,
  p_whatsapp      text,
  p_order_type    public.order_type,
  p_quantity      integer,
  p_notes         text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day    date := (now() at time zone 'Asia/Jakarta')::date;
  v_number integer;
  v_ticket text;
begin
  insert into public.order_counters as c (day, last_number)
  values (v_day, 1)
  on conflict (day) do update set last_number = c.last_number + 1
  returning c.last_number into v_number;

  v_ticket := 'GPT-' || to_char(v_day, 'YYYYMMDD') || '-' || lpad(v_number::text, 3, '0');

  insert into public.orders (
    order_number, customer_name, customer_rank, whatsapp, order_type, quantity, notes
  ) values (
    v_ticket,
    btrim(p_customer_name),
    nullif(btrim(coalesce(p_customer_rank, '')), ''),
    btrim(p_whatsapp),
    p_order_type,
    p_quantity,
    btrim(p_notes)
  );

  return v_ticket;
end;
$$;

-- ─── RPC: lacak pesanan (publik) ────────────────────────────────────────────
-- Perlu nomor tiket DAN 4 digit terakhir WhatsApp. Nomor WhatsApp lengkap
-- tidak pernah dikembalikan.
create or replace function public.track_order(
  p_ticket    text,
  p_wa_suffix text
)
returns table (
  order_number   text,
  customer_name  text,
  customer_rank  text,
  order_type     public.order_type,
  quantity       integer,
  notes          text,
  status         public.order_status,
  estimated_done text,
  created_at     timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select o.order_number, o.customer_name, o.customer_rank, o.order_type,
         o.quantity, o.notes, o.status, o.estimated_done, o.created_at
    from public.orders o
   where o.order_number = upper(btrim(p_ticket))
     and char_length(regexp_replace(coalesce(p_wa_suffix, ''), '\D', '', 'g')) = 4
     and right(regexp_replace(o.whatsapp, '\D', '', 'g'), 4)
         = regexp_replace(p_wa_suffix, '\D', '', 'g')
   limit 1;
$$;

-- ─── RPC: tambah/kurang stok (admin; tunduk pada RLS) ───────────────────────
create or replace function public.adjust_stock(p_product_id uuid, p_delta integer)
returns public.products
language sql
security invoker
as $$
  update public.products
     set stock = greatest(0, stock + p_delta)
   where id = p_product_id
  returning *;
$$;

-- ─── Row Level Security ─────────────────────────────────────────────────────
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.orders         enable row level security;
alter table public.order_counters enable row level security;

-- categories & products: publik boleh baca, admin boleh kelola
create policy "categories_select_public" on public.categories
  for select to anon, authenticated using (true);
create policy "categories_admin_all" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "products_select_public" on public.products
  for select to anon, authenticated using (true);
create policy "products_admin_all" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- orders: hanya admin. Publik lewat RPC security definer di atas.
create policy "orders_admin_all" on public.orders
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- order_counters: tanpa policy = tertutup untuk semua kecuali security definer.

-- ─── Hak eksekusi fungsi ────────────────────────────────────────────────────
revoke all on function public.create_order(text, text, text, public.order_type, integer, text) from public;
revoke all on function public.track_order(text, text) from public;
revoke all on function public.adjust_stock(uuid, integer) from public;

grant execute on function public.create_order(text, text, text, public.order_type, integer, text) to anon, authenticated;
grant execute on function public.track_order(text, text) to anon, authenticated;
grant execute on function public.adjust_stock(uuid, integer) to authenticated;
