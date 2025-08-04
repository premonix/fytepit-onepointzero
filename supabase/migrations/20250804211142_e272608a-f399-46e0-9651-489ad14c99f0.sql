-- Enhanced fight and tournament management tables

-- Tournament system
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  world TEXT NOT NULL,
  tournament_type TEXT DEFAULT 'single_elimination', -- 'single_elimination', 'double_elimination', 'round_robin'
  max_participants INTEGER NOT NULL DEFAULT 8,
  entry_fee NUMERIC DEFAULT 0,
  prize_pool NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'upcoming', -- 'upcoming', 'active', 'completed', 'cancelled'
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  winner_id TEXT REFERENCES public.fighters(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tournament participants
CREATE TABLE IF NOT EXISTS public.tournament_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  fighter_id TEXT REFERENCES public.fighters(id),
  seed_number INTEGER,
  is_eliminated BOOLEAN DEFAULT false,
  eliminated_round INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tournament_id, fighter_id)
);

-- Tournament rounds and matches
CREATE TABLE IF NOT EXISTS public.tournament_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  fight_id UUID REFERENCES public.fights(id),
  round_number INTEGER NOT NULL,
  match_number INTEGER NOT NULL,
  next_match_id UUID REFERENCES public.tournament_matches(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'scheduled', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_matches ENABLE ROW LEVEL SECURITY;

-- RLS policies for tournaments
CREATE POLICY "Anyone can view tournaments" 
ON public.tournaments 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage tournaments" 
ON public.tournaments 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS policies for tournament_participants
CREATE POLICY "Anyone can view tournament participants" 
ON public.tournament_participants 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage tournament participants" 
ON public.tournament_participants 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- RLS policies for tournament_matches
CREATE POLICY "Anyone can view tournament matches" 
ON public.tournament_matches 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage tournament matches" 
ON public.tournament_matches 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Enhanced fights table with scheduling
ALTER TABLE public.fights 
ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES public.tournaments(id),
ADD COLUMN IF NOT EXISTS fight_type TEXT DEFAULT 'exhibition', -- 'exhibition', 'tournament', 'championship'
ADD COLUMN IF NOT EXISTS rules JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS venue TEXT,
ADD COLUMN IF NOT EXISTS max_betting_amount NUMERIC;

-- Function to create a new fight
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
    CASE WHEN _scheduled_at IS NOT NULL THEN 'upcoming' ELSE 'pending' END
  )
  RETURNING id INTO fight_id;
  
  RETURN fight_id;
END;
$$;

-- Function to create tournament
CREATE OR REPLACE FUNCTION public.admin_create_tournament(
  _name TEXT,
  _description TEXT,
  _world TEXT,
  _tournament_type TEXT DEFAULT 'single_elimination',
  _max_participants INTEGER DEFAULT 8,
  _entry_fee NUMERIC DEFAULT 0,
  _prize_pool NUMERIC DEFAULT 0,
  _start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  tournament_id UUID;
BEGIN
  -- Only admins and super admins can create tournaments
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)) THEN
    RAISE EXCEPTION 'Only admins can create tournaments';
  END IF;
  
  INSERT INTO public.tournaments (
    name, description, world, tournament_type, max_participants,
    entry_fee, prize_pool, start_date, created_by
  ) VALUES (
    _name, _description, _world, _tournament_type, _max_participants,
    _entry_fee, _prize_pool, _start_date, auth.uid()
  )
  RETURNING id INTO tournament_id;
  
  RETURN tournament_id;
END;
$$;

-- Function to add fighter to tournament
CREATE OR REPLACE FUNCTION public.admin_add_tournament_fighter(
  _tournament_id UUID,
  _fighter_id TEXT,
  _seed_number INTEGER DEFAULT NULL
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  current_participants INTEGER;
  max_participants INTEGER;
BEGIN
  -- Only admins and super admins can manage tournaments
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)) THEN
    RAISE EXCEPTION 'Only admins can manage tournaments';
  END IF;
  
  -- Check if tournament exists and get max participants
  SELECT t.max_participants INTO max_participants
  FROM public.tournaments t
  WHERE t.id = _tournament_id;
  
  IF max_participants IS NULL THEN
    RAISE EXCEPTION 'Tournament not found';
  END IF;
  
  -- Check current participant count
  SELECT COUNT(*) INTO current_participants
  FROM public.tournament_participants
  WHERE tournament_id = _tournament_id;
  
  IF current_participants >= max_participants THEN
    RAISE EXCEPTION 'Tournament is full';
  END IF;
  
  -- Add fighter to tournament
  INSERT INTO public.tournament_participants (
    tournament_id, fighter_id, seed_number
  ) VALUES (
    _tournament_id, _fighter_id, 
    COALESCE(_seed_number, current_participants + 1)
  );
  
  RETURN true;
END;
$$;

-- Function to generate tournament bracket
CREATE OR REPLACE FUNCTION public.admin_generate_tournament_bracket(_tournament_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  participant_count INTEGER;
  round_count INTEGER;
  current_round INTEGER;
  match_count INTEGER;
  participants_cursor CURSOR FOR 
    SELECT fighter_id, seed_number 
    FROM public.tournament_participants 
    WHERE tournament_id = _tournament_id 
    ORDER BY seed_number;
  fighter_pairs TEXT[][];
  i INTEGER;
BEGIN
  -- Only admins and super admins can generate brackets
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)) THEN
    RAISE EXCEPTION 'Only admins can generate tournament brackets';
  END IF;
  
  -- Get participant count
  SELECT COUNT(*) INTO participant_count
  FROM public.tournament_participants
  WHERE tournament_id = _tournament_id;
  
  IF participant_count < 2 THEN
    RAISE EXCEPTION 'Need at least 2 participants to generate bracket';
  END IF;
  
  -- Calculate rounds needed (log2 of participants, rounded up)
  round_count := CEIL(LOG(2, participant_count));
  
  -- Clear existing matches
  DELETE FROM public.tournament_matches WHERE tournament_id = _tournament_id;
  
  -- Create first round matches
  current_round := 1;
  match_count := 0;
  
  FOR rec IN participants_cursor LOOP
    match_count := match_count + 1;
    
    -- Create fights for first round (simplified - would need more complex pairing logic)
    -- This is a basic implementation - in production you'd want more sophisticated bracket generation
    
    -- For now, just pair fighters sequentially
    -- Real implementation would handle seeding, byes, etc.
  END LOOP;
  
  -- Update tournament status
  UPDATE public.tournaments 
  SET status = 'active', updated_at = now()
  WHERE id = _tournament_id;
  
  RETURN true;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournament_matches_updated_at
  BEFORE UPDATE ON public.tournament_matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();