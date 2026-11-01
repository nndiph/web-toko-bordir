-- Seed data awal Toko Gaperta. Jalankan SETELAH migrations/0001_init.sql.
-- Aman dijalankan ulang: data yang sudah ada (berdasarkan slug) dilewati.

insert into public.categories (name, slug, sort_order) values
  ('Badge & Pangkat',   'pangkat',  1),
  ('Seragam PDL/PDH',   'seragam',  2),
  ('Sabuk & Kopel',     'sabuk',    3),
  ('Topi & Baret',      'topi',     4),
  ('Pesanan Custom',    'bordir',   5)
on conflict (slug) do nothing;

insert into public.products (category_id, name, slug, price, stock, status, rack_location, image_url)
select c.id, v.name, v.slug, v.price, v.stock, v.status::public.stock_status, v.rack_location, v.image_url
from (values
  ('pangkat', 'Pangkat Bordir TNI AD - Serda (Timbul)',        'pangkat-serda-tni-ad',         35000,  24, 'TERSEDIA', 'Rak A-02 (Etalase Depan)',   'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=400&q=70'),
  ('sabuk',   'Kopel Rim Hitam Standard TNI',                  'kopel-rim-hitam-tni',          75000,  15, 'TERSEDIA', 'Rak B-01 (Aksesoris)',       'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=70'),
  ('seragam', 'Seragam PDL Loreng Malvinas Size L',            'seragam-pdl-malvinas-l',      250000,   0, 'HABIS',    'Gudang Belakang',            'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=70'),
  ('bordir',  'Badge Nama Dada Bordir Komputer',               'badge-nama-dada-bordir',       15000, 100, 'CUSTOM',   'Mesin Bordir Toko',          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=70'),
  ('topi',    'Baret Hijau Kostrad + Emblem Logam',            'baret-hijau-kostrad',         110000,   8, 'TERSEDIA', 'Rak C-03 (Topi & Baret)',    'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=400&q=70'),
  ('sabuk',   'Sabuk Kopral Kepala Gesper Kuningan',           'sabuk-kopral-gesper-kuningan', 45000,  12, 'TERSEDIA', 'Rak B-02 (Sisi Depan)',      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=400&q=70'),
  ('pangkat', 'Pangkat Bordir TNI AD - Kapten (Timbul Emas)',  'pangkat-kapten-tni-ad',        45000,  18, 'TERSEDIA', 'Rak A-03 (Pangkat Perwira)', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=70'),
  ('bordir',  'Badge Lokasi KODAM I / Bukit Barisan',          'badge-lokasi-kodam-bb',        12500,  45, 'TERSEDIA', 'Rak A-01 (Badge Lokasi)',    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=70')
) as v(category_slug, name, slug, price, stock, status, rack_location, image_url)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;
