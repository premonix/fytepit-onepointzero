-- Enhanced tournament bracket generation and management

-- Update the tournament bracket generation function to actually create matches
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
  participants_record RECORD;
  fighter_pairs TEXT[][];
  i INTEGER := 1;
  j INTEGER := 1;
  fight_id UUID;
  match_id UUID;
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
  
  -- Clear existing matches and fights
  DELETE FROM public.tournament_matches WHERE tournament_id = _tournament_id;
  
  -- Create first round matches
  current_round := 1;
  match_count := 0;
  
  -- Get participants ordered by seed
  FOR participants_record IN 
    SELECT fighter_id, seed_number 
    FROM public.tournament_participants 
    WHERE tournament_id = _tournament_id 
    ORDER BY seed_number
  LOOP
    -- Pair fighters for first round (1 vs 8, 2 vs 7, 3 vs 6, 4 vs 5 for 8-fighter tournament)
    IF i = 1 THEN
      fighter_pairs[j][1] := participants_record.fighter_id;
      i := 2;
    ELSE
      fighter_pairs[j][2] := participants_record.fighter_id;
      i := 1;
      j := j + 1;
    END IF;
  END LOOP;
  
  -- Create fights and matches for first round
  FOR k IN 1..array_length(fighter_pairs, 1) LOOP
    IF fighter_pairs[k][1] IS NOT NULL AND fighter_pairs[k][2] IS NOT NULL THEN
      -- Create the fight
      SELECT public.admin_create_fight(
        fighter_pairs[k][1],
        fighter_pairs[k][2],
        'tournament',
        NULL, -- scheduled_at
        'Tournament Arena',
        NULL, -- max_betting_amount
        _tournament_id,
        '{"rounds": 3, "time_limit": 300}'::jsonb
      ) INTO fight_id;
      
      -- Create tournament match record
      INSERT INTO public.tournament_matches (
        tournament_id, fight_id, round_number, match_number, status
      ) VALUES (
        _tournament_id, fight_id, 1, k, 'pending'
      ) RETURNING id INTO match_id;
      
      match_count := match_count + 1;
    END IF;
  END LOOP;
  
  -- Update tournament status
  UPDATE public.tournaments 
  SET status = 'active', updated_at = now()
  WHERE id = _tournament_id;
  
  RETURN true;
END;
$$;

-- Function to advance tournament round
CREATE OR REPLACE FUNCTION public.admin_advance_tournament_round(
  _tournament_id UUID,
  _current_round INTEGER
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  completed_matches INTEGER;
  total_matches INTEGER;
  next_round INTEGER;
  winner_record RECORD;
  match_number INTEGER := 1;
  fight_id UUID;
  next_match_id UUID;
BEGIN
  -- Only admins and super admins can advance rounds
  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)) THEN
    RAISE EXCEPTION 'Only admins can advance tournament rounds';
  END IF;
  
  -- Check if all matches in current round are completed
  SELECT 
    COUNT(*) FILTER (WHERE f.status = 'completed'),
    COUNT(*)
  INTO completed_matches, total_matches
  FROM public.tournament_matches tm
  JOIN public.fights f ON tm.fight_id = f.id
  WHERE tm.tournament_id = _tournament_id 
    AND tm.round_number = _current_round;
  
  IF completed_matches < total_matches THEN
    RAISE EXCEPTION 'Not all matches in round % are completed', _current_round;
  END IF;
  
  -- If this was the final round, complete the tournament
  IF total_matches = 1 THEN
    -- Get the winner of the final match
    SELECT f.winner_id INTO winner_record
    FROM public.tournament_matches tm
    JOIN public.fights f ON tm.fight_id = f.id
    WHERE tm.tournament_id = _tournament_id 
      AND tm.round_number = _current_round;
    
    -- Update tournament with winner
    UPDATE public.tournaments 
    SET 
      status = 'completed',
      winner_id = winner_record.winner_id,
      end_date = now(),
      updated_at = now()
    WHERE id = _tournament_id;
    
    RETURN true;
  END IF;
  
  -- Create next round matches
  next_round := _current_round + 1;
  
  -- Get winners from current round and pair them
  FOR winner_record IN
    SELECT f.winner_id, tm.match_number,
           ROW_NUMBER() OVER (ORDER BY tm.match_number) as winner_order
    FROM public.tournament_matches tm
    JOIN public.fights f ON tm.fight_id = f.id
    WHERE tm.tournament_id = _tournament_id 
      AND tm.round_number = _current_round
      AND f.winner_id IS NOT NULL
    ORDER BY tm.match_number
  LOOP
    -- Pair winners (1st vs 2nd, 3rd vs 4th, etc.)
    IF winner_record.winner_order % 2 = 1 THEN
      -- Store first fighter of the pair
      -- We'll create the fight when we get the second fighter
      CONTINUE;
    ELSE
      -- Get the previous winner (first fighter of this pair)
      WITH previous_winner AS (
        SELECT f.winner_id
        FROM public.tournament_matches tm
        JOIN public.fights f ON tm.fight_id = f.id
        WHERE tm.tournament_id = _tournament_id 
          AND tm.round_number = _current_round
        ORDER BY tm.match_number
        LIMIT 1 OFFSET (winner_record.winner_order - 2)
      )
      SELECT public.admin_create_fight(
        (SELECT winner_id FROM previous_winner),
        winner_record.winner_id,
        'tournament',
        NULL,
        'Tournament Arena',
        NULL,
        _tournament_id,
        '{"rounds": 3, "time_limit": 300}'::jsonb
      ) INTO fight_id;
      
      -- Create tournament match record
      INSERT INTO public.tournament_matches (
        tournament_id, fight_id, round_number, match_number, status
      ) VALUES (
        _tournament_id, fight_id, next_round, match_number, 'pending'
      );
      
      match_number := match_number + 1;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$;

