-- ═══════════════════════════════════════════════════════════════════
-- FULL. — concept catalogue seed
--
-- ⚠ EVERY NUTRITION VALUE IN THIS FILE IS CONCEPT DATA.
--   These are development targets for a formulation that is still in
--   the kitchen. They are pending laboratory analysis and are NOT
--   final, verified label values. Nothing here may be printed on
--   packaging or presented as a nutrition declaration until it has
--   been replaced with lab-analysed figures and `data_status` /
--   `nutrition_facts.status` has been flipped to 'verified'.
--
-- This file mirrors src/lib/products.ts exactly, so the storefront
-- renders identically whether it is reading Supabase or the bundled
-- seed catalogue. If you change one, change the other.
--
-- Safe to re-run: every statement upserts.
-- ═══════════════════════════════════════════════════════════════════

begin;

-- ─── Products ──────────────────────────────────────────────────────

insert into public.products (
  id, slug, name, line, flavor, category, tagline, description, story, love_it,
  price_cents, currency, protein, calories, carbs, fat, fibre,
  prep_minutes, water_ml, serving_weight_g, heat,
  allergens, dietary, accent, active, featured, rank, stripe_price_id, data_status, created_at
) values
(
  'p_mac_cheddar',
  'mac-and-cheese-classic-cheddar',
  'FULL. Mac + Cheese — Classic Cheddar',
  'MAC + CHEESE',
  'Classic Cheddar',
  'mac-and-cheese',
  'The one that started the argument.',
  'Proper cheddar sauce, thick enough to coat the back of a spoon, over short-cut pasta with milk and pea protein worked into the dough. Comfort food macros that read like a chicken breast.',
  array[
    'We rebuilt mac & cheese from the pasta up. Instead of bolting protein powder onto a finished sauce, the protein lives inside the pasta and the cheese base, so the texture stays creamy rather than chalky.',
    'The sauce is built on real aged cheddar and milk protein, thickened with a touch of chickpea flour instead of a wall of starch. That is what keeps 42 g of protein from tasting like a compromise.'
  ],
  array[
    '42 g protein in a bowl of mac & cheese — 8.2 g per 100 kcal.',
    'Aged cheddar first, protein second: no chalk, no squeak.',
    'One pouch, one utensil, three minutes, zero washing up.',
    'Sits in a drawer for months waiting for a bad day.'
  ],
  599, 'EUR', 42, 510, 55, 14, 8,
  3, 260, 118, 0,
  array['Milk', 'Wheat (gluten)', 'Mustard'],
  array['vegetarian', 'high-fibre'],
  'cheddar', true, true, 1, null, 'concept', '2026-01-12T00:00:00Z'
),
(
  'p_mac_jalapeno',
  'mac-and-cheese-spicy-jalapeno',
  'FULL. Mac + Cheese — Spicy Jalapeño',
  'MAC + CHEESE',
  'Spicy Jalapeño',
  'mac-and-cheese',
  'Green heat. No regrets.',
  'The cheddar base with roasted jalapeño, lime and a green chilli hit that builds instead of shouting. Still creamy, still 40 g of protein.',
  array[
    'Roasted jalapeño gives heat with actual flavour behind it — grassy, slightly sweet, a little smoky at the edges.',
    'We balance it with lime and a heavier hand of cheese so the spice sits on top of the sauce rather than replacing it.'
  ],
  array[
    '40 g protein and a heat level that builds to a pleasant burn.',
    'Roasted, not raw: jalapeño flavour first, capsaicin second.',
    'Lime and coriander keep it bright instead of heavy.',
    'The one to keep at the office when lunch options are grim.'
  ],
  599, 'EUR', 40, 500, 53, 14, 8,
  3, 260, 116, 2,
  array['Milk', 'Wheat (gluten)', 'Mustard'],
  array['vegetarian', 'spicy', 'high-fibre'],
  'jalapeno', true, true, 2, null, 'concept', '2026-01-12T00:00:00Z'
),
(
  'p_pasta_tomato',
  'creamy-tomato-pasta',
  'FULL. Pasta — Creamy Tomato',
  'PASTA',
  'Creamy Tomato',
  'pasta',
  'Slow-cooked tomato energy, fast.',
  'Sun-dried tomato and roasted garlic cooked down into a rounded, slightly sweet sauce, loosened with a cream base. 39 g protein, 9 g fibre.',
  array[
    'Tomato sauce is easy to make thin and acidic. We concentrate sun-dried tomato and roast the garlic first, which gives the sweetness that usually takes an hour on the hob.',
    'A light cream base rounds the acidity without turning it into a heavy vodka-sauce situation.'
  ],
  array[
    '39 g protein with 9 g fibre — the most fibre in the pasta line.',
    'Sun-dried tomato and roasted garlic, not tomato powder and sugar.',
    'Basil goes in at the end so it still smells like basil.',
    'Genuinely good cold the next day. We tested. Repeatedly.'
  ],
  649, 'EUR', 39, 490, 56, 12, 9,
  3, 280, 114, 0,
  array['Milk', 'Wheat (gluten)'],
  array['vegetarian', 'high-fibre'],
  'tomato', true, true, 3, null, 'concept', '2026-02-03T00:00:00Z'
),
(
  'p_pasta_truffle',
  'truffle-mushroom-pasta',
  'FULL. Pasta — Truffle Mushroom',
  'PASTA',
  'Truffle Mushroom',
  'pasta',
  'Suspiciously grown-up.',
  'Porcini, chestnut mushroom and a restrained amount of truffle in a silky cream sauce. The one you make when someone is watching.',
  array[
    'Three mushrooms do the work: porcini for depth, chestnut for body, shiitake for the savoury edge. Truffle is the accent, not the whole personality.',
    'It is the most indulgent-tasting meal in the range and still lands at 38 g of protein.'
  ],
  array[
    '38 g protein in something that tastes like a restaurant side dish.',
    'Three mushrooms for depth; truffle used with restraint.',
    'Silky sauce that clings to the pasta instead of pooling.',
    'The pouch that makes a hotel room feel less bleak.'
  ],
  699, 'EUR', 38, 520, 54, 17, 7,
  3, 270, 119, 0,
  array['Milk', 'Wheat (gluten)'],
  array['vegetarian'],
  'truffle', true, true, 4, null, 'concept', '2026-02-18T00:00:00Z'
),
(
  'p_risotto_garlic',
  'roasted-garlic-risotto',
  'FULL. Risotto — Roasted Garlic',
  'RISOTTO',
  'Roasted Garlic',
  'risotto',
  'No stirring. No standing. Still risotto.',
  'Arborio rice, roasted garlic, aged parmesan-style cheese and a lemon lift. The lowest-calorie meal in the range at 480 kcal with 36 g protein.',
  array[
    'Risotto is the meal most people cannot be bothered to make. Twenty minutes of stirring is the whole reason.',
    'We pre-cook and dry the arborio so it rehydrates to a creamy bite, then build the flavour on roasted garlic and hard cheese.'
  ],
  array[
    '36 g protein at 480 kcal — the leanest bowl we make.',
    'Creamy arborio texture without twenty minutes of stirring.',
    'Roasted garlic and hard cheese: two ingredients, big flavour.',
    'Lemon at the end so it doesn''t sit heavy.'
  ],
  649, 'EUR', 36, 480, 58, 11, 6,
  3, 300, 112, 0,
  array['Milk'],
  array['vegetarian'],
  'garlic', true, false, 5, null, 'concept', '2026-03-01T00:00:00Z'
),
(
  'p_chili_smoky',
  'smoky-chili-bean-and-beef',
  'FULL. Chili — Smoky Bean + Beef',
  'CHILI',
  'Smoky Bean + Beef',
  'chili',
  '45 g. The heavyweight.',
  'Slow-cooked beef, black beans, kidney beans, smoked paprika and chipotle. The highest protein and highest fibre meal in the range.',
  array[
    'Chili was the obvious place to push protein hardest — beef and beans are already doing the work, we just refused to water it down.',
    'Smoked paprika and chipotle give it the low, slow flavour that usually needs an afternoon and a heavy pot.'
  ],
  array[
    '45 g protein and 12 g fibre — the biggest numbers we make.',
    'Real slow-cooked beef with black and kidney beans.',
    'Chipotle heat: warm and smoky rather than sharp.',
    'The post-training meal that isn''t another shake.'
  ],
  699, 'EUR', 45, 530, 48, 15, 12,
  3, 320, 124, 2,
  array['Milk', 'Celery'],
  array['contains-meat', 'spicy', 'high-fibre'],
  'chili', true, true, 6, null, 'concept', '2026-03-14T00:00:00Z'
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  line = excluded.line,
  flavor = excluded.flavor,
  category = excluded.category,
  tagline = excluded.tagline,
  description = excluded.description,
  story = excluded.story,
  love_it = excluded.love_it,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  protein = excluded.protein,
  calories = excluded.calories,
  carbs = excluded.carbs,
  fat = excluded.fat,
  fibre = excluded.fibre,
  prep_minutes = excluded.prep_minutes,
  water_ml = excluded.water_ml,
  serving_weight_g = excluded.serving_weight_g,
  heat = excluded.heat,
  allergens = excluded.allergens,
  dietary = excluded.dietary,
  accent = excluded.accent,
  active = excluded.active,
  featured = excluded.featured,
  rank = excluded.rank,
  data_status = excluded.data_status,
  created_at = excluded.created_at;

-- ─── Nutrition facts (CONCEPT DATA — pending lab analysis) ──────────

insert into public.nutrition_facts (
  product_id, serving_weight_g, calories, protein_g, carbs_g, sugars_g,
  fat_g, saturates_g, fibre_g, salt_g, micronutrients, status
) values
(
  'p_mac_cheddar', 118, 510, 42, 55, 6, 14, 7, 8, 1.6,
  '[{"label":"Calcium","amount":"480 mg","nrv":60},
    {"label":"Iron","amount":"5.4 mg","nrv":39},
    {"label":"Potassium","amount":"720 mg","nrv":36},
    {"label":"Vitamin B12","amount":"1.9 µg","nrv":76}]'::jsonb,
  'concept'
),
(
  'p_mac_jalapeno', 116, 500, 40, 53, 6, 14, 7, 8, 1.7,
  '[{"label":"Calcium","amount":"455 mg","nrv":57},
    {"label":"Iron","amount":"5.1 mg","nrv":36},
    {"label":"Potassium","amount":"745 mg","nrv":37},
    {"label":"Vitamin C","amount":"18 mg","nrv":23}]'::jsonb,
  'concept'
),
(
  'p_pasta_tomato', 114, 490, 39, 56, 9, 12, 5, 9, 1.5,
  '[{"label":"Calcium","amount":"320 mg","nrv":40},
    {"label":"Iron","amount":"6.1 mg","nrv":44},
    {"label":"Potassium","amount":"890 mg","nrv":45},
    {"label":"Vitamin B6","amount":"0.7 mg","nrv":50}]'::jsonb,
  'concept'
),
(
  'p_pasta_truffle', 119, 520, 38, 54, 5, 17, 7, 7, 1.6,
  '[{"label":"Calcium","amount":"300 mg","nrv":38},
    {"label":"Iron","amount":"5.8 mg","nrv":41},
    {"label":"Potassium","amount":"930 mg","nrv":47},
    {"label":"Riboflavin (B2)","amount":"0.9 mg","nrv":64}]'::jsonb,
  'concept'
),
(
  'p_risotto_garlic', 112, 480, 36, 58, 4, 11, 5, 6, 1.5,
  '[{"label":"Calcium","amount":"410 mg","nrv":51},
    {"label":"Iron","amount":"4.2 mg","nrv":30},
    {"label":"Potassium","amount":"640 mg","nrv":32},
    {"label":"Vitamin B12","amount":"1.6 µg","nrv":64}]'::jsonb,
  'concept'
),
(
  'p_chili_smoky', 124, 530, 45, 48, 8, 15, 6, 12, 1.8,
  '[{"label":"Iron","amount":"8.4 mg","nrv":60},
    {"label":"Zinc","amount":"6.2 mg","nrv":62},
    {"label":"Potassium","amount":"1120 mg","nrv":56},
    {"label":"Vitamin B12","amount":"2.4 µg","nrv":96}]'::jsonb,
  'concept'
)
on conflict (product_id) do update set
  serving_weight_g = excluded.serving_weight_g,
  calories = excluded.calories,
  protein_g = excluded.protein_g,
  carbs_g = excluded.carbs_g,
  sugars_g = excluded.sugars_g,
  fat_g = excluded.fat_g,
  saturates_g = excluded.saturates_g,
  fibre_g = excluded.fibre_g,
  salt_g = excluded.salt_g,
  micronutrients = excluded.micronutrients,
  status = excluded.status;

