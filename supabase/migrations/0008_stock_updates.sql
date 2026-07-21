-- Mark out-of-stock items per the July stock update.
update public.product_stock
   set stock = 0, updated_at = now()
 where product_id in (
   'medium-1',
   'medium-2',
   'large-1',
   'large-1-20off',
   'bananas-bunch',
   'melon-galia',
   'melon-yellow',
   'jackfruit-peeled-200g',
   'dragon-fruit',
   'chilli-bullet-box',
   'lychee-large-box'
 );
