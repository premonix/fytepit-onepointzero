-- Create functions to help with user feature functionality

-- Function to create a notification for a user
CREATE OR REPLACE FUNCTION public.create_notification(
  _user_id UUID,
  _type TEXT,
  _title TEXT,
  _message TEXT,
  _data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (_user_id, _type, _title, _message, _data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Function to get user's fight history (fights they've bet on)
CREATE OR REPLACE FUNCTION public.get_user_fight_history(_user_id UUID)
RETURNS TABLE(
  fight_id UUID,
  fighter1_name TEXT,
  fighter2_name TEXT,
  winner_name TEXT,
  bet_amount NUMERIC,
  bet_outcome TEXT,
  payout NUMERIC,
  fight_date TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    f.id as fight_id,
    f1.name as fighter1_name,
    f2.name as fighter2_name,
    fw.name as winner_name,
    b.amount as bet_amount,
    CASE 
      WHEN f.winner_id = b.fighter_id THEN 'won'
      WHEN f.winner_id IS NOT NULL AND f.winner_id != b.fighter_id THEN 'lost'
      ELSE 'pending'
    END as bet_outcome,
    b.payout,
    f.completed_at as fight_date
  FROM public.bets b
  JOIN public.fights f ON b.fight_id = f.id
  JOIN public.fighters f1 ON f.fighter1_id = f1.id
  JOIN public.fighters f2 ON f.fighter2_id = f2.id
  LEFT JOIN public.fighters fw ON f.winner_id = fw.id
  WHERE b.user_id = _user_id
  ORDER BY f.completed_at DESC NULLS LAST, f.created_at DESC;
$$;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION public.check_user_achievements(_user_id UUID)
RETURNS TABLE(new_achievement_id UUID, achievement_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_stats RECORD;
  achievement_record RECORD;
  new_achievement_id UUID;
  achievement_name TEXT;
BEGIN
  -- Get user statistics
  SELECT 
    COALESCE(SUM(uf.shares), 0) as total_shares,
    COUNT(DISTINCT uf.fighter_id) as fighters_owned,
    COUNT(DISTINCT f.world) as worlds_represented,
    COALESCE(SUM(uf.total_investment), 0) as total_investment,
    COUNT(b.id) as total_bets,
    COUNT(CASE WHEN f.winner_id = b.fighter_id THEN 1 END) as winning_bets,
    EXTRACT(days FROM now() - p.created_at) as days_active
  INTO user_stats
  FROM public.profiles p
  LEFT JOIN public.user_fighters uf ON p.user_id = uf.user_id
  LEFT JOIN public.fighters f ON uf.fighter_id = f.id
  LEFT JOIN public.bets b ON p.user_id = b.user_id
  LEFT JOIN public.fights fight ON b.fight_id = fight.id
  WHERE p.user_id = _user_id
  GROUP BY p.user_id, p.created_at;

  -- Check each achievement
  FOR achievement_record IN 
    SELECT a.* FROM public.achievements a 
    WHERE a.is_active = true 
    AND NOT EXISTS (
      SELECT 1 FROM public.user_achievements ua 
      WHERE ua.user_id = _user_id AND ua.achievement_id = a.id
    )
  LOOP
    -- Check if user qualifies for this achievement
    CASE achievement_record.name
      WHEN 'First Fighter' THEN
        IF user_stats.fighters_owned >= 1 THEN
          INSERT INTO public.user_achievements (user_id, achievement_id)
          VALUES (_user_id, achievement_record.id)
          RETURNING achievement_id INTO new_achievement_id;
          
          new_achievement_id := achievement_record.id;
          achievement_name := achievement_record.name;
          RETURN NEXT;
        END IF;
        
      WHEN 'Multi-World Investor' THEN
        IF user_stats.worlds_represented >= 3 THEN
          INSERT INTO public.user_achievements (user_id, achievement_id)
          VALUES (_user_id, achievement_record.id);
          
          new_achievement_id := achievement_record.id;
          achievement_name := achievement_record.name;
          RETURN NEXT;
        END IF;
        
      WHEN 'Betting Pro' THEN
        IF user_stats.total_bets >= 1 THEN
          INSERT INTO public.user_achievements (user_id, achievement_id)
          VALUES (_user_id, achievement_record.id);
          
          new_achievement_id := achievement_record.id;
          achievement_name := achievement_record.name;
          RETURN NEXT;
        END IF;
        
      WHEN 'Champion Picker' THEN
        IF user_stats.winning_bets >= 10 THEN
          INSERT INTO public.user_achievements (user_id, achievement_id)
          VALUES (_user_id, achievement_record.id);
          
          new_achievement_id := achievement_record.id;
          achievement_name := achievement_record.name;
          RETURN NEXT;
        END IF;
        
      WHEN 'Big Spender' THEN
        IF user_stats.total_investment >= 10000 THEN
          INSERT INTO public.user_achievements (user_id, achievement_id)
          VALUES (_user_id, achievement_record.id);
          
          new_achievement_id := achievement_record.id;
          achievement_name := achievement_record.name;
          RETURN NEXT;
        END IF;
        
      WHEN 'Arena Veteran' THEN
        IF user_stats.days_active >= 30 THEN
          INSERT INTO public.user_achievements (user_id, achievement_id)
          VALUES (_user_id, achievement_record.id);
          
          new_achievement_id := achievement_record.id;
          achievement_name := achievement_record.name;
          RETURN NEXT;
        END IF;
        
      ELSE
        -- Default case for other achievements
        CONTINUE;
    END CASE;
  END LOOP;
  
  RETURN;
END;
$$;