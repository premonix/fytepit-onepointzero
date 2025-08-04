-- Create subscription tiers enum
CREATE TYPE public.subscription_tier AS ENUM ('free', 'fractional', 'premium');

-- Create subscribers table for subscription management
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers table
CREATE POLICY "Users can view their own subscription" ON public.subscribers
FOR SELECT USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Edge functions can update subscriptions" ON public.subscribers
FOR UPDATE USING (true);

CREATE POLICY "Edge functions can insert subscriptions" ON public.subscribers
FOR INSERT WITH CHECK (true);

-- Create function to check subscription access
CREATE OR REPLACE FUNCTION public.has_subscription_access(_user_id uuid, _required_tier subscription_tier)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscribers
    WHERE user_id = _user_id
      AND subscribed = true
      AND subscription_end > now()
      AND CASE 
        WHEN _required_tier = 'free' THEN subscription_tier IN ('free', 'fractional', 'premium')
        WHEN _required_tier = 'fractional' THEN subscription_tier IN ('fractional', 'premium')
        WHEN _required_tier = 'premium' THEN subscription_tier = 'premium'
      END
  ) OR 
  -- Always allow free tier access
  _required_tier = 'free'
$$;

-- Create function to get user's current subscription
CREATE OR REPLACE FUNCTION public.get_user_subscription(_user_id uuid)
RETURNS subscription_tier
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT subscription_tier 
     FROM public.subscribers 
     WHERE user_id = _user_id 
       AND subscribed = true 
       AND subscription_end > now()
     LIMIT 1),
    'free'::subscription_tier
  )
$$;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_subscribers_updated_at 
BEFORE UPDATE ON public.subscribers 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create default subscription on user registration
CREATE OR REPLACE FUNCTION public.create_default_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.subscribers (user_id, email, subscription_tier, subscribed)
  VALUES (NEW.id, NEW.email, 'free', true);
  RETURN NEW;
END;
$$;

-- Create trigger for new user subscription
CREATE TRIGGER on_auth_user_subscription_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_subscription();