-- Bring all mango box products back in stock (everything else stays frozen
-- at 0 until re-enabled separately).
update public.product_stock set stock = 50, updated_at = now()
where product_id in ('small-1', 'small-2', 'small-3', 'medium-1', 'medium-2', 'large-1', 'large-1-20off');
