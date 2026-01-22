import { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { WidgetFrame } from '../layout/WidgetFrame';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../../store/useTaskStore';

export function TaskWidget() {
    const { tasks, addTask, toggleTask, deleteTask, clearCompleted } = useTaskStore();
    const [newTask, setNewTask] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.trim()) {
            addTask(newTask.trim());
            setNewTask('');
        }
    };

    const completedCount = tasks.filter((t) => t.completed).length;

    return (
        <WidgetFrame
            id="tasks-1"
            type="tasks"
            title={`Tasks (${completedCount}/${tasks.length})`}
            className="w-96 h-[30rem]"
            icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            }
        >
            <div className="flex flex-col h-full">
                {/* Input */}
                <form onSubmit={handleSubmit} className="mb-4 relative group">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="What's your focus today?"
                        className="w-full pl-4 pr-12 py-3 bg-white/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all placeholder:text-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={!newTask.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500 text-white rounded-lg opacity-0 group-focus-within:opacity-100 disabled:opacity-0 transition-all hover:bg-indigo-600 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </form>

                {/* Task List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                    <AnimatePresence initial={false}>
                        {tasks.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-40 text-center"
                            >
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-sm">All caught up!</p>
                            </motion.div>
                        ) : (
                            tasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={() => toggleTask(task.id)}
                                    onDelete={() => deleteTask(task.id)}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                {completedCount > 0 && (
                    <button
                        onClick={clearCompleted}
                        className="mt-4 text-xs text-gray-400 hover:text-indigo-500 transition-colors w-full text-center py-2 border-t border-gray-100"
                    >
                        Clear {completedCount} completed items
                    </button>
                )}
            </div>
        </WidgetFrame>
    );
}

function TaskItem({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.01 }}
            className={`group flex items-center gap-3 p-3 bg-white/40 border border-white/40 rounded-xl hover:bg-white/60 transition-colors ${task.completed ? 'opacity-60 saturate-0' : ''
                }`}
        >
            <button
                onClick={onToggle}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${task.completed
                        ? 'bg-gradient-to-br from-green-400 to-green-500 border-transparent shadow-sm'
                        : 'border-gray-300 hover:border-indigo-400 bg-white'
                    }`}
            >
                {task.completed && (
                    <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                )}
            </button>

            <span className={`flex-1 text-sm transition-colors ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'
                }`}>
                {task.text}
            </span>

            <button
                onClick={onDelete}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </motion.div>
    );
}
