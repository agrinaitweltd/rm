-- New household/pantry products (Granulated Sugar, Blue Roll x3 tiers,
-- XL Kitchen Towel x3 tiers) — seeded at 0 like every other new addition;
-- enable in the admin Stock panel once ready to sell.
insert into public.product_stock (product_id, stock) values
  ('granulated-sugar', 0),
  ('blue-roll', 0),
  ('blue-roll-pack6', 0),
  ('blue-roll-case50', 0),
  ('kitchen-towel-xl', 0),
  ('kitchen-towel-xl-pack6', 0),
  ('kitchen-towel-xl-case50', 0)
on conflict (product_id) do nothing;
