-- ═══════════════════════════════════════════════════════════════════
--  ENGENIA — seed data
--
--  GENERATED FILE — do not edit by hand.
--  Produced from src/data/events.js and src/data/site.js by
--  scripts/generate-seed.mjs. Run schema.sql first, then this.
--
--  Safe to run more than once: every statement upserts on a natural
--  key, so a second run updates in place instead of duplicating.
-- ═══════════════════════════════════════════════════════════════════

-- ── Departments ────────────────────────────────────────────────────
insert into public.departments (code, name, accent, sort_order) values ('IT', 'Information Technology', '#ffc554', 0)
  on conflict (code) do update set name = excluded.name, accent = excluded.accent, sort_order = excluded.sort_order;
insert into public.departments (code, name, accent, sort_order) values ('CSE-B', 'Computer Science & Engineering — Section B', '#f47115', 1)
  on conflict (code) do update set name = excluded.name, accent = excluded.accent, sort_order = excluded.sort_order;
insert into public.departments (code, name, accent, sort_order) values ('CSE-A', 'Computer Science & Engineering — Section A', '#d3133e', 2)
  on conflict (code) do update set name = excluded.name, accent = excluded.accent, sort_order = excluded.sort_order;
insert into public.departments (code, name, accent, sort_order) values ('ECE', 'Electronics & Communication Engineering', '#077faf', 3)
  on conflict (code) do update set name = excluded.name, accent = excluded.accent, sort_order = excluded.sort_order;
insert into public.departments (code, name, accent, sort_order) values ('MECH', 'Mechanical Engineering', '#05bbae', 4)
  on conflict (code) do update set name = excluded.name, accent = excluded.accent, sort_order = excluded.sort_order;
insert into public.departments (code, name, accent, sort_order) values ('EEE', 'Electrical & Electronics Engineering', '#d41350', 5)
  on conflict (code) do update set name = excluded.name, accent = excluded.accent, sort_order = excluded.sort_order;
insert into public.departments (code, name, accent, sort_order) values ('AIDS', 'Artificial Intelligence & Data Science', '#069568', 6)
  on conflict (code) do update set name = excluded.name, accent = excluded.accent, sort_order = excluded.sort_order;

-- ── Events ─────────────────────────────────────────────────────────
-- results_published is true here because these are last year's results,
-- already public. New events created in the admin default to false.

insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'poetry-writing-english', 'Poetry Writing- English', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-22T13:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Time limit: 1-hour', 'Photo/ Image will be given on the spot and a poem to be written based on the given image.', 'Participants will be judged based on their ability to bring out the theme & their language command']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'poetry-writing-tamil', 'Poetry Writing- Tamil', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-22T14:45:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Time limit: 1-hour', 'Photo/ Image will be given on the spot and a poem to be written based on the given image.', 'Participants will be judged based on their ability to bring out the theme & their language command']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'master-of-ceremony', 'Master of Ceremony', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-23T10:00:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['4 Participants per Department', 'Bilingual (Tamil and English)', 'Time on stage: 3 mins', 'Participants should perform based on the situation given by the Judges']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'essay-writing-english', 'Essay Writing- English', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-23T13:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['4 Participants per Department', 'Time limit: 1 hour']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'essay-writing-tamil', 'Essay Writing- Tamil', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-23T14:45:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['4 Participants per Department', 'Time limit: 1 hour']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'paper-craft', 'Paper Craft', 'OFFSTAGE', 'TEAM',
  '2025-09-24T13:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['2 Teams per Department.', '2 Participants per Team', 'Performance time: 1 hour', 'The materials required must be brought by the participant.', 'The Colour and type of sheets shall be decided by the students themselves.', 'Use of Glue and scissors is permitted.']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'pencil-sketching', 'Pencil Sketching', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-24T13:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['8 Participants per Department', 'Time limit: 1 hour', 'The drawings must illustrate the competition theme mentioned on the spot.', 'The drawing can be in pencil (black and white).', 'The drawings must be in A4 or A3 format.']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'poster-design', 'Poster Design', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-24T15:15:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Maximum Time: 1-hour', 'Theme will be given on the spot.', 'Participants will be required to design their posters in ‘Adobe Photoshop’.', 'Participants will be judged based on creativity & expertise.', 'Pictures will be provided by the event in charge.']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'venue-decoration', 'Venue Decoration', 'OFFSTAGE', 'TEAM',
  '2025-09-27T04:00:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  '{}'::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'rangoli', 'Rangoli', 'OFFSTAGE', 'TEAM',
  '2025-09-29T07:00:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Time limit: 1 hour 30 mins.', 'Color powder and Eco-friendly materials can be used but not salt to articulate the patterns.', 'Space will be allotted by lot on the previous day of the event']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'spin-a-yarn-english', 'Spin a Yarn- English', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-29T09:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Time: 3 min for presenting the story 2 min for question session', 'Images will be projected for which participants should develop a story']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'fireless-cooking', 'Fireless Cooking', 'OFFSTAGE', 'TEAM',
  '2025-09-29T09:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Time limit: 30 mins.', 'The participant itself must bring the materials required.', 'Ingredients and recipe of the dish should be ready with the participants and should be given to the judges.', 'Cutting vegetables/fruits must be done on-spot, no prior /no cooked preparation allowed.', 'Readymade food items or decoration items are not allowed.', 'Use of Bread is permitted.', 'However, participants are supposed to get approval for the ingredients on 25.09.2025 from the Faculty Event In-Charge.', 'Last-minute inclusions that lead to controversies will lead to disqualification.', 'Valuation and scoring will be based on the method, taste, and creativity in the presentation.']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'jam', 'JAM', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-29T09:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['4 participants per Department', 'THREE rounds (including Gibberish) will be conducted.', 'The participant should speak on the', 'topic without Repetition, hesitation & deviation from allotted topic']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'face-painting', 'Face Painting', 'OFFSTAGE', 'TEAM',
  '2025-09-29T09:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['4 Teams per Department', '2 Participants per Team', 'Fancy your own imagination. Face paints and Cosmetic Face glitters are allowed. Use only Brush & Sponge.', 'No attachments or stencils are allowed.', 'Models may not paint themselves.']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'connections', 'Connections', 'OFFSTAGE', 'TEAM',
  '2025-09-29T09:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Two teams per Department', '3 Participants per Team']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'photography', 'Photography', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-29T09:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Duration: 1-hour', 'Theme will be given on the spot.', 'Content plays the role.', 'Students are permitted to take pictures only inside the college (Loyola campus).', 'The date and time should be fixed in the camera.', 'Use of Mobile phones is not permitted.', 'Editing is also not permitted.']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'minute-to-glory', 'Minute to glory', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-29T09:45:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['5 participants per Department', 'Individual event', 'Martial Arts is not permitted']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'adapt-tune', 'Adapt Tune', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-29T11:00:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['4 Participants per Department', 'Time limit: 2 min', 'Participants will be judged based on versatility & skill']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'pot-pourri', 'Pot Pourri', 'OFFSTAGE', 'TEAM',
  '2025-09-29T11:00:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['One person enacts and the team members must guess.', 'Every person on the team should take a turn to enact.', 'No sounds, lettering, or splits per word are allowed.', 'Pointing to an object or person or showing something is not allowed.', 'Pictionary round: The participant must draw the given topic and convey the meaning to his/her team members']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'public-speaking-english', 'Public Speaking- English', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-29T11:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Maximum time on the dais: 3 mins', 'Theme will be given 1 hour prior to the event (Lot-based selection)']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'block-and-tackle', 'Block And Tackle', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-29T11:45:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['3 Participants per Department', 'Each participant will be given 4 mins']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'voice-over', 'Voice Over', 'OFFSTAGE', 'TEAM',
  '2025-09-29T11:45:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Performance time: 2 min; Preparation Time: 2 min', 'TWO-minute video will be played.']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'adzap', 'ADZAP', 'OFFSTAGE', 'TEAM',
  '2025-09-29T13:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Teams will pick lots with product names 15 mins prior to their performance.', 'The maximum time on stage will be 10 mins (plus 3 min question session).', 'The judges can question the team on their product & presentation.', 'Vulgarity will lead to elimination.']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'shipwreck', 'ShipWreck', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-29T13:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Time for defending: 4 min; Questions Session: 3 min', 'Personalities will be allotted by lots']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'spin-a-yarn-tamil', 'Spin a Yarn- Tamil', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-29T13:30:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Time: 3 min for presenting the story 2 min for question session', 'Images will be projected for which participants should develop a story']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'public-speaking-tamil', 'Public Speaking- Tamil', 'OFFSTAGE', 'INDIVIDUAL',
  '2025-09-29T14:00:00'::timestamptz, 'COMPLETED', '{"1":20,"2":15,"3":10}'::jsonb,
  ARRAY['Maximum time on the dais: 3 mins', 'Theme will be given 1 hour prior to the event (Lot-based selection)']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'channel-surfing', 'Channel Surfing', 'ONSTAGE', 'TEAM',
  '2025-09-30T08:30:00'::timestamptz, 'COMPLETED', '{"1":30,"2":25,"3":20}'::jsonb,
  ARRAY['10 - 18 Participants per Team', 'Maximum Time: 5 mins', 'List of 15 channels will be given on 26.09.2025', 'No time will be given for preparation.', 'Properties can be used.', 'Unique features of channels are preferred.']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'music-western-light', 'Music (Western & Light)', 'ONSTAGE', 'TEAM',
  '2025-09-30T09:45:00'::timestamptz, 'COMPLETED', '{"1":30,"2":25,"3":20}'::jsonb,
  ARRAY['Maximum Time: 10 mins + 2 mins (for preparation)', 'Fusion is not allowed.', 'Lyrics and Audio requirements should be submitted to the rehearsal committee on 24.09.2025']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'spotlight', 'SpotLight', 'ONSTAGE', 'TEAM',
  '2025-09-30T11:30:00'::timestamptz, 'COMPLETED', '{"1":30,"2":25,"3":20}'::jsonb,
  ARRAY['Time: 5 mins (performance) & 1 min preparation', 'The decorum of the college should be preserved.', 'Mimic / Imitating faculty or management will lead to disqualification.']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'theme-show', 'Theme Show', 'ONSTAGE', 'TEAM',
  '2025-09-30T12:45:00'::timestamptz, 'COMPLETED', '{"1":30,"2":25,"3":20}'::jsonb,
  ARRAY['Time on stage – 7 mins (performance) & 2 min (preparation)', 'Theme for the event: Compassion or Corruption', 'Theme could be brought in different art forms.', 'The theme should be confirmed by 23.09.2025']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'group-dance', 'Group Dance', 'ONSTAGE', 'TEAM',
  '2025-09-30T14:30:00'::timestamptz, 'COMPLETED', '{"1":30,"2":25,"3":20}'::jsonb,
  ARRAY['Total time – 9 mins [7 mins (minimum 3 styles included) + 2 min preparation]', 'Songs of selection will be screened.', 'Last minute changes are not allowed.']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;
