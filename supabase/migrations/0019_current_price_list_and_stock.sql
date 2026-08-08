-- Current fruit and veg price list. Everything not listed below is marked
-- sold out; listed products start with 100 units and can be adjusted in Admin.
update public.product_stock set stock = 0, updated_at = now();

insert into public.product_stock (product_id, stock) values
  ('small-1', 100),
  ('medium-1', 100),
  ('medium-2', 100),
  ('guava-large', 100),
  ('tomato-box', 100),
  ('premium-punjabi-gur', 100),
  ('mint-bunch', 100),
  ('garlic-paste-1kg', 100),
  ('ginger-paste-1kg', 100),
  ('chilli-bird-eye', 100),
  ('chilli-bullet-box', 100),
  ('cherries-1kg', 100), ('cherries-box', 100),
  ('watermelon-each', 100), ('watermelon-3', 100),
  ('red-grapes-bunch', 100), ('red-grapes-box', 100),
  ('peach-each', 100), ('peach-box', 100),
  ('plum-each', 100), ('plum-box', 100),
  ('nectarine-each', 100), ('nectarine-box', 100),
  ('melon-each', 100), ('melon-2', 100),
  ('black-grapes-bunch', 100), ('black-grapes-box', 100),
  ('white-grapes-bunch', 100), ('white-grapes-box', 100),
  ('golden-pear-each', 100), ('golden-pear-box12', 100),
  ('mushrooms-box', 100), ('mushrooms-2-boxes', 100),
  ('green-red-pepper-box', 100), ('green-red-pepper-2-boxes', 100),
  ('lettuce-each', 100), ('lettuce-2', 100),
  ('spinach-each', 100), ('spinach-2', 100),
  ('okra-kg', 100), ('okra-box', 100), ('okra-2-boxes', 100),
  ('big-orange-each', 100), ('big-orange-box', 100), ('big-orange-2-boxes', 100),
  ('red-onion-10kg', 100), ('red-onion-2-boxes', 100),
  ('bombay-onion-each', 100), ('bombay-onion-2', 100)
on conflict (product_id) do update
  set stock = excluded.stock, updated_at = now();
