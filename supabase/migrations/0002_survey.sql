-- ═══════════════════════════════════════════════════════════════════
-- FULL. — student survey responses
--
-- Public insert + public read so the /survey page can store answers
-- and show live aggregates without a signed-in session. No emails or
-- other identifiers are collected here — only the form answers.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.survey_responses (
  id                    uuid primary key default gen_random_uuid(),
  would_try_product     boolean not null,
  cooks_at_home         boolean not null,
  cook_habits           text not null default '',
  eats_out_lazy         boolean not null,
  junk_food_when_out    boolean not null,
  packs_lunch_to_uni    boolean not null,
  created_at            timestamptz not null default now()
);

create index if not exists survey_responses_created_at_idx
  on public.survey_responses (created_at desc);

alter table public.survey_responses enable row level security;

drop policy if exists "survey: anyone may respond" on public.survey_responses;
create policy "survey: anyone may respond"
  on public.survey_responses for insert
  to anon, authenticated
  with check (true);

drop policy if exists "survey: anyone may read answers" on public.survey_responses;
create policy "survey: anyone may read answers"
  on public.survey_responses for select
  to anon, authenticated
  using (true);

grant select, insert on public.survey_responses to anon, authenticated;

create or replace function public.survey_stats()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'total', count(*)::int,
    'would_try_product', jsonb_build_object(
      'yes', count(*) filter (where would_try_product)::int,
      'no', count(*) filter (where not would_try_product)::int
    ),
    'cooks_at_home', jsonb_build_object(
      'yes', count(*) filter (where cooks_at_home)::int,
      'no', count(*) filter (where not cooks_at_home)::int
    ),
    'eats_out_lazy', jsonb_build_object(
      'yes', count(*) filter (where eats_out_lazy)::int,
      'no', count(*) filter (where not eats_out_lazy)::int
    ),
    'junk_food_when_out', jsonb_build_object(
      'yes', count(*) filter (where junk_food_when_out)::int,
      'no', count(*) filter (where not junk_food_when_out)::int
    ),
    'packs_lunch_to_uni', jsonb_build_object(
      'yes', count(*) filter (where packs_lunch_to_uni)::int,
      'no', count(*) filter (where not packs_lunch_to_uni)::int
    )
  )
  from public.survey_responses;
$$;

grant execute on function public.survey_stats() to anon, authenticated;
