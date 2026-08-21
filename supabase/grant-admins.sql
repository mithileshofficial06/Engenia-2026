-- ── Grant admin access ────────────────────────────────────────────────
-- Run in: Supabase → SQL Editor → New query.
--
-- PREREQUISITE: both accounts must already exist under
-- Authentication → Users, created with "Auto Confirm User" ON.
-- This script only grants access; it does not create accounts.
--
-- ORDER MATTERS. This is an insert...select: if the accounts do not
-- exist in auth.users yet, it selects zero rows, inserts zero rows and
-- reports success anyway. A silent no-op. Create the users FIRST, then
-- run this, then confirm the verify query below actually returns them.
--
-- Membership of public.admin_users IS the allowlist. Every write policy
-- in schema.sql calls is_admin(), which checks nothing but this table.
-- An account that can sign in but has no row here can change nothing.

insert into public.admin_users (user_id, email)
select u.id, u.email
from auth.users u
where u.email in (
  'ponram.28csb@licet.ac.in',
  'mithilesh.28csb@licet.ac.in'
)
on conflict (user_id) do nothing;


-- ── Verify ────────────────────────────────────────────────────────────
-- Expect exactly the two rows, each with confirmed_at set. A missing row
-- means that address has no auth user yet -- check the spelling under
-- Authentication → Users. A null confirmed_at means "Auto Confirm User"
-- was off; that account cannot sign in until you confirm it.

select a.email,
       a.user_id,
       u.email_confirmed_at
from public.admin_users a
join auth.users u on u.id = a.user_id
order by a.email;


-- ── Revoking someone later ────────────────────────────────────────────
-- delete from public.admin_users where email = 'someone@licet.ac.in';
-- Takes effect on their next request; no need to wait for the session
-- to expire.
