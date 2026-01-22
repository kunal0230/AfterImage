import { create } from 'zustand';

interface TimerStore {
    // Timer state
    mode: 'work' | 'break';
    timeLeft: number; // seconds
    isRunning: boolean;
    sessionsCompleted: number;

    // Settings
    workDuration: number; // minutes
    breakDuration: number; // minutes

    // Actions
    start: () => void;
    pause: () => void;
    reset: () => void;
    tick: () => void;
    setWorkDuration: (mins: number) => void;
    setBreakDuration: (mins: number) => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
    mode: 'work',
    timeLeft: 25 * 60, // 25 minutes default
    isRunning: false,
    sessionsCompleted: 0,
    workDuration: 25,
    breakDuration: 5,

    start: () => set({ isRunning: true }),

    pause: () => set({ isRunning: false }),

    reset: () => {
        const { mode, workDuration, breakDuration } = get();
        set({
            timeLeft: (mode === 'work' ? workDuration : breakDuration) * 60,
            isRunning: false,
        });
    },

    tick: () => {
        const { timeLeft, mode, workDuration, breakDuration, sessionsCompleted } = get();

        if (timeLeft <= 0) {
            // Switch modes
            if (mode === 'work') {
                set({
                    mode: 'break',
                    timeLeft: breakDuration * 60,
                    sessionsCompleted: sessionsCompleted + 1,
                    isRunning: false,
                });
            } else {
                set({
                    mode: 'work',
                    timeLeft: workDuration * 60,
                    isRunning: false,
                });
            }
        } else {
            set({ timeLeft: timeLeft - 1 });
        }
    },

    setWorkDuration: (mins) => {
        set({ workDuration: mins });
        if (get().mode === 'work' && !get().isRunning) {
            set({ timeLeft: mins * 60 });
        }
    },

    setBreakDuration: (mins) => {
        set({ breakDuration: mins });
        if (get().mode === 'break' && !get().isRunning) {
            set({ timeLeft: mins * 60 });
        }
    },
}));
