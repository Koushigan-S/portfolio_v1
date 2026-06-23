'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDeviceCapability, type DeviceTier } from '@/hooks/useDeviceCapability';
import { experienceConfig } from '@/config/experience.config';
import { audioManager } from '@/lib/audio';

export interface DroneContextType {
  currentSection: number;
  scrollProgress: number;
  totalScrollProgress: number;
  deviceTier: DeviceTier;
  isMobile: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  activeProject: string | null;
  setActiveProject: (id: string | null) => void;
  droneMode: 'hover' | 'guide' | 'project' | 'contact';
  setDroneMode: (mode: 'hover' | 'guide' | 'project' | 'contact') => void;
  setCurrentSection: (sec: number) => void;
  setScrollProgress: (progress: number) => void;
  setTotalScrollProgress: (progress: number) => void;
}

const DroneContext = createContext<DroneContextType | undefined>(undefined);

export function DroneProvider({ children }: { children: React.ReactNode }) {
  const { tier: deviceTier, isMobile } = useDeviceCapability();
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [totalScrollProgress, setTotalScrollProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [droneMode, setDroneMode] = useState<'hover' | 'guide' | 'project' | 'contact'>('hover');

  useEffect(() => {
    // Initialize audio system state based on config and default mute
    if (!experienceConfig.features.audio) {
      audioManager.mute();
      setIsMuted(true);
      return;
    }
    audioManager.setVolume(experienceConfig.audio.ambientVolume);
  }, []);

  const toggleMute = () => {
    if (!experienceConfig.features.audio) return;
    if (isMuted) {
      audioManager.unmute();
      setIsMuted(false);
    } else {
      audioManager.mute();
      setIsMuted(true);
    }
  };

  return (
    <DroneContext.Provider
      value={{
        currentSection,
        scrollProgress,
        totalScrollProgress,
        deviceTier,
        isMobile,
        isMuted,
        toggleMute,
        activeProject,
        setActiveProject,
        droneMode,
        setDroneMode,
        setCurrentSection,
        setScrollProgress,
        setTotalScrollProgress,
      }}
    >
      {children}
    </DroneContext.Provider>
  );
}

export function useDrone() {
  const context = useContext(DroneContext);
  if (!context) {
    throw new Error('useDrone must be used within a DroneProvider');
  }
  return context;
}
