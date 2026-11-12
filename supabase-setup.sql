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
