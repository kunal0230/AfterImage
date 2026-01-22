import { useState, useEffect } from 'react';

const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
];

export function QuoteWidget() {
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        // Random quote on mount
        setQuoteIndex(Math.floor(Math.random() * quotes.length));
    }, []);

    const nextQuote = () => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
    };

    const quote = quotes[quoteIndex];

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-80">
            <div className="mb-4">
                <svg className="w-8 h-8 text-indigo-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {quote.text}
            </p>

            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                    - {quote.author}
                </span>
                <button
                    onClick={nextQuote}
                    className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
