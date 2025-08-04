import { useState, useCallback } from 'react';

export const useSound = () => {
  const [muted, setMuted] = useState(false);

  const playTone = useCallback((frequency: number, duration: number = 200) => {
    if (muted) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      // Audio not supported
    }
  }, [muted]);

  const playUI = useCallback((type: string, variant?: string) => {
    const tones = {
      click: 800,
      hover: 600,
      transition: 400
    };
    playTone(tones[type as keyof typeof tones] || 500, 150);
  }, [playTone]);

  const playRealmHover = useCallback((realmId: string) => {
    const realmTones = {
      'dark-arena': 300,
      'sci-fi-ai': 800,
      'fantasy-tech': 500
    };
    playTone(realmTones[realmId as keyof typeof realmTones] || 400, 300);
  }, [playTone]);

  const selectRealm = useCallback((realmId: string) => {
    playRealmHover(realmId);
  }, [playRealmHover]);

  const stopAmbient = useCallback(() => {
    // Placeholder for ambient sound stopping
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  return {
    playUI,
    playRealmHover,
    selectRealm,
    stopAmbient,
    toggleMute,
    muted
  };
};