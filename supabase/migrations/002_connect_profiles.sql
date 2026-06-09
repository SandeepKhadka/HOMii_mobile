-- Connect feature — opt-in student discovery (added per client review 2026-05-25).
-- Users toggle `connect_enabled` and add social handles; other students
-- discover them via the list_connect_profiles RPC (which exposes only the
-- safe-to-share columns, never email/phone/address).
--
-- Apply this in the Supabase SQL Editor.

-- 1. Add opt-in flag + socials JSONB to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS connect_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS socials jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Index helps the discovery RPC stay snappy as the user base grows.
CREATE INDEX IF NOT EXISTS profiles_connect_enabled_idx
  ON public.profiles (connect_enabled)
  WHERE connect_enabled = true;

-- 2. Discovery RPC — returns only safe public columns, with optional filters.
--    SECURITY DEFINER so it bypasses the owner-only SELECT policy on profiles
--    (which still applies to direct table access). Callers never see email,
--    phone_number, current_address, etc.
CREATE OR REPLACE FUNCTION public.list_connect_profiles(
  filter_university text DEFAULT NULL,
  filter_course text DEFAULT NULL,
  filter_nationality text DEFAULT NULL,
  filter_year text DEFAULT NULL,
  page_limit int DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  university text,
  course text,
  nationality text,
  year_of_study text,
  socials jsonb
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.full_name,
    p.avatar_url,
    p.university,
    p.course,
    p.nationality,
    p.year_of_study,
    p.socials
  FROM public.profiles p
  WHERE p.connect_enabled = true
    AND p.id <> auth.uid()                                -- never list yourself
    AND (filter_university  IS NULL OR p.university  = filter_university)
    AND (filter_course      IS NULL OR p.course      ILIKE '%' || filter_course || '%')
    AND (filter_nationality IS NULL OR p.nationality = filter_nationality)
    AND (filter_year        IS NULL OR p.year_of_study = filter_year)
  ORDER BY p.updated_at DESC
  LIMIT LEAST(page_limit, 100);
$$;

-- Only logged-in users can call the discovery RPC.
REVOKE ALL ON FUNCTION public.list_connect_profiles FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_connect_profiles TO authenticated;
