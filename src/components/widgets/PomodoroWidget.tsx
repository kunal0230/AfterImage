import { useEffect } from 'react';
import { useTimerStore } from '../../store/useTimerStore';

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
        ? (1 - timeLeft / (25 * 60)) * 100
        : (1 - timeLeft / (5 * 60)) * 100;

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-72">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Pomodoro</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${mode === 'work'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                    }`}>
                    {mode === 'work' ? 'Focus' : 'Break'}
                </span>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-6">
                <div className="text-5xl font-light text-gray-800 tabular-nums">
                    {formatTime(timeLeft)}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                    Sessions completed: {sessionsCompleted}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${mode === 'work' ? 'bg-red-400' : 'bg-green-400'
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
                <button
                    onClick={reset}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>

                <button
                    onClick={isRunning ? pause : start}
                    className={`p-4 rounded-full text-white shadow-lg transition-all ${mode === 'work'
                        ? 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
                        : 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600'
                        }`}
                >
                    {isRunning ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
