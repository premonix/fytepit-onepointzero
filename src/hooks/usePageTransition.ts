import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSound } from '@/hooks/useSound';

export const usePageTransition = () => {
  const location = useLocation();
  const { playUI } = useSound();

  useEffect(() => {
    // Play transition sound when route changes
    playUI('transition');
  }, [location.pathname, playUI]);
};

export default usePageTransition;