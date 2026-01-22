import { useEffect } from 'react';
import { useTimerStore } from '../../store/useTimerStore';
import { WidgetFrame } from '../layout/WidgetFrame';
import { motion } from 'framer-motion';

export function PomodoroWidget() {
    const { mode, timeLeft, isRunning, sessionsCompleted, start, pause, reset, tick } = useTimerStore();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning) {
            interval = setInterval(tick, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, tick]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = mode === 'work'
        ? (1 - timeLeft / (25 * 60))
        : (1 - timeLeft / (5 * 60));

    return (
        <WidgetFrame
            id="pomodoro-1"
            type="pomodoro"
            title="Timer"
            className="w-80"
            icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            }
        >
            <div className="flex flex-col items-center">
                {/* Timer Circle */}
                <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
                    {/* Background Circle */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-gray-100"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className={mode === 'work' ? 'text-red-400' : 'text-green-400'}
                            strokeDasharray="283"
                            strokeDashoffset={283 * (1 - progress)}
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 * (1 - progress) }}
                            transition={{ duration: 1, ease: "linear" }}
                        />
                    </svg>

                    {/* Time Display */}
                    <div className="text-center z-10">
                        <div className="text-5xl font-light text-gray-800 tabular-nums tracking-tighter">
                            {formatTime(timeLeft)}
                        </div>
                        <div className={`text-xs font-medium uppercase tracking-widest mt-1 ${mode === 'work' ? 'text-red-500' : 'text-green-500'
                            }`}>
                            {mode === 'work' ? 'Focus' : 'Break'}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={reset}
                        className="p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>

                    <button
                        onClick={isRunning ? pause : start}
                        className={`p-6 rounded-2xl text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${mode === 'work'
                            ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-200'
                            : 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-200'
                            }`}
                    >
                        {isRunning ? (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="mt-6 text-xs text-gray-400 font-medium">
                    SESSION {sessionsCompleted + 1}
                </div>
            </div>
        </WidgetFrame>
    );
}
