# Connecting the site to Supabase

Fifteen minutes, once. After this the admin pages work and the leaderboard
updates live on every device watching it.

---

## 1. Create the project

1. Go to [supabase.com](https://supabase.com) and sign in with GitHub.
2. **New project**. Name it `engenia`, pick the **Mumbai / ap-south-1** region —
   it is the closest to Chennai, and every millisecond of that round trip is
   felt on the reveal.
3. Set a database password and save it in your password manager. You will not
   need it for this site, but you cannot see it again afterwards.
4. Wait for the project to finish provisioning (a minute or two).

The free tier is enough. A fest's worth of results is a few hundred rows.

---

## 2. Create the tables

1. In the sidebar: **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this repo, copy all of it, paste it in.
3. **Run**.

You should see `Success. No rows returned`. That is correct — it creates
tables, it does not select from them.

To check: **Table Editor** should now list `admin_users`, `announcements`,
`departments`, `event_winners` and `events`.

---

## 3. Load last year's content

This fills the tables with the 32 events, 96 placings and 7 departments the
site already ships with, so nothing starts empty.

1. **SQL Editor** → **New query**.
2. Open `supabase/seed.sql`, copy all of it, paste, **Run**.

> `seed.sql` is generated, not written by hand. If you ever change the files in
> `src/data/`, regenerate it with `node scripts/generate-seed.mjs` rather than
> editing it — the two must not disagree.

Running it twice is harmless; every statement updates in place instead of
inserting a duplicate.

---

## 4. Make the admin account

**Authentication** → **Users** → **Add user** → **Create new user**.

- Email: something the committee shares, e.g. `organisers@licet.ac.in`
- Password: generate a strong one and put it in the committee's password
  manager
- **Turn ON "Auto Confirm User"** — without it Supabase sends a confirmation
  email to an address that may not exist, and the account cannot sign in

Copy the new user's **UID** from the list.

Then **SQL Editor** → **New query**, paste this with your two values
substituted, and run it:

```sql
insert into public.admin_users (user_id, email)
values ('PASTE-THE-UID-HERE', 'organisers@licet.ac.in');
```

**This step is what actually grants access.** Creating the auth user only
allows signing in; it is the row in `admin_users` that the policies check
before permitting a single write. An account without this row can log in and
will be able to change nothing — which is also how you revoke someone later:
delete their row and the next request they make is refused, without waiting
for their session to expire.

### Stop anyone else signing themselves up

**Authentication** → **Sign In / Providers** → **Email** → turn **"Allow new
users to sign up"** OFF.

Not strictly required — a self-registered user has no `admin_users` row and so
can do nothing — but there is no reason to let strangers create accounts on
your project.

---

## 5. Point the site at the project

**Project Settings** → **Data API** for the URL, and **API Keys** for the
anon key.

Create `.env.local` in the repo root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

There is a template at `.env.local.example`. `.env.local` is gitignored and
must stay that way.

Restart the dev server — env vars are read at boot, so a running server will
not pick them up.

```bash
npm run dev
```

> **The anon key is meant to be public.** It identifies the project; it grants
> nothing. Every table denies everything by default and the policies in
> `schema.sql` hand back only what the page needs. Do **not** add the
> `service_role` key to this file — it bypasses every policy, and nothing here
> needs it.

---

## 6. Check it worked

1. Visit `/admin/login`, sign in with the account from step 4.
2. You should land on the control room with 32 events and a leader.
3. Open `/leaderboard` in a second window, side by side with the admin.
4. In the admin, open any event, change a points value, save.
5. **The leaderboard in the other window should move on its own.** No refresh.

If it does not, see below.

---

## Running the fest

The working rhythm for a live event:

1. Judges hand over the result.
2. **Events & results** → find the event → type the three placings → **Save
   placings**. Nothing is public yet.
3. Compère is ready → **Reveal results**.
4. Every phone in the hall updates at that moment.

Until step 3 the placings are not merely hidden from the page — the database
refuses to send them to anyone who is not signed in as an admin. They are not
in the HTML, not in the network tab, and not in the realtime stream.

**Admin → Leaderboard** shows both numbers side by side: the projected total
including everything judged, and what the hall can currently see. The gap is
exactly what is waiting to be announced.

---

## If something is wrong

**"Supabase is not connected" on the login page**
`.env.local` is missing, misspelled, or the server was not restarted after it
was created.

**Signing in says the credentials do not match**
Check the user exists under Authentication → Users, and that it is
**confirmed**. An unconfirmed user cannot sign in.

**Signed in, but every save fails with "the database refused that write"**
The `admin_users` row from step 4 is missing or has the wrong UID. Check:

```sql
select * from public.admin_users;
```

The `user_id` there must match the UID under Authentication → Users exactly.

**The leaderboard does not update on its own**
Realtime may not be enabled. Re-run the last section of `schema.sql`, then
check **Database → Replication** shows `events`, `event_winners` and
`announcements` in the `supabase_realtime` publication. A refresh still shows
correct data either way — only the automatic part is missing.

**The site shows a "database is not reachable" notice**
It has fallen back to the bundled 2025 content so the page still renders.
Check the URL and key, and that the project is not paused (free projects pause
after a week of no traffic — open the dashboard to wake it).

> Free Supabase projects pause after ~7 days idle. Before the fest, open the
> dashboard once to make sure it is awake, or the first visitor of the day
> waits for a cold start.

---

## Deploying

Add the same two variables in **Vercel → Project → Settings → Environment
Variables**, for Production and Preview, then redeploy. Everything else is
already in the repo.
