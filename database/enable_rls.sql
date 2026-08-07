-- ============================================================
-- ARCademy: Enable Row Level Security (RLS) on all tables
-- Run this in your Supabase Dashboard → SQL Editor
-- ============================================================
-- IMPORTANT: The backend uses SUPABASE_SERVICE_ROLE_KEY which
-- bypasses RLS entirely, so the app will keep working perfectly.
-- RLS only blocks DIRECT/PUBLIC access without a valid service key.
-- ============================================================

-- ── 1. Enable RLS on all tables ──────────────────────────────
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_log    ENABLE ROW LEVEL SECURITY;

-- ── 2. Drop any old policies first (clean slate) ─────────────
DROP POLICY IF EXISTS "block_all_profiles"      ON public.profiles;
DROP POLICY IF EXISTS "block_all_user_progress" ON public.user_progress;
DROP POLICY IF EXISTS "block_all_submissions"   ON public.submissions;
DROP POLICY IF EXISTS "block_all_rewards_log"   ON public.rewards_log;

-- ── 3. Create DENY-ALL policies for public (anon) access ─────
-- Since our backend exclusively uses the service_role key,
-- we do NOT need any permissive public policies.
-- These restrictive policies ensure zero public access.

-- profiles: deny all public access
CREATE POLICY "block_all_profiles"
  ON public.profiles
  FOR ALL
  TO public
  USING (false);

-- user_progress: deny all public access
CREATE POLICY "block_all_user_progress"
  ON public.user_progress
  FOR ALL
  TO public
  USING (false);

-- submissions: deny all public access
CREATE POLICY "block_all_submissions"
  ON public.submissions
  FOR ALL
  TO public
  USING (false);

-- rewards_log: deny all public access
CREATE POLICY "block_all_rewards_log"
  ON public.rewards_log
  FOR ALL
  TO public
  USING (false);

-- ── 4. Verify RLS is enabled ─────────────────────────────────
-- Run this SELECT to confirm. All tables should show rowsecurity = true
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'user_progress', 'submissions', 'rewards_log')
ORDER BY tablename;