-- Function to get tournament bracket data
CREATE OR REPLACE FUNCTION public.get_tournament_bracket(_tournament_id UUID)
RETURNS JSON
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'tournament', (
      SELECT json_build_object(
        'id', t.id,
        'name', t.name,
        'status', t.status,
        'tournament_type', t.tournament_type,
        'max_participants', t.max_participants,
        'winner_id', t.winner_id
      )
      FROM public.tournaments t
      WHERE t.id = _tournament_id
    ),
    'participants', (
      SELECT json_agg(
        json_build_object(
          'fighter_id', tp.fighter_id,
          'seed_number', tp.seed_number,
          'is_eliminated', tp.is_eliminated,
          'fighter', json_build_object(
            'id', f.id,
            'name', f.name,
            'image', f.image,
            'world', f.world
          )
        )
      )
      FROM public.tournament_participants tp
      JOIN public.fighters f ON tp.fighter_id = f.id
      WHERE tp.tournament_id = _tournament_id
      ORDER BY tp.seed_number
    ),
    'rounds', (
      SELECT json_agg(
        json_build_object(
          'round_number', round_data.round_number,
          'matches', round_data.matches
        ) ORDER BY round_data.round_number
      )
      FROM (
        SELECT 
          tm.round_number,
          json_agg(
            json_build_object(
              'match_id', tm.id,
              'match_number', tm.match_number,
              'fight_id', tm.fight_id,
              'status', tm.status,
              'fight', json_build_object(
                'id', f.id,
                'fighter1_id', f.fighter1_id,
                'fighter2_id', f.fighter2_id,
                'winner_id', f.winner_id,
                'status', f.status,
                'fighter1', json_build_object(
                  'id', f1.id,
                  'name', f1.name,
                  'image', f1.image
                ),
                'fighter2', json_build_object(
                  'id', f2.id,
                  'name', f2.name,
                  'image', f2.image
                )
              )
            ) ORDER BY tm.match_number
          ) as matches
        FROM public.tournament_matches tm
        JOIN public.fights f ON tm.fight_id = f.id
        JOIN public.fighters f1 ON f.fighter1_id = f1.id
        JOIN public.fighters f2 ON f.fighter2_id = f2.id
        WHERE tm.tournament_id = _tournament_id
        GROUP BY tm.round_number
      ) round_data
    )
  ) INTO result;
  
  RETURN result;
END;
$$;