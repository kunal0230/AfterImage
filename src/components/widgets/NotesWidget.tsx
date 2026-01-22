import { useState } from 'react';

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
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-80">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Notes</h3>
                <span className="text-xs text-gray-400">
                    {notes.length} chars
                </span>
            </div>

            <textarea
                value={notes}
                onChange={handleChange}
                placeholder="Write your thoughts..."
                className="w-full h-48 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
        </div>
    );
}
