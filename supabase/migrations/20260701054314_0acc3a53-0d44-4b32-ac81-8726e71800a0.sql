
-- Move has_role into a private schema so it's not exposed via PostgREST
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

-- Recreate function in private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Allow policies executed as authenticated to call it
GRANT USAGE ON SCHEMA private TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Update all policies that referenced public.has_role
DROP POLICY IF EXISTS "Admins view all favorites" ON public.favorites;
CREATE POLICY "Admins view all favorites" ON public.favorites
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage notifications" ON public.notifications;
CREATE POLICY "Admins manage notifications" ON public.notifications
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins delete profiles" ON public.profiles;
CREATE POLICY "Admins delete profiles" ON public.profiles
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING ((auth.uid() = id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

-- Remove the exposed function from the public (API) schema
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
