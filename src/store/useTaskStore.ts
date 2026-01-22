import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: number;
}

interface TaskStore {
    tasks: Task[];
    addTask: (text: string, priority?: Task['priority']) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    clearCompleted: () => void;
}

export const useTaskStore = create<TaskStore>()(
    persist(
        (set) => ({
            tasks: [],

            addTask: (text, priority = 'medium') => set((state) => ({
                tasks: [
                    ...state.tasks,
                    {
                        id: crypto.randomUUID(),
                        text,
                        completed: false,
                        priority,
                        createdAt: Date.now(),
                    },
                ],
            })),

            toggleTask: (id) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                ),
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
            })),

            clearCompleted: () => set((state) => ({
                tasks: state.tasks.filter((t) => !t.completed),
            })),
        }),
        { name: 'lifeat-tasks' }
    )
);
