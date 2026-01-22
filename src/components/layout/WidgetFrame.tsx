import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useWidgetStore } from '../../store/useWidgetStore';
import type { WidgetType } from '../../store/useWidgetStore';

// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface WidgetFrameProps {
    id?: string; // Optional: Widget instance ID
    type: WidgetType;
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    headerAction?: React.ReactNode;
}

export function WidgetFrame({ type, title, icon, children, className, headerAction }: WidgetFrameProps) {
    const { toggleWidget } = useWidgetStore();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn(
                "relative flex flex-col bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden",
                "transition-shadow hover:shadow-3xl ring-1 ring-black/5",
                className
            )}
        >
            {/* Header / Drag Handle area */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/10 select-none cursor-grab active:cursor-grabbing drag-handle group">
                <div className="flex items-center gap-3">
                    {/* Draggable Indicator Icon */}
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="9" cy="9" r="1.5" />
                            <circle cx="15" cy="9" r="1.5" />
                            <circle cx="9" cy="15" r="1.5" />
                            <circle cx="15" cy="15" r="1.5" />
                        </svg>
                    </div>

                    {icon && <span className="text-gray-600">{icon}</span>}
                    <h3 className="font-semibold text-gray-800 text-sm tracking-wide">{title}</h3>
                </div>

                <div className="flex items-center gap-2">
                    {headerAction}

                    {/* Close Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent drag start
                            toggleWidget(type);
                        }}
                        className="p-1.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Close widget"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </motion.div>
    );
}
