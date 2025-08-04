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
  winning_odds NUMERIC := 2.0;
  payout_amount NUMERIC;
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
    UPDATE public.fighters 
    SET wins = wins + 1, updated_at = now()
    WHERE id = fight_record.fighter1_id;
    
    UPDATE public.fighters 
    SET losses = losses + 1, updated_at = now()
    WHERE id = fight_record.fighter2_id;
  ELSIF _winner_id = fight_record.fighter2_id THEN
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
  
  -- Calculate dynamic odds
  IF total_winning_bets > 0 THEN
    winning_odds := GREATEST(1.1, (total_losing_bets + total_winning_bets) / total_winning_bets);
  END IF;
  
  -- Process all bets for this fight
  FOR bet_record IN 
    SELECT * FROM public.bets WHERE fight_id = _fight_id AND status = 'pending'
  LOOP
    IF bet_record.fighter_id = _winner_id THEN
      -- Winning bet
      payout_amount := bet_record.amount * winning_odds;
      
      UPDATE public.bets 
      SET 
        status = 'won',
        payout = payout_amount,
        updated_at = now()
      WHERE id = bet_record.id;
      
      UPDATE public.profiles 
      SET 
        total_balance = total_balance + payout_amount,
        updated_at = now()
      WHERE user_id = bet_record.user_id;
      
      INSERT INTO public.transactions (
        user_id, type, amount, description, created_at
      ) VALUES (
        bet_record.user_id, 
        'bet_winnings', 
        payout_amount,
        'Winnings from fight bet on ' || _winner_id,
        now()
      );
      
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
    ELSE
      -- Losing bet
      UPDATE public.bets 
      SET 
        status = 'lost',
        payout = 0,
        updated_at = now()
      WHERE id = bet_record.id;
      
      INSERT INTO public.notifications (
        user_id, type, title, message, data, created_at
      ) VALUES (
        bet_record.user_id,
        'bet_lost',
        'Bet Lost',
        'Your bet did not win this time. Better luck next fight!',
        json_build_object('fight_id', _fight_id, 'fighter_id', bet_record.fighter_id),
        now()
      );
    END IF;
  END LOOP;
  
  -- Update fight total pot
  UPDATE public.fights 
  SET total_pot = total_winning_bets + total_losing_bets
  WHERE id = _fight_id;
  
  RETURN true;
END;
$function$;