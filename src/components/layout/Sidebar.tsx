import { motion, AnimatePresence } from 'framer-motion';
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
        type: 'music',
        name: 'Sounds',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
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
        type: 'breathing',
        name: 'Breathing',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        type: 'media',
        name: 'Spotify',
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
        <motion.div
            initial={false}
            animate={{ width: isOpen ? 256 : 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full z-50 pointer-events-auto"
        >
            {/* Sidebar Container */}
            <div className="h-full bg-white/70 backdrop-blur-2xl border-r border-white/20 shadow-2xl flex flex-col">
                {/* Toggle Button */}
                <div className="p-4 border-b border-gray-100/50 flex items-center justify-between">
                    <AnimatePresence>
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-bold text-gray-800 tracking-tight"
                            >
                                AfterImage
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={onToggle}
                        className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors"
                    >
                        <motion.svg
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </motion.svg>
                    </button>
                </div>

                {/* Widgets Section */}
                <div className="flex-1 py-6 px-3 overflow-y-auto custom-scrollbar space-y-1">
                    {widgetOptions.map((option) => {
                        const widget = widgets.find((w) => w.type === option.type);
                        const isActive = widget?.isVisible;

                        return (
                            <button
                                key={option.type}
                                onClick={() => toggleWidget(option.type)}
                                className={`group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${isActive
                                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-900'
                                    }`}
                            >
                                {/* Active Indicator Line */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                                    />
                                )}

                                <div className={`p-1 transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                                    {option.icon}
                                </div>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                        >
                                            {option.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}
