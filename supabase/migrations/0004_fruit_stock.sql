-- Stock rows for the fresh-fruit range added alongside the mango boxes.
insert into public.product_stock (product_id, stock) values
  ('guava-large', 100),
  ('apricot-250g', 100),
  ('cherries-large', 100),
  ('karela-large', 100),
  ('jamun', 100),
  ('watermelon-large', 100)
on conflict (product_id) do nothing;
