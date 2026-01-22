import { create } from 'zustand';

// Replaced enum with const assertion for 'erasableSyntaxOnly' compatibility
export const Mood = {
    CALM: 'CALM',
    FOCUS: 'FOCUS',
    ENERGY: 'ENERGY',
    SLEEP: 'SLEEP',
    NOSTALGIA: 'NOSTALGIA',
} as const;

export type Mood = typeof Mood[keyof typeof Mood];

interface MoodState {
    currentMood: Mood;
    isPlaying: boolean;
    musicVolume: number;
    voiceVolume: number; // For future guided meditations
    reducedMotion: boolean;

    // Actions
    setMood: (mood: Mood) => void;
    togglePlay: () => void;
    setMusicVolume: (vol: number) => void;
    setVoiceVolume: (vol: number) => void;
    setReducedMotion: (enabled: boolean) => void;
}

export const useMoodStore = create<MoodState>((set) => ({
    currentMood: Mood.CALM,
    isPlaying: false,
    musicVolume: 0.8,
    voiceVolume: 0.0,
    reducedMotion: false,

    setMood: (mood) => set({ currentMood: mood }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setMusicVolume: (vol) => set({ musicVolume: vol }),
    setVoiceVolume: (vol) => set({ voiceVolume: vol }),
    setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
}));

// Transient Store for High-Frequency Audio Data
export const AudioData = {
    frequency: new Uint8Array(128),
    waveform: new Float32Array(128),
    beat: false,
};
