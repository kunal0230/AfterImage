import { useState, useEffect } from 'react';
import { WidgetFrame } from '../layout/WidgetFrame';

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
        <WidgetFrame
            id="clock-1"
            type="clock"
            title="Time"
            className="w-64"
            icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            }
        >
            <div className="text-center py-2">
                <div className="text-4xl font-light text-gray-800 tabular-nums tracking-tight">
                    {formatTime(time)}
                </div>
                <div className="text-sm font-medium text-indigo-500 mt-2 uppercase tracking-wide">
                    {formatDate(time)}
                </div>
            </div>
        </WidgetFrame>
    );
}
