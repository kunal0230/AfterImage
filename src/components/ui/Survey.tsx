import { useState } from 'react';
import { usePreferenceStore } from '../../store/usePreferenceStore';
import type { SceneType, MusicStyle } from '../../store/usePreferenceStore';

interface SurveyStep {
    question: string;
    subtitle: string;
    options: { label: string; value: string; description: string }[];
    key: string;
}

const surveySteps: SurveyStep[] = [
    {
        question: "Where do you feel most at peace?",
        subtitle: "We'll create your perfect relaxation scene",
        options: [
            { label: 'Mountains', value: 'mountains', description: 'Majestic peaks and valleys' },
            { label: 'Beach', value: 'beach', description: 'Gentle waves and warm sand' },
            { label: 'Rainy Day', value: 'rain', description: 'Cozy indoor atmosphere' },
            { label: 'Forest', value: 'forest', description: 'Peaceful woodland streams' },
        ],
        key: 'calmScene',
    },
    {
        question: "What helps you focus best?",
        subtitle: "Your ideal productivity environment",
        options: [
            { label: 'Library', value: 'library', description: 'Quiet study atmosphere' },
            { label: 'Coffee Shop', value: 'cafe', description: 'Ambient chatter and warmth' },
            { label: 'Minimal Space', value: 'minimal', description: 'Clean and distraction-free' },
            { label: 'Nature', value: 'nature', description: 'Outdoor freshness' },
        ],
        key: 'focusScene',
    },
    {
        question: "What helps you drift off to sleep?",
        subtitle: "Your perfect nighttime ambiance",
        options: [
            { label: 'Starry Night', value: 'stars', description: 'Peaceful cosmic views' },
            { label: 'Campfire', value: 'campfire', description: 'Warm crackling flames' },
            { label: 'Gentle Snow', value: 'snow', description: 'Soft winter silence' },
            { label: 'Clouds', value: 'clouds', description: 'Floating serenity' },
        ],
        key: 'sleepScene',
    },
    {
        question: "What music speaks to your soul?",
        subtitle: "Your soundtrack for emotional wellness",
        options: [
            { label: 'Ambient', value: 'ambient', description: 'Atmospheric soundscapes' },
            { label: 'Lo-Fi', value: 'lofi', description: 'Chill beats to relax to' },
            { label: 'Classical', value: 'classical', description: 'Timeless orchestral pieces' },
            { label: 'Piano', value: 'piano', description: 'Gentle melodies' },
        ],
        key: 'musicStyle',
    },
];

interface SurveyProps {
    onComplete: () => void;
}

export function Survey({ onComplete }: SurveyProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const { setPreference, completeSurvey } = usePreferenceStore();

    const step = surveySteps[currentStep];
    const progress = ((currentStep + 1) / surveySteps.length) * 100;

    const handleSelect = (value: string) => {
        const newAnswers = { ...answers, [step.key]: value };
        setAnswers(newAnswers);

        if (currentStep < surveySteps.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 400);
        } else {
            // Save all preferences
            Object.entries(newAnswers).forEach(([key, val]) => {
                if (key === 'musicStyle') {
                    setPreference('musicStyle', val as MusicStyle);
                } else {
                    setPreference(key as 'calmScene' | 'focusScene' | 'sleepScene' | 'energyScene' | 'nostalgiaScene', val as SceneType);
                }
            });
            completeSurvey();
            setTimeout(onComplete, 300);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-8">
            {/* Decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-3xl opacity-40" />
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-40" />
            </div>

            {/* Progress Bar */}
            <div className="absolute top-8 left-8 right-8 max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">Step {currentStep + 1} of {surveySteps.length}</span>
                    <span className="text-sm font-medium text-indigo-600">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {step.question}
                </h2>
                <p className="text-gray-500 mb-10">
                    {step.subtitle}
                </p>

                {/* Options Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {step.options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`group p-6 bg-white border-2 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-indigo-400 text-left ${answers[step.key] === option.value
                                    ? 'border-indigo-500 shadow-lg bg-indigo-50'
                                    : 'border-gray-200'
                                }`}
                        >
                            <div className="font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors mb-1">
                                {option.label}
                            </div>
                            <div className="text-sm text-gray-400">
                                {option.description}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Skip Button */}
            <button
                onClick={onComplete}
                className="absolute bottom-8 text-gray-400 text-sm hover:text-gray-600 transition-colors underline"
            >
                Skip personalization
            </button>
        </div>
    );
}
