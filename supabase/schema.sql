-- ═══════════════════════════════════════════════════════════════════════
--  ENGENIA 2026 — database schema
--
--  Paste this whole file into the Supabase SQL editor and run it once.
--  It is idempotent: re-running drops and rebuilds the policies rather
--  than erroring, so it is safe to run again after an edit.
--
--  The shape mirrors what the site already had in src/data/. Two things
--  are deliberately NOT stored:
--
--   · Standings. Points are summed from the results, in src/lib/standings.js,
--     and that sum *is* the leaderboard. A stored total is a second source
--     of truth that can drift from the placings that produced it, and a
--     correction to a winner would leave it quietly wrong.
--
--   · Anything derived from dates — day numbers, whether the fest is over,
--     the season label. All computed from the event rows at read time.
-- ═══════════════════════════════════════════════════════════════════════


-- ── Who may write ─────────────────────────────────────────────────────
-- One row per admin. The committee runs a single shared login, so in
-- practice this holds one row — but it is a table rather than a hardcoded
-- id so a second organiser can be added from the dashboard later without
-- a code change or a redeploy.
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

-- `security definer` so the check can read admin_users while that table is
-- locked down to everyone else. `stable` lets Postgres call it once per
-- statement rather than once per row.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $fn$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$fn$;


-- ── The seven departments ─────────────────────────────────────────────
create table if not exists public.departments (
  code       text primary key,
  name       text not null,
  accent     text not null,
  sort_order int  not null default 0
);


-- ── Events ────────────────────────────────────────────────────────────
create table if not exists public.events (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,
  division          text not null check (division in ('ONSTAGE', 'OFFSTAGE')),
  type              text not null check (type in ('TEAM', 'INDIVIDUAL')),
  event_date        timestamptz,
  status            text not null default 'UPCOMING'
                      check (status in ('UPCOMING', 'LIVE', 'COMPLETED')),
  -- {"1": 20, "2": 15, "3": 10}. jsonb rather than three columns because the
  -- site already reads points[position], and an event that one day awards a
  -- fourth place should not need a migration to do it.
  points            jsonb not null default '{"1": 20, "2": 15, "3": 10}'::jsonb,
  guidelines        text[] not null default '{}',
  -- The reveal switch. Winners are entered privately during the event and
  -- held back until this flips — see the event_winners read policy below,
  -- which is what actually keeps them out of the browser.
  results_published boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists events_date_idx on public.events (event_date);


-- ── Placings ──────────────────────────────────────────────────────────
create table if not exists public.event_winners (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events (id) on delete cascade,
  position   int  not null check (position between 1 and 3),
  -- Nullable, and that is the point. In a TEAM event the winner *is* the
  -- department — there is no individual to name, and 24 of last year's
  -- placings are exactly that. The site has always rendered `name ?? dept`
  -- for this reason; a NOT NULL here would have forced a placeholder name
  -- into the database to satisfy a constraint that describes nothing real.
  name       text,
  dept_code  text not null references public.departments (code),
  created_at timestamptz not null default now(),
  -- One winner per placing per event. Without this a double-submitted form
  -- silently doubles that department's points, and the leaderboard is wrong
  -- in a way nothing on the page would reveal.
  unique (event_id, position)
);

create index if not exists event_winners_event_idx on public.event_winners (event_id);
create index if not exists event_winners_dept_idx  on public.event_winners (dept_code);


-- ── Announcements ─────────────────────────────────────────────────────
create table if not exists public.announcements (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  content    text not null,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists announcements_created_idx
  on public.announcements (created_at desc);


-- ── updated_at, maintained by the database ────────────────────────────
-- In a trigger rather than in the application: the admin UI is not the only
-- thing that writes these rows (the SQL editor and the seed both do), and a
-- timestamp only some writers remember to set is worse than no timestamp.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

drop trigger if exists events_touch on public.events;
create trigger events_touch before update on public.events
  for each row execute function public.touch_updated_at();

drop trigger if exists announcements_touch on public.announcements;
create trigger announcements_touch before update on public.announcements
  for each row execute function public.touch_updated_at();


-- ═══════════════════════════════════════════════════════════════════════
--  Row Level Security
--
--  This is the real lock, not the login screen. Every table denies
--  everything once RLS is on, and the policies below hand back exactly what
--  the public site needs to render. A forged request carrying the anon key
--  gets the same answer the browser does, because the key is not what is
--  being trusted — the signed session is.
-- ═══════════════════════════════════════════════════════════════════════

alter table public.admin_users   enable row level security;
alter table public.departments   enable row level security;
alter table public.events        enable row level security;
alter table public.event_winners enable row level security;
alter table public.announcements enable row level security;

-- admin_users: readable only by an admin, writable by nobody through the
-- API. Adding an organiser is a deliberate act in the SQL editor.
drop policy if exists admin_users_read on public.admin_users;
create policy admin_users_read on public.admin_users
  for select using (public.is_admin());

-- departments: public, and read-only to everyone. The roster is fixed for
-- the fest; changing it is a schema act, not an admin-UI one.
drop policy if exists departments_read on public.departments;
create policy departments_read on public.departments
  for select using (true);

-- events: the programme is public — names, times, formats, and what each
-- placing is worth. Only the placings themselves are staged.
drop policy if exists events_read on public.events;
create policy events_read on public.events
  for select using (true);

drop policy if exists events_write on public.events;
create policy events_write on public.events
  for all using (public.is_admin()) with check (public.is_admin());

-- event_winners: the reveal, enforced here rather than in the interface.
--
-- An unpublished placing is not merely hidden by the front end — it is never
-- sent. Postgres filters it out of the response, so it is absent from the
-- network tab, absent from the realtime stream, and unreachable by anyone
-- poking at the API with the anon key. Admins see every row.
drop policy if exists event_winners_read on public.event_winners;
create policy event_winners_read on public.event_winners
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.events e
      where e.id = event_winners.event_id
        and e.results_published
    )
  );

drop policy if exists event_winners_write on public.event_winners;
create policy event_winners_write on public.event_winners
  for all using (public.is_admin()) with check (public.is_admin());

-- announcements: drafts stay with the committee until published.
drop policy if exists announcements_read on public.announcements;
create policy announcements_read on public.announcements
  for select using (public.is_admin() or published);

drop policy if exists announcements_write on public.announcements;
create policy announcements_write on public.announcements
  for all using (public.is_admin()) with check (public.is_admin());


-- ═══════════════════════════════════════════════════════════════════════
--  Realtime
--
--  Change streams honour the policies above, so a browser holding the anon
--  key is pushed an event_winners row only once its event is published. The
--  reveal is therefore one UPDATE on events, and every screen watching the
--  leaderboard reacts to it at the same moment.
--
--  REPLICA IDENTITY FULL so a DELETE carries the row that left; without it
--  the payload is a primary key alone, and a client cannot tell which
--  department's points to take back.
-- ═══════════════════════════════════════════════════════════════════════

alter table public.events        replica identity full;
alter table public.event_winners replica identity full;
alter table public.announcements replica identity full;

do $pub$
begin
  alter publication supabase_realtime add table public.events;
exception when duplicate_object then null;
end
$pub$;

do $pub$
begin
  alter publication supabase_realtime add table public.event_winners;
exception when duplicate_object then null;
end
$pub$;

do $pub$
begin
  alter publication supabase_realtime add table public.announcements;
exception when duplicate_object then null;
end
$pub$;
