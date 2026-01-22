import { useWidgetStore } from '../../store/useWidgetStore';
import type { WidgetType } from '../../store/useWidgetStore';

import type { ReactNode } from 'react';

const widgetOptions: { type: WidgetType; name: string; icon: ReactNode }[] = [
    {
        type: 'pomodoro',
        name: 'Pomodoro',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        type: 'tasks',
        name: 'Tasks',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
    },
    {
        type: 'notes',
        name: 'Notes',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
    },
    {
        type: 'clock',
        name: 'Clock',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        type: 'quote',
        name: 'Quote',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        ),
    },
    {
        type: 'music',
        name: 'Sounds',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
        ),
    },
];

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const { widgets, toggleWidget } = useWidgetStore();

    return (
        <div
            className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'
                }`}
        >
            {/* Sidebar Container */}
            <div className="h-full bg-white/80 backdrop-blur-xl shadow-xl flex flex-col">
                {/* Toggle Button */}
                <button
                    onClick={onToggle}
                    className="p-4 hover:bg-gray-100 transition-colors border-b border-gray-100"
                >
                    <svg
                        className={`w-6 h-6 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Widgets Section */}
                <div className="flex-1 py-4 overflow-y-auto">
                    {isOpen && (
                        <div className="px-4 mb-2">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Widgets
                            </h3>
                        </div>
                    )}

                    <div className="space-y-1 px-2">
                        {widgetOptions.map((option) => {
                            const widget = widgets.find((w) => w.type === option.type);
                            const isActive = widget?.isVisible;

                            return (
                                <button
                                    key={option.type}
                                    onClick={() => toggleWidget(option.type)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {option.icon}
                                    {isOpen && (
                                        <span className="text-sm font-medium">{option.name}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                {isOpen && (
                    <div className="p-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400 text-center">
                            LifeAt Clone
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
