import { Howl, Howler } from 'howler';

export interface SoundConfig {
  src: string[];
  volume?: number;
  loop?: boolean;
  sprite?: { [key: string]: [number, number] };
}

export interface RealmSounds {
  ambient: Howl;
  hover: Howl;
  select: Howl;
}

class SoundManager {
  private sounds: Map<string, Howl> = new Map();
  private realmSounds: Map<string, RealmSounds> = new Map();
  private currentAmbient: Howl | null = null;
  private masterVolume: number = 0.7;
  private uiVolume: number = 0.5;
  private ambientVolume: number = 0.3;
  private muted: boolean = false;

  constructor() {
    // Set global volume
    Howler.volume(this.masterVolume);
  }

  // Initialize sound system
  async initialize() {
    await this.loadUISounds();
    await this.loadRealmSounds();
  }

  // Load UI sounds
  private async loadUISounds() {
    const uiSounds = {
      click: {
        src: ['/sounds/ui/fyte-click.wav'],
        volume: this.uiVolume
      },
      hover: {
        src: ['/sounds/ui/menu-hover.wav'],
        volume: this.uiVolume * 0.7
      },
      transition: {
        src: ['/sounds/ui/page-transition.wav'],
        volume: this.uiVolume * 0.8
      },
      loading: {
        src: ['/sounds/ui/loading-pulse.wav'],
        volume: this.uiVolume * 0.6,
        loop: true
      }
    };

    for (const [name, config] of Object.entries(uiSounds)) {
      this.sounds.set(name, new Howl(config));
    }
  }

  // Load realm-specific sounds
  private async loadRealmSounds() {
    const realms = ['dark-arena', 'sci-fi-ai', 'fantasy-tech'];
    
    for (const realm of realms) {
      const realmSounds: RealmSounds = {
        ambient: new Howl({
          src: [`/sounds/realms/${realm}/ambient.wav`],
          volume: this.ambientVolume,
          loop: true
        }),
        hover: new Howl({
          src: [`/sounds/realms/${realm}/hover.wav`],
          volume: this.uiVolume * 0.8
        }),
        select: new Howl({
          src: [`/sounds/realms/${realm}/select.wav`],
          volume: this.uiVolume
        })
      };
      
      this.realmSounds.set(realm, realmSounds);
    }
  }

  // Play UI sound
  playUI(soundName: string, variant?: string) {
    if (this.muted) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.play();
    }
  }

  // Play realm hover sound
  playRealmHover(realmId: string) {
    if (this.muted) return;
    
    const realmSounds = this.realmSounds.get(realmId);
    if (realmSounds) {
      realmSounds.hover.play();
    }
  }

  // Play realm select sound and start ambient
  selectRealm(realmId: string) {
    if (this.muted) return;
    
    const realmSounds = this.realmSounds.get(realmId);
    if (realmSounds) {
      // Play select sound
      realmSounds.select.play();
      
      // Stop current ambient and start new one
      this.stopAmbient();
      this.currentAmbient = realmSounds.ambient;
      this.currentAmbient.play();
    }
  }

  // Stop ambient sound
  stopAmbient() {
    if (this.currentAmbient) {
      this.currentAmbient.stop();
      this.currentAmbient = null;
    }
  }

  // Volume controls
  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.masterVolume);
  }

  setUIVolume(volume: number) {
    this.uiVolume = Math.max(0, Math.min(1, volume));
    // Update existing UI sounds
    this.sounds.forEach(sound => {
      sound.volume(this.uiVolume);
    });
  }

  setAmbientVolume(volume: number) {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    // Update realm ambient sounds
    this.realmSounds.forEach(realmSounds => {
      realmSounds.ambient.volume(this.ambientVolume);
    });
  }

  // Mute/unmute
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      Howler.mute(true);
    } else {
      Howler.mute(false);
    }
    return this.muted;
  }

  // Get current state
  getState() {
    return {
      masterVolume: this.masterVolume,
      uiVolume: this.uiVolume,
      ambientVolume: this.ambientVolume,
      muted: this.muted,
      currentAmbient: this.currentAmbient !== null
    };
  }

  // Cleanup
  destroy() {
    this.stopAmbient();
    this.sounds.forEach(sound => sound.unload());
    this.realmSounds.forEach(realmSounds => {
      realmSounds.ambient.unload();
      realmSounds.hover.unload();
      realmSounds.select.unload();
    });
    this.sounds.clear();
    this.realmSounds.clear();
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// React hook for sound manager
export const useSoundManager = () => {
  return soundManager;
};