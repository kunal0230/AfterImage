import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Scene options for each mood
export const SceneOptions = {
    CALM: ['mountains', 'beach', 'rain', 'forest'] as const,
    FOCUS: ['library', 'cafe', 'minimal', 'nature'] as const,
    SLEEP: ['stars', 'campfire', 'snow', 'clouds'] as const,
    ENERGY: ['sunrise', 'city', 'ocean', 'storm'] as const,
    NOSTALGIA: ['sunset', 'vintage', 'childhood', 'seasons'] as const,
} as const;

export const MusicStyles = ['ambient', 'lofi', 'classical', 'nature', 'piano'] as const;

export type SceneType = typeof SceneOptions[keyof typeof SceneOptions][number];
export type MusicStyle = typeof MusicStyles[number];

export interface UserPreferences {
    // Scene preferences per mood
    calmScene: SceneType;
    focusScene: SceneType;
    sleepScene: SceneType;
    energyScene: SceneType;
    nostalgiaScene: SceneType;

    // Music preferences
    musicStyle: MusicStyle;
    binauralVolume: number; // 0-1, how much binaural to blend

    // User has completed survey
    hasCompletedSurvey: boolean;
}

interface PreferenceStore extends UserPreferences {
    // Actions
    setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
    completeSurvey: () => void;
    resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
    calmScene: 'beach',
    focusScene: 'library',
    sleepScene: 'stars',
    energyScene: 'sunrise',
    nostalgiaScene: 'sunset',
    musicStyle: 'ambient',
    binauralVolume: 0.3,
    hasCompletedSurvey: false,
};

export const usePreferenceStore = create<PreferenceStore>()(
    persist(
        (set) => ({
            ...defaultPreferences,

            setPreference: (key, value) => set({ [key]: value }),

            completeSurvey: () => set({ hasCompletedSurvey: true }),

            resetPreferences: () => set(defaultPreferences),
        }),
        {
            name: 'mood-preferences',
        }
    )
);
