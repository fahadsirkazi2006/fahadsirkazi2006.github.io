create table if not exists public.star_game_scores (
  id smallint primary key check (id = 1),
  score integer not null check (score >= 0)
);

insert into public.star_game_scores (id, score)
values (1, 0)
on conflict (id) do nothing;

alter table public.star_game_scores enable row level security;

drop policy if exists "Anyone can read the star game score" on public.star_game_scores;
create policy "Anyone can read the star game score"
  on public.star_game_scores
  for select
  to anon, authenticated
  using (true);

revoke all on table public.star_game_scores from anon, authenticated;
grant select on table public.star_game_scores to anon, authenticated;

create or replace function public.submit_star_game_score(submitted_score integer)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_score integer;
begin
  if submitted_score is null or submitted_score < 0 then
    raise exception 'Score must be a non-negative integer';
  end if;

  update public.star_game_scores
  set score = greatest(score, submitted_score)
  where id = 1
  returning score into current_score;

  if current_score is null then
    raise exception 'The star game score row is missing';
  end if;

  return current_score;
end;
$$;

revoke all on function public.submit_star_game_score(integer) from public, anon, authenticated;
grant execute on function public.submit_star_game_score(integer) to anon, authenticated;

create table if not exists public.portfolio_feedback (
  id bigint generated always as identity primary key,
  name text not null check (char_length(trim(name)) between 1 and 120),
  role text not null check (char_length(trim(role)) between 1 and 160),
  comment text not null check (char_length(trim(comment)) between 1 and 2000),
  created_at timestamptz not null default now()
);

alter table public.portfolio_feedback enable row level security;

drop policy if exists "Anyone can read portfolio feedback" on public.portfolio_feedback;
create policy "Anyone can read portfolio feedback"
  on public.portfolio_feedback
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can submit portfolio feedback" on public.portfolio_feedback;
create policy "Anyone can submit portfolio feedback"
  on public.portfolio_feedback
  for insert
  to anon, authenticated
  with check (
    char_length(trim(name)) between 1 and 120
    and char_length(trim(role)) between 1 and 160
    and char_length(trim(comment)) between 1 and 2000
  );

revoke all on table public.portfolio_feedback from anon, authenticated;
grant select, insert on table public.portfolio_feedback to anon, authenticated;
grant usage, select on sequence public.portfolio_feedback_id_seq to anon, authenticated;
