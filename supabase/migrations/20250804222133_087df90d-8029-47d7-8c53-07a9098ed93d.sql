-- Create function to complete fight and update all related data
CREATE OR REPLACE FUNCTION public.complete_fight_with_stats(
  _fight_id uuid,
  _winner_id text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  fight_record RECORD;
  bet_record RECORD;
  total_losing_bets NUMERIC := 0;
  total_winning_bets NUMERIC := 0;
  winning_odds NUMERIC := 2.0; -- Default odds
BEGIN
  -- Get fight details
  SELECT * INTO fight_record FROM public.fights WHERE id = _fight_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Fight not found';
  END IF;
  
  -- Update fight status and winner
  UPDATE public.fights 
  SET 
    status = 'completed',
    winner_id = _winner_id,
    completed_at = now(),
    updated_at = now()
  WHERE id = _fight_id;
  
  -- Update fighter stats
  IF _winner_id = fight_record.fighter1_id THEN
    -- Fighter 1 wins
    UPDATE public.fighters 
    SET wins = wins + 1, updated_at = now()
    WHERE id = fight_record.fighter1_id;
    
    UPDATE public.fighters 
    SET losses = losses + 1, updated_at = now()
    WHERE id = fight_record.fighter2_id;
  ELSIF _winner_id = fight_record.fighter2_id THEN
    -- Fighter 2 wins
    UPDATE public.fighters 
    SET wins = wins + 1, updated_at = now()
    WHERE id = fight_record.fighter2_id;
    
    UPDATE public.fighters 
    SET losses = losses + 1, updated_at = now()
    WHERE id = fight_record.fighter1_id;
  END IF;
  
  -- Calculate total bets for odds calculation
  SELECT 
    COALESCE(SUM(CASE WHEN fighter_id = _winner_id THEN amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN fighter_id != _winner_id THEN amount ELSE 0 END), 0)
  INTO total_winning_bets, total_losing_bets
  FROM public.bets 
  WHERE fight_id = _fight_id;
  
  -- Calculate dynamic odds (if there are winning bets)
  IF total_winning_bets > 0 THEN
    winning_odds := GREATEST(1.1, (total_losing_bets + total_winning_bets) / total_winning_bets);
  END IF;
  
  -- Process all bets for this fight
  FOR bet_record IN 
    SELECT * FROM public.bets WHERE fight_id = _fight_id AND status = 'pending'
  LOOP
    IF bet_record.fighter_id = _winner_id THEN
      -- Winning bet - calculate payout
      DECLARE
        payout_amount NUMERIC := bet_record.amount * winning_odds;
      BEGIN
        -- Update bet as won
        UPDATE public.bets 
        SET 
          status = 'won',
          payout = payout_amount,
          updated_at = now()
        WHERE id = bet_record.id;
        
        -- Add winnings to user balance
        UPDATE public.profiles 
        SET 
          total_balance = total_balance + payout_amount,
          updated_at = now()
        WHERE user_id = bet_record.user_id;
        
        -- Create transaction record for winnings
        INSERT INTO public.transactions (
          user_id, type, amount, description, created_at
        ) VALUES (
          bet_record.user_id, 
          'bet_winnings', 
          payout_amount,
          'Winnings from fight bet on ' || _winner_id,
          now()
        );
        
        -- Create notification for winner
        INSERT INTO public.notifications (
          user_id, type, title, message, data, created_at
        ) VALUES (
          bet_record.user_id,
          'bet_won',
          'Bet Won!',
          'Your bet on ' || _winner_id || ' won! You earned ' || payout_amount || ' credits.',
          json_build_object('fight_id', _fight_id, 'amount', payout_amount, 'fighter_id', _winner_id),
          now()
        );
      END;
    ELSE
      -- Losing bet
      UPDATE public.bets 
      SET 
        status = 'lost',
        payout = 0,
        updated_at = now()
      WHERE id = bet_record.id;
      
      -- Create notification for loser
      INSERT INTO public.notifications (
        user_id, type, title, message, data, created_at
      ) VALUES (
        bet_record.user_id,
        'bet_lost',
        'Bet Lost',
        'Your bet didn\'t win this time. Better luck next fight!',
        json_build_object('fight_id', _fight_id, 'fighter_id', bet_record.fighter_id),
        now()
      );
    END IF;
  END LOOP;
  
  -- Update fight total pot
  UPDATE public.fights 
  SET total_pot = total_winning_bets + total_losing_bets
  WHERE id = _fight_id;
  
  -- Check for user achievements
  FOR bet_record IN 
    SELECT DISTINCT user_id FROM public.bets WHERE fight_id = _fight_id
  LOOP
    PERFORM public.check_user_achievements(bet_record.user_id);
  END LOOP;
  
  RETURN true;
END;
$function$;

-- Create function to get fight statistics
CREATE OR REPLACE FUNCTION public.get_fight_statistics(_fight_id uuid)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
AS $function$
  SELECT json_build_object(
    'fight', (
      SELECT json_build_object(
        'id', f.id,
        'status', f.status,
        'winner_id', f.winner_id,
        'total_pot', f.total_pot,
        'completed_at', f.completed_at,
        'fighter1', json_build_object(
          'id', f1.id,
          'name', f1.name,
          'wins', f1.wins,
          'losses', f1.losses
        ),
        'fighter2', json_build_object(
          'id', f2.id,
          'name', f2.name,
          'wins', f2.wins,
          'losses', f2.losses
        )
      )
      FROM public.fights f
      JOIN public.fighters f1 ON f.fighter1_id = f1.id
      JOIN public.fighters f2 ON f.fighter2_id = f2.id
      WHERE f.id = _fight_id
    ),
    'betting_stats', (
      SELECT json_build_object(
        'total_bets', COUNT(*),
        'total_amount', COALESCE(SUM(amount), 0),
        'winning_bets', COUNT(*) FILTER (WHERE status = 'won'),
        'losing_bets', COUNT(*) FILTER (WHERE status = 'lost'),
        'pending_bets', COUNT(*) FILTER (WHERE status = 'pending'),
        'total_payouts', COALESCE(SUM(payout), 0)
      )
      FROM public.bets
      WHERE fight_id = _fight_id
    ),
    'fighter1_bets', (
      SELECT json_build_object(
        'total_amount', COALESCE(SUM(amount), 0),
        'bet_count', COUNT(*),
        'average_bet', COALESCE(AVG(amount), 0)
      )
      FROM public.bets b
      JOIN public.fights f ON b.fight_id = f.id
      WHERE b.fight_id = _fight_id AND b.fighter_id = f.fighter1_id
    ),
    'fighter2_bets', (
      SELECT json_build_object(
        'total_amount', COALESCE(SUM(amount), 0),
        'bet_count', COUNT(*),
        'average_bet', COALESCE(AVG(amount), 0)
      )
      FROM public.bets b
      JOIN public.fights f ON b.fight_id = f.id
      WHERE b.fight_id = _fight_id AND b.fighter_id = f.fighter2_id
    )
  );
$function$;