-- ─── Ingredients ───────────────────────────────────────────────────

delete from public.ingredients
where product_id in (
  'p_mac_cheddar', 'p_mac_jalapeno', 'p_pasta_tomato',
  'p_pasta_truffle', 'p_risotto_garlic', 'p_chili_smoky'
);

insert into public.ingredients (product_id, name, why, share, position) values
-- Mac + Cheese, Classic Cheddar
('p_mac_cheddar', 'High-protein pasta', 'Durum wheat blended with pea protein so the protein is in the pasta, not dusted on top.', 42, 0),
('p_mac_cheddar', 'Aged cheddar', 'Real cheese, dried to powder. It is what makes it taste like mac & cheese.', 21, 1),
('p_mac_cheddar', 'Milk protein blend', 'Builds the creamy body of the sauce and carries most of the protein.', 18, 2),
('p_mac_cheddar', 'Chickpea flour', 'Thickens the sauce with fibre instead of pure starch.', 8, 3),
('p_mac_cheddar', 'Sunflower oil powder', 'A controlled amount of fat so the sauce feels rich without going greasy.', 5, 4),
('p_mac_cheddar', 'Chicory root fibre', 'Adds fibre for a meal that actually keeps you full.', 4, 5),
('p_mac_cheddar', 'Mustard, onion, black pepper, sea salt', 'The seasoning that stops cheese sauce tasting flat.', 2, 6),
-- Mac + Cheese, Spicy Jalapeño
('p_mac_jalapeno', 'High-protein pasta', 'Durum wheat with pea protein for structure and protein in one bite.', 40, 0),
('p_mac_jalapeno', 'Aged cheddar', 'The backbone of the sauce — heat needs something to sit on.', 20, 1),
('p_mac_jalapeno', 'Milk protein blend', 'Creaminess and the bulk of the protein.', 17, 2),
('p_mac_jalapeno', 'Roasted jalapeño', 'Roasted for flavour depth, not just for heat.', 7, 3),
('p_mac_jalapeno', 'Chickpea flour', 'Thickener that brings fibre with it.', 7, 4),
('p_mac_jalapeno', 'Lime and coriander', 'Cuts through the fat and keeps the bowl tasting fresh.', 4, 5),
('p_mac_jalapeno', 'Green chilli, garlic, sea salt', 'The seasoning that makes the heat build rather than spike.', 5, 6),
-- Pasta, Creamy Tomato
('p_pasta_tomato', 'High-protein pasta', 'Pea and wheat protein in the pasta itself keeps the texture right.', 44, 0),
('p_pasta_tomato', 'Sun-dried tomato', 'Concentrated tomato flavour without a long simmer.', 15, 1),
('p_pasta_tomato', 'Milk protein blend', 'The creamy body and most of the protein.', 16, 2),
('p_pasta_tomato', 'Roasted garlic', 'Roasting turns garlic sweet instead of sharp.', 6, 3),
('p_pasta_tomato', 'Chickpea flour', 'Thickens the sauce and adds fibre.', 8, 4),
('p_pasta_tomato', 'Chicory root fibre', 'Pushes fibre to 9 g a bowl.', 5, 5),
('p_pasta_tomato', 'Basil, oregano, black pepper, sea salt', 'Added late so the herbs still taste green.', 6, 6),
-- Pasta, Truffle Mushroom
('p_pasta_truffle', 'High-protein pasta', 'The same protein-in-the-dough base as the rest of the range.', 42, 0),
('p_pasta_truffle', 'Porcini, chestnut and shiitake mushroom', 'Layered mushroom flavour instead of one flat note.', 16, 1),
('p_pasta_truffle', 'Milk protein blend', 'Silky sauce body and the protein load.', 17, 2),
('p_pasta_truffle', 'Sunflower oil powder', 'Carries the aroma compounds — truffle needs some fat.', 8, 3),
('p_pasta_truffle', 'Chickpea flour', 'Thickens the sauce; adds fibre.', 7, 4),
('p_pasta_truffle', 'Truffle flavour', 'Used sparingly, because too much tastes like petrol.', 3, 5),
('p_pasta_truffle', 'Thyme, garlic, white pepper, sea salt', 'Classic mushroom seasoning, nothing clever.', 7, 6),
-- Risotto, Roasted Garlic
('p_risotto_garlic', 'Arborio rice', 'Pre-cooked and dried so it rehydrates creamy, not crunchy.', 45, 0),
('p_risotto_garlic', 'Milk protein blend', 'Where most of the 36 g comes from.', 20, 1),
('p_risotto_garlic', 'Aged hard cheese', 'Salty, savoury depth — the flavour risotto is built on.', 14, 2),
('p_risotto_garlic', 'Roasted garlic', 'Sweet and mellow rather than sharp.', 8, 3),
('p_risotto_garlic', 'Pea protein', 'Tops up the protein without changing the texture.', 6, 4),
('p_risotto_garlic', 'Lemon peel and parsley', 'Keeps a rich bowl from tasting flat.', 3, 5),
('p_risotto_garlic', 'White pepper, onion, sea salt', 'Background seasoning.', 4, 6),
-- Chili, Smoky Bean + Beef
('p_chili_smoky', 'Slow-cooked beef', 'Cooked down then dried, so it shreds rather than turning to rubber.', 26, 0),
('p_chili_smoky', 'Black and kidney beans', 'Protein, fibre and the texture that makes chili chili.', 28, 1),
('p_chili_smoky', 'Tomato and roasted pepper', 'The sauce base — sweet, concentrated, not watery.', 18, 2),
('p_chili_smoky', 'Milk protein blend', 'Rounds the sauce and lifts protein to 45 g.', 12, 3),
('p_chili_smoky', 'Smoked paprika and chipotle', 'Warm smoke and heat, in that order.', 6, 4),
('p_chili_smoky', 'Sweetcorn', 'Bursts of sweetness against the smoke.', 5, 5),
('p_chili_smoky', 'Cumin, oregano, garlic, sea salt', 'The chili spine.', 5, 6);

