ALTER TABLE users
ADD COLUMN auth_user_id UUID UNIQUE;

ALTER TABLE users
ADD CONSTRAINT fk_auth_user
FOREIGN KEY (auth_user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;


-- 1. Create the function
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, full_name, role)
  VALUES (
    NEW.id,                                    -- Supabase user UUID
    NEW.raw_user_meta_data->>'full_name',      -- From metadata
    COALESCE(NEW.raw_user_meta_data->>'role', 'STAFF') -- Default role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();