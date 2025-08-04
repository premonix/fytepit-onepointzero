-- Create tables for admin management functions

-- System settings table for platform configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Content moderation reports table
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id),
  reported_user_id UUID REFERENCES auth.users(id),
  reported_content_type TEXT NOT NULL, -- 'user', 'fighter', 'comment', etc.
  reported_content_id TEXT,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'dismissed'
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for system_settings
CREATE POLICY "Public settings are viewable by all" 
ON public.system_settings 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Admins can view all settings" 
ON public.system_settings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can manage settings" 
ON public.system_settings 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- RLS policies for user_reports
CREATE POLICY "Users can create reports" 
ON public.user_reports 
FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" 
ON public.user_reports 
FOR SELECT 
USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports" 
ON public.user_reports 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can update reports" 
ON public.user_reports 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admin functions for fighter management
CREATE OR REPLACE FUNCTION public.admin_create_fighter(
  _id TEXT,
  _name TEXT,
  _world TEXT,
  _image TEXT,
  _attack INTEGER,
  _defense INTEGER,
  _speed INTEGER,
  _health INTEGER,
  _description TEXT DEFAULT NULL,
  _backstory TEXT DEFAULT NULL,
  _special_move TEXT DEFAULT NULL,
  _abilities TEXT[] DEFAULT NULL
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only admins and super admins can create fighters
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)) THEN
    RAISE EXCEPTION 'Only admins can create fighters';
  END IF;
  
  INSERT INTO public.fighters (
    id, name, world, image, attack, defense, speed, health,
    description, backstory, special_move, abilities
  ) VALUES (
    _id, _name, _world, _image, _attack, _defense, _speed, _health,
    _description, _backstory, _special_move, _abilities
  );
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_fighter(
  _id TEXT,
  _name TEXT,
  _world TEXT,
  _image TEXT,
  _attack INTEGER,
  _defense INTEGER,
  _speed INTEGER,
  _health INTEGER,
  _description TEXT DEFAULT NULL,
  _backstory TEXT DEFAULT NULL,
  _special_move TEXT DEFAULT NULL,
  _abilities TEXT[] DEFAULT NULL
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only admins and super admins can update fighters
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)) THEN
    RAISE EXCEPTION 'Only admins can update fighters';
  END IF;
  
  UPDATE public.fighters 
  SET 
    name = _name,
    world = _world,
    image = _image,
    attack = _attack,
    defense = _defense,
    speed = _speed,
    health = _health,
    description = _description,
    backstory = _backstory,
    special_move = _special_move,
    abilities = _abilities,
    updated_at = now()
  WHERE id = _id;
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_fighter(_fighter_id TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only super admins can delete fighters
  IF NOT has_role(auth.uid(), 'super_admin'::app_role) THEN
    RAISE EXCEPTION 'Only super admins can delete fighters';
  END IF;
  
  DELETE FROM public.fighters WHERE id = _fighter_id;
  
  RETURN true;
END;
$$;

-- Function to get comprehensive analytics
CREATE OR REPLACE FUNCTION public.get_admin_analytics()
RETURNS JSON
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
BEGIN
  -- Only admins and super admins can view analytics
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)) THEN
    RAISE EXCEPTION 'Only admins can view analytics';
  END IF;
  
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM public.profiles),
    'active_users', (SELECT COUNT(*) FROM public.profiles WHERE is_active = true AND is_banned = false),
    'banned_users', (SELECT COUNT(*) FROM public.profiles WHERE is_banned = true),
    'total_fighters', (SELECT COUNT(*) FROM public.fighters),
    'total_fights', (SELECT COUNT(*) FROM public.fights),
    'completed_fights', (SELECT COUNT(*) FROM public.fights WHERE status = 'completed'),
    'pending_fights', (SELECT COUNT(*) FROM public.fights WHERE status = 'upcoming'),
    'total_bets', (SELECT COUNT(*) FROM public.bets),
    'total_bet_amount', (SELECT COALESCE(SUM(amount), 0) FROM public.bets),
    'total_transactions', (SELECT COUNT(*) FROM public.transactions),
    'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM public.transactions WHERE type = 'purchase'),
    'pending_reports', (SELECT COUNT(*) FROM public.user_reports WHERE status = 'pending'),
    'users_by_role', (
      SELECT json_object_agg(
        COALESCE(ur.role, 'user'), 
        user_count
      )
      FROM (
        SELECT 
          ur.role,
          COUNT(*) as user_count
        FROM public.profiles p
        LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
        GROUP BY ur.role
        
        UNION ALL
        
        SELECT 
          'user' as role,
          COUNT(*) as user_count
        FROM public.profiles p
        WHERE NOT EXISTS (
          SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.user_id
        )
      ) role_counts
    ),
    'recent_activity', (
      SELECT json_agg(
        json_build_object(
          'type', 'user_joined',
          'timestamp', created_at,
          'user_email', 'New user'
        )
      )
      FROM public.profiles 
      ORDER BY created_at DESC 
      LIMIT 10
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to update fight outcomes
CREATE OR REPLACE FUNCTION public.admin_update_fight(
  _fight_id UUID,
  _winner_id TEXT DEFAULT NULL,
  _status TEXT DEFAULT NULL
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only admins and super admins can update fights
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)) THEN
    RAISE EXCEPTION 'Only admins can update fights';
  END IF;
  
  UPDATE public.fights 
  SET 
    winner_id = COALESCE(_winner_id, winner_id),
    status = COALESCE(_status, status),
    completed_at = CASE 
      WHEN _status = 'completed' AND completed_at IS NULL THEN now()
      ELSE completed_at
    END,
    updated_at = now()
  WHERE id = _fight_id;
  
  RETURN true;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_reports_updated_at
  BEFORE UPDATE ON public.user_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, description, category, is_public) VALUES
('platform_name', '"FYTEPIT"', 'Platform display name', 'general', true),
('maintenance_mode', 'false', 'Enable maintenance mode', 'general', false),
('user_registration', 'true', 'Allow new user registration', 'auth', false),
('betting_enabled', 'true', 'Enable betting functionality', 'features', true),
('fight_creation_enabled', 'true', 'Enable fight creation', 'features', false),
('max_bet_amount', '1000', 'Maximum bet amount per user', 'limits', true),
('min_bet_amount', '10', 'Minimum bet amount', 'limits', true)
ON CONFLICT (setting_key) DO NOTHING;