-- ─── Product images ────────────────────────────────────────────────
-- `asset_key` points at src/assets/manifest.json. Rows without a
-- generated asset yet fall back to the CSS/SVG <Pouch /> artwork.

delete from public.product_images
where product_id in (
  'p_mac_cheddar', 'p_mac_jalapeno', 'p_pasta_tomato',
  'p_pasta_truffle', 'p_risotto_garlic', 'p_chili_smoky'
);

insert into public.product_images (product_id, role, asset_key, alt, position) values
('p_mac_cheddar', 'hero', 'hero-mac-cheddar', 'A bowl of creamy macaroni and cheese with steam rising, photographed in a studio beside a matte black meal pouch', 0),
('p_mac_cheddar', 'pouch', 'pouch-mac-cheddar', 'Matte black FULL. Mac + Cheese Classic Cheddar pouch', 0),
('p_mac_cheddar', 'closeup', 'closeup-mac-cheddar', 'Close-up of creamy cheddar macaroni and cheese in a matte ceramic bowl', 0),
('p_mac_cheddar', 'lifestyle', 'lifestyle-student', 'A student in a modern flat pouring hot water into a matte black meal pouch on the kitchen counter', 0),
('p_mac_cheddar', 'ingredients', 'ingredients-mac-cheddar', 'Overhead flat-lay of dry pasta, cheddar wedges, powders and seasonings arranged in neat rows', 0),