insert into public.events (slug, name, division, type, event_date, status, points, guidelines, results_published) values (
  'shortfilm', 'Shortfilm', 'ONSTAGE', 'TEAM',
  '2025-09-30T16:00:00'::timestamptz, 'COMPLETED', '{"1":30,"2":25,"3":20}'::jsonb,
  ARRAY['Time: 5 min - 6 min', 'Theme for the event: Sacrifice', 'Works will be considered for competition only if they are of a total running time of 5 minutes and were submitted before 27.09.2025 (12:00 noon).', 'All qualified entries must be independently produced and financed.']::text[], true
) on conflict (slug) do update set
  name = excluded.name, division = excluded.division, type = excluded.type,
  event_date = excluded.event_date, status = excluded.status,
  points = excluded.points, guidelines = excluded.guidelines;

-- ── Placings ───────────────────────────────────────────────────────
-- Looked up by slug rather than by a hardcoded uuid, so this file does
-- not depend on the ids the events insert happened to generate.

insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'VINESHRAGUL M', 'ECE'
  from public.events where slug = 'poetry-writing-english'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'DJIGA TCHAMALEU LINDA', 'IT'
  from public.events where slug = 'poetry-writing-english'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'ANTONITA EVELYN MARIA S', 'CSE-A'
  from public.events where slug = 'poetry-writing-english'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Mathesh', 'CSE-B'
  from public.events where slug = 'poetry-writing-tamil'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Saranraj M', 'AIDS'
  from public.events where slug = 'poetry-writing-tamil'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Aslin Liju A', 'CSE-A'
  from public.events where slug = 'poetry-writing-tamil'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Shapariiyyappan', 'IT'
  from public.events where slug = 'master-of-ceremony'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Mohammad Arham', 'IT'
  from public.events where slug = 'master-of-ceremony'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Sharon Teena A R', 'MECH'
  from public.events where slug = 'master-of-ceremony'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'RAKSHINDA FAZZILET R', 'EEE'
  from public.events where slug = 'essay-writing-english'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'MADEEHA', 'IT'
  from public.events where slug = 'essay-writing-english'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'HARINI J S', 'ECE'
  from public.events where slug = 'essay-writing-english'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Ruthra P', 'IT'
  from public.events where slug = 'essay-writing-tamil'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Archana R', 'ECE'
  from public.events where slug = 'essay-writing-tamil'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Midhula', 'IT'
  from public.events where slug = 'essay-writing-tamil'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'MARIA JENOVA S , POOJA MARCUS P', 'CSE-B'
  from public.events where slug = 'paper-craft'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'DENNYSON A , GLADSON JEBAS R V', 'CSE-A'
  from public.events where slug = 'paper-craft'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'MARIA SHERLIN A ,SHANUKA ROSHINi', 'CSE-B'
  from public.events where slug = 'paper-craft'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Arockia Affrey S', 'ECE'
  from public.events where slug = 'pencil-sketching'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Merlin Zeetha A', 'ECE'
  from public.events where slug = 'pencil-sketching'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Reshal Rebecca W', 'ECE'
  from public.events where slug = 'pencil-sketching'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Juanita Grace Singh', 'CSE-B'
  from public.events where slug = 'poster-design'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Irwin D', 'IT'
  from public.events where slug = 'poster-design'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Dennyson A', 'CSE-A'
  from public.events where slug = 'poster-design'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, NULL, 'ECE'
  from public.events where slug = 'venue-decoration'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, NULL, 'IT'
  from public.events where slug = 'venue-decoration'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, NULL, 'CSE-B'
  from public.events where slug = 'venue-decoration'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Akshayaa G and teams', 'IT'
  from public.events where slug = 'rangoli'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Sharnika S and teams', 'CSE-B'
  from public.events where slug = 'rangoli'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Nakshathira M and teams', 'ECE'
  from public.events where slug = 'rangoli'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Renisha Ensalaita R', 'IT'
  from public.events where slug = 'spin-a-yarn-english'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Lenora Rachel', 'CSE-B'
  from public.events where slug = 'spin-a-yarn-english'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Abishai S', 'ECE'
  from public.events where slug = 'spin-a-yarn-english'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Rena Roy and team', 'CSE-B'
  from public.events where slug = 'fireless-cooking'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'MARIYA OVIYA I and Team', 'ECE'
  from public.events where slug = 'fireless-cooking'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Jessica Rachael J and team', 'IT'
  from public.events where slug = 'fireless-cooking'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Quincy J Pullockara', 'CSE-B'
  from public.events where slug = 'jam'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Christina Moses', 'CSE-A'
  from public.events where slug = 'jam'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Asher Daniel Fernando M', 'MECH'
  from public.events where slug = 'jam'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'SHARON SOPHIA,VANESA ANN VINCENT', 'CSE-B'
  from public.events where slug = 'face-painting'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'ANDREA J B , JASON MATHEW P', 'CSE-A'
  from public.events where slug = 'face-painting'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'MERLIN ZEETHA A , APARNA S M', 'ECE'
  from public.events where slug = 'face-painting'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Sanjeevkumar S and teams', 'EEE'
  from public.events where slug = 'connections'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Bhooshith J and teams', 'MECH'
  from public.events where slug = 'connections'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Joyel Immanuel L and teams', 'CSE-A'
  from public.events where slug = 'connections'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Dean Christian A', 'MECH'
  from public.events where slug = 'photography'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Amy john', 'CSE-A'
  from public.events where slug = 'photography'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Sahaya Leander Nova A', 'MECH'
  from public.events where slug = 'photography'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Kaelyn Venecia Mary J', 'EEE'
  from public.events where slug = 'minute-to-glory'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Brendan Wesley A', 'CSE-A'
  from public.events where slug = 'minute-to-glory'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Joanna Preethi J', 'AIDS'
  from public.events where slug = 'minute-to-glory'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Jouvita J Kenned', 'IT'
  from public.events where slug = 'adapt-tune'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Akshayaa G', 'IT'
  from public.events where slug = 'adapt-tune'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Iesvs Immanuel', 'IT'
  from public.events where slug = 'adapt-tune'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Rakshna R and team', 'CSE-B'
  from public.events where slug = 'pot-pourri'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'DHIVYA R and team', 'CSE-A'
  from public.events where slug = 'pot-pourri'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Mithra S J and team', 'CSE-B'
  from public.events where slug = 'pot-pourri'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Jessica Rachael J', 'IT'
  from public.events where slug = 'public-speaking-english'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'ALTHIYA DIVYANESAM A', 'CSE-A'
  from public.events where slug = 'public-speaking-english'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'SIDDESHWARAN U R', 'AIDS'
  from public.events where slug = 'public-speaking-english'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Vishal Rajendran', 'CSE-B'
  from public.events where slug = 'block-and-tackle'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Quincy J Pullockara', 'CSE-B'
  from public.events where slug = 'block-and-tackle'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Jovita Jayburt', 'IT'
  from public.events where slug = 'block-and-tackle'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Pramalesh and team', 'MECH'
  from public.events where slug = 'voice-over'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Alan Merwin D', 'IT'
  from public.events where slug = 'voice-over'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Mathesh s', 'CSE-B'
  from public.events where slug = 'voice-over'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, NULL, 'IT'
  from public.events where slug = 'adzap'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, NULL, 'MECH'
  from public.events where slug = 'adzap'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, NULL, 'ECE'
  from public.events where slug = 'adzap'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'Mohammad Arham', 'IT'
  from public.events where slug = 'shipwreck'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'S.P Rakshana Shri', 'MECH'
  from public.events where slug = 'shipwreck'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'DANICAA SILVA S', 'CSE-A'
  from public.events where slug = 'shipwreck'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'ASLIN LIJU A', 'CSE-A'
  from public.events where slug = 'spin-a-yarn-tamil'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Sharon Sophia C', 'CSE-B'
  from public.events where slug = 'spin-a-yarn-tamil'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'Sherwin Rene J', 'EEE'
  from public.events where slug = 'spin-a-yarn-tamil'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, 'GRACELIN A', 'CSE-A'
  from public.events where slug = 'public-speaking-tamil'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, 'Aruna Devi A', 'EEE'
  from public.events where slug = 'public-speaking-tamil'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, 'JOEINFAANT A J', 'ECE'
  from public.events where slug = 'public-speaking-tamil'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, NULL, 'IT'
  from public.events where slug = 'channel-surfing'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, NULL, 'EEE'
  from public.events where slug = 'channel-surfing'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, NULL, 'CSE-A'
  from public.events where slug = 'channel-surfing'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, NULL, 'IT'
  from public.events where slug = 'music-western-light'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, NULL, 'MECH'
  from public.events where slug = 'music-western-light'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, NULL, 'CSE-B'
  from public.events where slug = 'music-western-light'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, NULL, 'CSE-A'
  from public.events where slug = 'spotlight'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, NULL, 'IT'
  from public.events where slug = 'spotlight'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, NULL, 'ECE'
  from public.events where slug = 'spotlight'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, NULL, 'MECH'
  from public.events where slug = 'theme-show'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, NULL, 'EEE'
  from public.events where slug = 'theme-show'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, NULL, 'CSE-A'
  from public.events where slug = 'theme-show'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, NULL, 'IT'
  from public.events where slug = 'group-dance'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, NULL, 'EEE'
  from public.events where slug = 'group-dance'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, NULL, 'CSE-B'
  from public.events where slug = 'group-dance'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 1, NULL, 'CSE-B'
  from public.events where slug = 'shortfilm'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 2, NULL, 'ECE'
  from public.events where slug = 'shortfilm'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;
