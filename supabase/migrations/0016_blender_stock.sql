-- New franchise-kit product (Blender) — seeded at 0 like every other
-- addition; enable in the admin Stock panel once ready to sell.
insert into public.product_stock (product_id, stock) values
  ('blender', 0)
on conflict (product_id) do nothing;