('p_mac_jalapeno', 'hero', 'hero-mac-jalapeno', 'A bowl of jalapeño macaroni and cheese beside a matte black meal pouch', 0),
('p_mac_jalapeno', 'pouch', 'pouch-mac-jalapeno', 'Matte black FULL. Mac + Cheese Spicy Jalapeño pouch', 0),
('p_mac_jalapeno', 'closeup', 'closeup-mac-jalapeno', 'Close-up of macaroni and cheese topped with roasted jalapeño slices and coriander', 0),
('p_mac_jalapeno', 'lifestyle', 'lifestyle-fitness', 'A young adult in gym clothes eating macaroni and cheese from a pouch at home after training', 0),
('p_mac_jalapeno', 'ingredients', 'ingredients-mac-cheddar', 'Overhead flat-lay of dry pasta, cheddar wedges, powders and seasonings arranged in neat rows', 0),

('p_pasta_tomato', 'hero', 'hero-pasta-tomato', 'A bowl of creamy tomato pasta beside a matte black meal pouch', 0),
('p_pasta_tomato', 'pouch', 'pouch-pasta-tomato', 'Matte black FULL. Pasta Creamy Tomato pouch', 0),
('p_pasta_tomato', 'closeup', 'closeup-pasta-tomato', 'Close-up of pasta in a creamy sun-dried tomato sauce with fresh basil', 0),
('p_pasta_tomato', 'lifestyle', 'lifestyle-desk', 'A meal pouch with steam rising beside a laptop on a late-night desk', 0),
('p_pasta_tomato', 'ingredients', 'ingredients-pasta-tomato', 'Overhead flat-lay of dry pasta, sun-dried tomatoes, roasted garlic and basil', 0),

