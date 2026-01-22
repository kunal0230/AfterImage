import { useState, useEffect } from 'react';
import { WidgetFrame } from '../layout/WidgetFrame';
import { motion, AnimatePresence } from 'framer-motion';

type BreathingState = 'inhale' | 'hold-in' | 'exhale' | 'hold-out' | 'idle';

export function BreathingWidget() {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<BreathingState>('idle');

    useEffect(() => {
        if (!isActive) {
            setPhase('idle');
            return;
        }

        let timer: ReturnType<typeof setTimeout>;

        const cycle = async () => {
            // Inhale (4s)
            setPhase('inhale');
            await new Promise(r => { timer = setTimeout(r, 4000); });

            // Hold (4s)
            if (!isActive) return;
            setPhase('hold-in');
            await new Promise(r => { timer = setTimeout(r, 4000); });

            // Exhale (4s)
            if (!isActive) return;
            setPhase('exhale');
            await new Promise(r => { timer = setTimeout(r, 4000); });

            // Hold (4s)
            if (!isActive) return;
            setPhase('hold-out');
            await new Promise(r => { timer = setTimeout(r, 4000); });

            if (isActive) cycle();
        };

        cycle();

        return () => clearTimeout(timer);
    }, [isActive]);

    const variants = {
        idle: { scale: 1, opacity: 0.5 },
        inhale: { scale: 1.5, opacity: 1 },
        'hold-in': { scale: 1.5, opacity: 0.8 },
        exhale: { scale: 1, opacity: 0.5 },
        'hold-out': { scale: 1, opacity: 0.3 },
    };

    const textMap = {
        idle: 'Ready to breathe?',
        inhale: 'Inhale...',
        'hold-in': 'Hold...',
        exhale: 'Exhale...',
        'hold-out': 'Hold...',
    };

    const colorMap = {
        idle: 'bg-indigo-300',
        inhale: 'bg-cyan-400',
        'hold-in': 'bg-cyan-500',
        exhale: 'bg-indigo-400',
        'hold-out': 'bg-indigo-300',
    };

    return (
        <WidgetFrame
            type="breathing"
            title="Box Breathing"
            className="w-72 h-80"
            icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            }
        >
            <div className="flex flex-col items-center justify-center h-full gap-8">

                {/* Animation Circle */}
                <div className="relative">
                    <motion.div
                        variants={variants}
                        initial="idle"
                        animate={phase}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className={`w-32 h-32 rounded-full blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${colorMap[phase]}`}
                    />
                    <motion.div
                        variants={variants}
                        initial="idle"
                        animate={phase}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className={`w-24 h-24 rounded-full border-4 border-white/50 backdrop-blur-md relative z-10 flex items-center justify-center shadow-xl ${colorMap[phase]}`}
                    >
                        <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                </div>

                {/* Text & Control */}
                <div className="text-center z-10">
                    <div className="h-8 mb-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={phase}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-lg font-medium text-gray-700"
                            >
                                {textMap[phase]}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95 ${isActive
                                ? 'bg-white text-gray-600 hover:bg-gray-50'
                                : 'bg-indigo-500 text-white hover:bg-indigo-600'
                            }`}
                    >
                        {isActive ? 'Stop' : 'Start'}
                    </button>
                </div>
            </div>
        </WidgetFrame>
    );
}