insert into public.event_winners (event_id, position, name, dept_code)
  select id, 3, NULL, 'MECH'
  from public.events where slug = 'shortfilm'
  on conflict (event_id, position) do update set
    name = excluded.name, dept_code = excluded.dept_code;

-- ── Announcements ──────────────────────────────────────────────────
-- Keyed on title so a re-run updates the existing row. Titles are the
-- only stable identifier the static file carries that survives here;
-- rows created in the admin get a uuid and are unaffected by this.

insert into public.announcements (title, content, published, created_at)
  select 'Offstage Event Photos Now Available', 'We''re pleased to share that photos from the Offstage Events have now been added to our gallery. You''re invited to explore the newly uploaded images and revisit some of the memorable moments captured during the event.', true, '2025-10-30T13:07:28'::timestamptz
  where not exists (select 1 from public.announcements where title = 'Offstage Event Photos Now Available');
insert into public.announcements (title, content, published, created_at)
  select 'Valedictory Event', 'Dear Students, the Valedictory Event will start shortly after the Group Dance Results. So everyone is requested not to leave Bertram Hall. Your cooperation and support are expected for the successful completion of ENGENIA 2025.', true, '2025-09-30T12:04:01'::timestamptz
  where not exists (select 1 from public.announcements where title = 'Valedictory Event');