('p_pasta_truffle', 'hero', 'hero-pasta-truffle', 'A bowl of truffle mushroom pasta beside a matte black meal pouch', 0),
('p_pasta_truffle', 'pouch', 'pouch-pasta-truffle', 'Matte black FULL. Pasta Truffle Mushroom pouch', 0),
('p_pasta_truffle', 'closeup', 'closeup-pasta-truffle', 'Close-up of pasta in a creamy mushroom sauce with seared mushrooms and truffle shavings', 0),
('p_pasta_truffle', 'lifestyle', 'lifestyle-travel', 'Two flat matte black meal pouches packed inside a backpack on a train seat', 0),
('p_pasta_truffle', 'ingredients', 'ingredients-pasta-truffle', 'Overhead flat-lay of dried porcini, fresh mushrooms, thyme and a black truffle', 0),

('p_risotto_garlic', 'hero', 'hero-risotto-garlic', 'A bowl of roasted garlic risotto beside a matte black meal pouch', 0),
('p_risotto_garlic', 'pouch', 'pouch-risotto-garlic', 'Matte black FULL. Risotto Roasted Garlic pouch', 0),
('p_risotto_garlic', 'closeup', 'closeup-risotto-garlic', 'Close-up of creamy risotto with roasted garlic and shaved hard cheese', 0),
('p_risotto_garlic', 'lifestyle', 'lifestyle-student', 'A student in a modern flat pouring hot water into a matte black meal pouch on the kitchen counter', 0),
('p_risotto_garlic', 'ingredients', 'ingredients-risotto-garlic', 'Overhead flat-lay of arborio rice, roasted garlic, hard cheese and lemon peel', 0),

