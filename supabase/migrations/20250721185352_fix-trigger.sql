-- Fix the trigger to include email field
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, full_name, email, role)
  VALUES (
    NEW.id,                                    -- Supabase user UUID
    NEW.raw_user_meta_data->>'full_name',      -- From metadata
    NEW.email,                                 -- Email from auth.users
    COALESCE(NEW.raw_user_meta_data->>'role', 'STAFF')::user_role -- Default role with explicit cast
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 