import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetType = 'pomodoro' | 'tasks' | 'notes' | 'clock' | 'quote' | 'music' | 'breathing' | 'media';

export interface Widget {
    id: string;
    type: WidgetType;
    position: { x: number; y: number };
    isVisible: boolean;
}

const initialWidgets: Widget[] = [
    { id: 'pomodoro-1', type: 'pomodoro', position: { x: 50, y: 50 }, isVisible: true },
    { id: 'tasks-1', type: 'tasks', position: { x: 400, y: 50 }, isVisible: true },
    { id: 'notes-1', type: 'notes', position: { x: 50, y: 400 }, isVisible: false },
    { id: 'clock-1', type: 'clock', position: { x: 400, y: 400 }, isVisible: false },
    { id: 'quote-1', type: 'quote', position: { x: 50, y: 600 }, isVisible: true },
    { id: 'music-1', type: 'music', position: { x: 400, y: 600 }, isVisible: true },
    { id: 'breathing-1', type: 'breathing', position: { x: 800, y: 50 }, isVisible: false },
    { id: 'media-1', type: 'media', position: { x: 800, y: 400 }, isVisible: false },
];

interface WidgetState {
    widgets: Widget[];
    toggleWidget: (type: WidgetType) => void;
    updatePosition: (id: string, pos: { x: number; y: number }) => void;
    resetWidgets: () => void;
}

export const useWidgetStore = create<WidgetState>()(
    persist(
        (set) => ({
            widgets: initialWidgets,
            toggleWidget: (type) =>
                set((state) => ({
                    widgets: state.widgets.map((w) =>
                        w.type === type ? { ...w, isVisible: !w.isVisible } : w
                    ),
                })),
            updatePosition: (id, pos) =>
                set((state) => ({
                    widgets: state.widgets.map((w) =>
                        w.id === id ? { ...w, position: pos } : w
                    ),
                })),
            resetWidgets: () => set({ widgets: initialWidgets }),
        }),
        {
            name: 'widget-storage',
        }
    )
);