('p_chili_smoky', 'hero', 'hero-chili-smoky', 'A bowl of smoky chili beside a matte black meal pouch', 0),
('p_chili_smoky', 'pouch', 'pouch-chili-smoky', 'Matte black FULL. Chili Smoky Bean + Beef pouch', 0),
('p_chili_smoky', 'closeup', 'closeup-chili-smoky', 'Close-up of a thick smoky chili with shredded beef, beans and sweetcorn', 0),
('p_chili_smoky', 'lifestyle', 'lifestyle-fitness', 'A young adult in gym clothes eating macaroni and cheese from a pouch at home after training', 0),
('p_chili_smoky', 'ingredients', 'ingredients-chili-smoky', 'Overhead flat-lay of beans, shredded beef, dried chipotle chillies and smoked paprika', 0);

-- ─── Single-serve variants ─────────────────────────────────────────
-- One variant per product for now; box bundles are priced dynamically
-- in src/lib/cart.ts rather than stored as SKUs.

insert into public.product_variants (product_id, sku, label, pack_size, price_cents, mode)
select p.id, 'FULL-' || upper(replace(p.id, 'p_', '')) || '-1', 'Single pouch', 1, p.price_cents, 'one-time'
from public.products p
on conflict (sku) do update set
  price_cents = excluded.price_cents,
  label = excluded.label;

commit;

-- ═══════════════════════════════════════════════════════════════════
-- Reminder: reviews are intentionally NOT seeded. The site does not
-- display invented customer feedback — the review section renders an
-- honest empty state until real, moderated reviews exist.
-- ═══════════════════════════════════════════════════════════════════
