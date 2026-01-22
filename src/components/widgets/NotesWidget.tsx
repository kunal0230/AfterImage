import { useState } from 'react';
import { WidgetFrame } from '../layout/WidgetFrame';

export function NotesWidget() {
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('lifeat-notes');
        return saved || '';
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setNotes(value);
        localStorage.setItem('lifeat-notes', value);
    };

    return (
        <WidgetFrame
            id="notes-1"
            type="notes"
            title="Notepad"
            className="w-80 h-72"
            icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            }
        >
            <div className="h-full -mx-2 -my-2">
                <textarea
                    value={notes}
                    onChange={handleChange}
                    placeholder="Jot down your thoughts..."
                    className="w-full h-full p-4 bg-transparent border-none resize-none focus:ring-0 text-gray-700 text-sm leading-relaxed placeholder:text-gray-400/70"
                    spellCheck={false}
                />
            </div>
        </WidgetFrame>
    );
}
