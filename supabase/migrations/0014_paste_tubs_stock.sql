-- New pantry products (Garlic Paste, Ginger Paste) — seeded at 0 like every
-- other addition; enable in the admin Stock panel once ready to sell.
insert into public.product_stock (product_id, stock) values
  ('garlic-paste-1kg', 0),
  ('ginger-paste-1kg', 0)
on conflict (product_id) do nothing;
