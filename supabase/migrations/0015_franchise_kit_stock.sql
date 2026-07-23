-- New "Mango Shakes Franchise" category — equipment/supplies kit sold to
-- franchisees. Seeded at 0 like every other addition; enable in the admin
-- Stock panel once ready to sell.
insert into public.product_stock (product_id, stock) values
  ('mixing-bowls-lids', 0),
  ('collapsible-colander', 0),
  ('knife-set-ceramic', 0),
  ('straws-pack', 0),
  ('whipped-cream', 0),
  ('franchise-sugar', 0),
  ('cups-50', 0),
  ('lids-50', 0),
  ('mango-sauce', 0)
on conflict (product_id) do nothing;
