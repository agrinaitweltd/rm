-- Stock rows for the newly added Big Pineapple and Pura Vida Golden Pear.
insert into public.product_stock (product_id, stock) values
  ('pineapple-large', 100),
  ('golden-pear', 100)
on conflict (product_id) do nothing;
