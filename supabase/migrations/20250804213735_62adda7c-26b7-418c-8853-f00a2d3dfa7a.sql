-- Create achievements table for user achievements system
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  points INTEGER NOT NULL DEFAULT 0,
  requirements JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table to track which users have earned which achievements
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  progress JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Create notifications table for user notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Enable RLS on new tables
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for achievements (public reading)
CREATE POLICY "Anyone can view achievements" 
ON public.achievements 
FOR SELECT 
USING (is_active = true);

-- RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample achievements
INSERT INTO public.achievements (name, description, icon, category, points, requirements) VALUES
('First Fighter', 'Purchase your first fighter shares', '⚔️', 'fighter', 100, '{"min_shares": 1}'),
('High Roller', 'Own 100+ shares in a single fighter', '💎', 'fighter', 500, '{"min_shares": 100}'),
('Betting Pro', 'Place your first bet', '🎲', 'betting', 50, '{"min_bets": 1}'),
('Win Streak', 'Win 5 bets in a row', '🔥', 'betting', 1000, '{"win_streak": 5}'),
('Tournament Watcher', 'Watch a complete tournament', '🏆', 'tournament', 200, '{"tournaments_watched": 1}'),
('Multi-World Investor', 'Own fighters from 3 different worlds', '🌍', 'fighter', 750, '{"min_worlds": 3}'),
('Big Spender', 'Spend over 10,000 credits', '💰', 'spending', 2000, '{"min_spent": 10000}'),
('Arena Veteran', 'Active for 30 days', '⭐', 'general', 1500, '{"min_days": 30}'),
('Social Butterfly', 'Share 10 fight results', '📱', 'social', 300, '{"shares": 10}'),
('Champion Picker', 'Back the winner in 10 fights', '🏅', 'betting', 1200, '{"correct_picks": 10}');