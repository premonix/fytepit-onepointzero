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
  private backgroundMusic: Howl | null = null;
  private masterVolume: number = 0.7;
  private uiVolume: number = 0.5;
  private ambientVolume: number = 0.3;
  private musicVolume: number = 0.4;
  private muted: boolean = false;
  private musicPlaying: boolean = false;
  private userInteracted: boolean = false;

  constructor() {
    // Set global volume
    Howler.volume(this.masterVolume);
  }

  // Initialize sound system
  async initialize() {
    console.log('🎵 Initializing Sound Manager...');
    // Skip UI and realm sounds for now since files don't exist
    // await this.loadUISounds();
    // await this.loadRealmSounds();
    await this.loadBackgroundMusic();
    this.setupUserInteractionListener();
    console.log('✅ Sound Manager initialized');
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
    console.log(`🔊 UI sound request: ${soundName} (skipped - no UI sounds loaded)`);
    // Skip UI sounds since files don't exist
    // const sound = this.sounds.get(soundName);
    // if (sound) {
    //   sound.play();
    // }
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

  // Load background music
  private async loadBackgroundMusic() {
    console.log('Loading background music from GitHub...');
    this.backgroundMusic = new Howl({
      src: ['https://raw.githubusercontent.com/premonix/fytepit-onepointzero/main/public/background.mp3'],
      volume: this.musicVolume,
      loop: true,
      onload: () => {
        console.log('✅ Background music loaded successfully');
      },
      onloaderror: (error) => {
        console.error('❌ Background music could not be loaded from GitHub:', error);
      },
      onplay: () => {
        console.log('🎵 Background music started playing');
      },
      onpause: () => {
        console.log('⏸️ Background music paused');
      },
      onstop: () => {
        console.log('⏹️ Background music stopped');
      }
    });
  }

  // Setup user interaction listener for autoplay
  private setupUserInteractionListener() {
    const handleFirstInteraction = () => {
      this.userInteracted = true;
      const musicEnabled = localStorage.getItem('musicEnabled');
      if (musicEnabled !== 'false') {
        this.playBackgroundMusic();
      }
      
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
  }

  // Play background music
  playBackgroundMusic() {
    console.log('🎵 Attempting to play background music...');
    console.log('Muted:', this.muted, 'User Interacted:', this.userInteracted, 'Background Music Loaded:', !!this.backgroundMusic);
    
    if (this.muted) {
      console.log('❌ Cannot play music: Sound is muted');
      return;
    }
    if (!this.userInteracted) {
      console.log('❌ Cannot play music: User has not interacted yet');
      return;
    }
    if (!this.backgroundMusic) {
      console.log('❌ Cannot play music: Background music not loaded');
      return;
    }
    
    if (!this.musicPlaying) {
      console.log('▶️ Playing background music...');
      this.backgroundMusic.play();
      this.musicPlaying = true;
      localStorage.setItem('musicEnabled', 'true');
    }
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.backgroundMusic && this.musicPlaying) {
      this.backgroundMusic.stop();
      this.musicPlaying = false;
      localStorage.setItem('musicEnabled', 'false');
    }
  }

  // Toggle background music
  toggleBackgroundMusic() {
    if (this.musicPlaying) {
      this.stopBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
    return this.musicPlaying;
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

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume(this.musicVolume);
    }
  }

  // Mute/unmute
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      Howler.mute(true);
      if (this.backgroundMusic && this.musicPlaying) {
        this.backgroundMusic.pause();
      }
    } else {
      Howler.mute(false);
      if (this.backgroundMusic && this.musicPlaying) {
        this.backgroundMusic.play();
      }
    }
    return this.muted;
  }

  // Get current state
  getState() {
    return {
      masterVolume: this.masterVolume,
      uiVolume: this.uiVolume,
      ambientVolume: this.ambientVolume,
      musicVolume: this.musicVolume,
      muted: this.muted,
      musicPlaying: this.musicPlaying,
      currentAmbient: this.currentAmbient !== null
    };
  }

  // Cleanup
  destroy() {
    this.stopAmbient();
    this.stopBackgroundMusic();
    if (this.backgroundMusic) {
      this.backgroundMusic.unload();
    }
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