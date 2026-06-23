'use client';

class ModularAudioManager {
  private isMuted: boolean = true;
  private volume: number = 0.5;
  private ambientAudio: HTMLAudioElement | null = null;
  private sfxAudios: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    if (typeof window === 'undefined') return;
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (this.ambientAudio) {
      this.ambientAudio.volume = vol;
    }
  }

  public mute() {
    this.isMuted = true;
    if (this.ambientAudio) {
      this.ambientAudio.pause();
    }
    console.log('[Audio] System Muted');
  }

  public unmute() {
    this.isMuted = false;
    console.log('[Audio] System Unmuted');
    
    // Play ambient loop if it exists and audio is enabled
    this.playAmbient();
  }

  public playAmbient(url?: string) {
    if (this.isMuted || typeof window === 'undefined') return;
    
    const playUrl = url || '';
    if (!playUrl) {
      console.log('[Audio] Ambient placeholder trigger (no URL configured)');
      return;
    }

    try {
      if (!this.ambientAudio) {
        this.ambientAudio = new Audio(playUrl);
        this.ambientAudio.loop = true;
      } else if (this.ambientAudio.src !== playUrl) {
        this.ambientAudio.pause();
        this.ambientAudio = new Audio(playUrl);
        this.ambientAudio.loop = true;
      }
      
      this.ambientAudio.volume = this.volume;
      this.ambientAudio.play().catch(err => {
        console.warn('[Audio] Failed to play ambient track:', err);
      });
    } catch (e) {
      console.error('[Audio] Ambient playback error:', e);
    }
  }

  public playSfx(name: string, url?: string) {
    if (this.isMuted || typeof window === 'undefined') return;

    if (!url) {
      console.log(`[Audio SFX] Played action: ${name} (placeholder)`);
      return;
    }

    try {
      let audio = this.sfxAudios.get(name);
      if (!audio) {
        audio = new Audio(url);
        this.sfxAudios.set(name, audio);
      }
      
      audio.volume = this.volume;
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.warn(`[Audio SFX] Failed to play ${name}:`, err);
      });
    } catch (e) {
      console.error(`[Audio SFX] Playback error for ${name}:`, e);
    }
  }

  public stopAmbient() {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
    }
  }
}

export const audioManager = new ModularAudioManager();
