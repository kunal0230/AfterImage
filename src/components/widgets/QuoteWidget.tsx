import { useState, useEffect } from 'react';
import { WidgetFrame } from '../layout/WidgetFrame';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
];

export function QuoteWidget() {
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        setQuoteIndex(Math.floor(Math.random() * quotes.length));
    }, []);

    const nextQuote = () => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
    };

    const quote = quotes[quoteIndex];

    return (
        <WidgetFrame
            id="quote-1"
            type="quote"
            title="Daily Inspiration"
            className="w-80"
            icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            }
            headerAction={
                <button
                    onClick={nextQuote}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-500 transition-colors"
                    title="Next Quote"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            }
        >
            <div className="relative min-h-[8rem] flex flex-col justify-center">
                <div className="absolute top-0 left-0 opacity-10">
                    <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={quoteIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-center px-2"
                    >
                        <p className="text-gray-700 text-lg font-medium leading-relaxed italic mb-4 relative z-10">
                            "{quote.text}"
                        </p>
                        <div className="w-10 h-0.5 bg-indigo-200 mx-auto mb-3" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {quote.author}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </WidgetFrame>
    );
}
