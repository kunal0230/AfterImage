import { useState, useEffect } from 'react';

export function ClockWidget() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-64 text-center">
            <div className="text-4xl font-light text-gray-800 tabular-nums">
                {formatTime(time)}
            </div>
            <div className="text-sm text-gray-400 mt-2">
                {formatDate(time)}
            </div>
        </div>
    );
}
