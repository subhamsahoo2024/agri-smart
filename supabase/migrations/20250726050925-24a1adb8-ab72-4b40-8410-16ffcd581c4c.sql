-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if email was just confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    -- Get the role from user metadata (set during signup)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'role', 'farmer')::text
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';