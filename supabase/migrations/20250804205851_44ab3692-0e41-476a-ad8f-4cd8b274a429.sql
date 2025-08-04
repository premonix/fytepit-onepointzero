-- Add admin policies for user management
-- Allow admins and super admins to update any user profile
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Allow admins and super admins to delete user profiles
CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Add user status and ban functionality to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS banned_reason TEXT;

-- Create function to get all users with their roles and profiles
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    username TEXT,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    total_balance NUMERIC,
    is_active BOOLEAN,
    is_banned BOOLEAN,
    banned_at TIMESTAMP WITH TIME ZONE,
    banned_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_role app_role,
    email_confirmed_at TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
LANGUAGE SQL
AS $$
  SELECT 
    p.user_id,
    au.email,
    p.username,
    p.display_name,
    p.avatar_url,
    p.bio,
    p.total_balance,
    p.is_active,
    p.is_banned,
    p.banned_at,
    p.banned_reason,
    p.created_at,
    p.updated_at,
    COALESCE(ur.role, 'user'::app_role) as user_role,
    au.email_confirmed_at
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
  LEFT JOIN auth.users au ON p.user_id = au.id
  WHERE has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
  ORDER BY p.created_at DESC;
$$;

-- Create function to update user role (only super admins can do this)
CREATE OR REPLACE FUNCTION public.update_user_role(_user_id UUID, _new_role app_role)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only super admins can update roles
  IF NOT has_role(auth.uid(), 'super_admin'::app_role) THEN
    RAISE EXCEPTION 'Only super admins can update user roles';
  END IF;
  
  -- Remove existing role
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  
  -- Add new role (unless it's 'user' which is default)
  IF _new_role != 'user' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, _new_role);
  END IF;
  
  RETURN true;
END;
$$;

-- Create function to ban/unban users
CREATE OR REPLACE FUNCTION public.update_user_status(_user_id UUID, _is_banned BOOLEAN, _ban_reason TEXT DEFAULT NULL)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only admins and super admins can ban users
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)) THEN
    RAISE EXCEPTION 'Only admins can update user status';
  END IF;
  
  UPDATE public.profiles 
  SET 
    is_banned = _is_banned,
    banned_at = CASE WHEN _is_banned THEN now() ELSE NULL END,
    banned_reason = CASE WHEN _is_banned THEN _ban_reason ELSE NULL END,
    updated_at = now()
  WHERE user_id = _user_id;
  
  RETURN true;
END;
$$;