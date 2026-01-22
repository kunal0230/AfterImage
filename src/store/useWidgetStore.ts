import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WidgetType = 'pomodoro' | 'tasks' | 'notes' | 'clock' | 'quote' | 'music' | 'breathing';

export interface Widget {
    id: string;
    type: WidgetType;
    position: { x: number; y: number };
    isVisible: boolean;
}

interface WidgetStore {
    widgets: Widget[];
    activePanel: 'scenes' | 'sounds' | 'widgets' | null;

    toggleWidget: (type: WidgetType) => void;
    updatePosition: (id: string, position: { x: number; y: number }) => void;
    setActivePanel: (panel: WidgetStore['activePanel']) => void;
}

const defaultWidgets: Widget[] = [
    { id: 'pomodoro-1', type: 'pomodoro', position: { x: 50, y: 100 }, isVisible: true },
    { id: 'tasks-1', type: 'tasks', position: { x: 50, y: 350 }, isVisible: true },
    { id: 'notes-1', type: 'notes', position: { x: 400, y: 100 }, isVisible: false },
    { id: 'clock-1', type: 'clock', position: { x: 400, y: 300 }, isVisible: false },
    { id: 'quote-1', type: 'quote', position: { x: 50, y: 500 }, isVisible: false },
];

export const useWidgetStore = create<WidgetStore>()(
    persist(
        (set) => ({
            widgets: defaultWidgets,
            activePanel: null,

            toggleWidget: (type) => set((state) => ({
                widgets: state.widgets.map((w) =>
                    w.type === type ? { ...w, isVisible: !w.isVisible } : w
                ),
            })),

            updatePosition: (id, position) => set((state) => ({
                widgets: state.widgets.map((w) =>
                    w.id === id ? { ...w, position } : w
                ),
            })),

            setActivePanel: (panel) => set({ activePanel: panel }),
        }),
        { name: 'lifeat-widgets' }
    )
);
