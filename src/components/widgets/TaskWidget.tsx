import { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
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
    const totalCount = tasks.length;

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Tasks</h3>
                <span className="text-xs text-gray-400">
                    {completedCount}/{totalCount} done
                </span>
            </div>

            {/* Add Task Form */}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a task..."
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </form>

            {/* Task List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {tasks.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">
                        No tasks yet. Add one above.
                    </p>
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
            </div>

            {/* Footer */}
            {completedCount > 0 && (
                <button
                    onClick={clearCompleted}
                    className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                    Clear completed
                </button>
            )}
        </div>
    );
}

function TaskItem({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
    return (
        <div className={`group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${task.completed ? 'opacity-60' : ''
            }`}>
            <button
                onClick={onToggle}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-indigo-400'
                    }`}
            >
                {task.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.text}
            </span>

            <button
                onClick={onDelete}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
