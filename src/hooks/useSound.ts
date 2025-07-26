import { useCallback, useEffect, useState } from 'react';
import { soundManager } from '@/services/SoundManager';

export const useSound = () => {
  const [soundState, setSoundState] = useState(soundManager.getState());

  useEffect(() => {
    // Initialize sound manager
    soundManager.initialize().catch(console.error);
    
    // Update state periodically or on events
    const updateState = () => setSoundState(soundManager.getState());
    const interval = setInterval(updateState, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const playUI = useCallback((soundName: string, variant?: string) => {
    soundManager.playUI(soundName, variant);
  }, []);

  const playRealmHover = useCallback((realmId: string) => {
    soundManager.playRealmHover(realmId);
  }, []);

  const selectRealm = useCallback((realmId: string) => {
    soundManager.selectRealm(realmId);
  }, []);

  const stopAmbient = useCallback(() => {
    soundManager.stopAmbient();
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    soundManager.setMasterVolume(volume);
    setSoundState(soundManager.getState());
  }, []);

  const setUIVolume = useCallback((volume: number) => {
    soundManager.setUIVolume(volume);
    setSoundState(soundManager.getState());
  }, []);

  const setAmbientVolume = useCallback((volume: number) => {
    soundManager.setAmbientVolume(volume);
    setSoundState(soundManager.getState());
  }, []);

  const toggleMute = useCallback(() => {
    const muted = soundManager.toggleMute();
    setSoundState(soundManager.getState());
    return muted;
  }, []);

  return {
    ...soundState,
    playUI,
    playRealmHover,
    selectRealm,
    stopAmbient,
    setMasterVolume,
    setUIVolume,
    setAmbientVolume,
    toggleMute
  };
};