-- Fix the get_admin_analytics function with proper GROUP BY
DROP FUNCTION IF EXISTS public.get_admin_analytics();

CREATE OR REPLACE FUNCTION public.get_admin_analytics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
      SELECT COALESCE(json_object_agg(role_name, user_count), '{}')
      FROM (
        SELECT 
          COALESCE(ur.role::text, 'user') as role_name,
          COUNT(*) as user_count
        FROM public.profiles p
        LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
        GROUP BY ur.role
      ) role_counts
    ),
    'recent_activity', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'type', 'user_joined',
          'timestamp', created_at,
          'user_email', 'New user'
        ) ORDER BY created_at DESC
      ), '[]')
      FROM (
        SELECT created_at 
        FROM public.profiles 
        ORDER BY created_at DESC 
        LIMIT 10
      ) recent_users
    )
  ) INTO result;
  
  RETURN result;
END;
$function$;