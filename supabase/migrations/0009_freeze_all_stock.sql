-- New products (White Mooli, Large Box of Aubergine, Spinach, Large Box of
-- Ginger) seeded at 0 — prices for Spinach/Ginger are still to be confirmed.
insert into public.product_stock (product_id, stock) values
  ('mooli-white', 0),
  ('aubergine-large-box', 0),
  ('spinach', 0),
  ('ginger-large-box', 0)
on conflict (product_id) do nothing;

-- Full stock freeze: every product goes to 0 until re-enabled tomorrow.
update public.product_stock set stock = 0, updated_at = now();
