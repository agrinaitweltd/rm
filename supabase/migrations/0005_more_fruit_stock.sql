-- Stock rows for the additional fresh-fruit range.
insert into public.product_stock (product_id, stock) values
  ('khubani-large-apricot', 100),
  ('kishmish-small-grapes', 100),
  ('lychee-large-box', 100),
  ('jackfruit-peeled-200g', 100),
  ('dragon-fruit', 100)
on conflict (product_id) do nothing;
