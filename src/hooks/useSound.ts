// Simplified sound hook that doesn't break the app
import { useCallback, useState } from 'react';

export const useSound = () => {
  const [muted, setMuted] = useState(false);

  console.log('useSound hook initialized'); // Debug log

  const playUI = useCallback((soundName: string, variant?: string) => {
    console.log(`Would play UI sound: ${soundName}${variant ? ` (${variant})` : ''}`);
    // For now, just log instead of playing actual sounds
  }, []);

  const playRealmHover = useCallback((realmId: string) => {
    console.log(`Would play realm hover sound for: ${realmId}`);
  }, []);

  const selectRealm = useCallback((realmId: string) => {
    console.log(`Would select realm and play ambient: ${realmId}`);
  }, []);

  const stopAmbient = useCallback(() => {
    console.log('Would stop ambient sound');
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    console.log(`Sound ${newMuted ? 'muted' : 'unmuted'}`);
    return newMuted;
  }, [muted]);

  return {
    muted,
    playUI,
    playRealmHover,
    selectRealm,
    stopAmbient,
    toggleMute,
    // Default values for other expected properties
    masterVolume: 0.7,
    uiVolume: 0.5,
    ambientVolume: 0.3,
    currentAmbient: false,
    setMasterVolume: () => {},
    setUIVolume: () => {},
    setAmbientVolume: () => {}
  };
};