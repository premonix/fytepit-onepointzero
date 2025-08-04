-- Fix the admin_create_fight function to use valid status values
CREATE OR REPLACE FUNCTION public.admin_create_fight(
  _fighter1_id TEXT,
  _fighter2_id TEXT,
  _fight_type TEXT DEFAULT 'exhibition',
  _scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  _venue TEXT DEFAULT NULL,
  _max_betting_amount NUMERIC DEFAULT NULL,
  _tournament_id UUID DEFAULT NULL,
  _rules JSONB DEFAULT '{}'
)
RETURNS UUID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  fight_id UUID;
BEGIN
  -- Only admins and super admins can create fights
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)) THEN
    RAISE EXCEPTION 'Only admins can create fights';
  END IF;
  
  -- Validate fighters exist and are different
  IF _fighter1_id = _fighter2_id THEN
    RAISE EXCEPTION 'Fighter cannot fight themselves';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.fighters WHERE id = _fighter1_id) OR
     NOT EXISTS (SELECT 1 FROM public.fighters WHERE id = _fighter2_id) THEN
    RAISE EXCEPTION 'One or both fighters do not exist';
  END IF;
  
  INSERT INTO public.fights (
    fighter1_id, fighter2_id, fight_type, scheduled_at, venue, 
    max_betting_amount, tournament_id, rules, status
  ) VALUES (
    _fighter1_id, _fighter2_id, _fight_type, _scheduled_at, _venue,
    _max_betting_amount, _tournament_id, _rules, 
    -- Use 'upcoming' status instead of 'pending' to match constraint
    'upcoming'
  )
  RETURNING id INTO fight_id;
  
  RETURN fight_id;
END;
$$;