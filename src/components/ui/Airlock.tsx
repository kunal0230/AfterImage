/**
 * Airlock.tsx - Onboarding Screen
 * 
 * First screen users see. Shows welcome message and survey.
 * Once completed, transitions to the main workspace.
 */

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useMoodStore, Mood } from '../../store/useMoodStore';
import { usePreferenceStore } from '../../store/usePreferenceStore';
import { Survey } from './Survey';

export function Airlock() {
    const { togglePlay, setMood } = useMoodStore();
    const { hasCompletedSurvey } = usePreferenceStore();
    const [showSurvey, setShowSurvey] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEnter = () => {
        if (!hasCompletedSurvey) {
            setShowSurvey(true);
            return;
        }
        startExperience();
    };

    const startExperience = () => {
        setIsLoading(true);
        setMood(Mood.CALM);

        // Small delay for visual feedback
        setTimeout(() => {
            togglePlay();
        }, 300);
    };

    const handleSurveyComplete = () => {
        setShowSurvey(false);
        startExperience();
    };

    // Show survey if user hasn't completed it
    if (showSurvey) {
        return <Survey onComplete={handleSurveyComplete} />;
    }

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex flex-col items-center justify-center">
            {/* Decorative Background Blobs */}
            <BackgroundBlobs />

            {/* Main Content */}
            <div className="relative z-10 text-center max-w-2xl px-8">
                {/* Logo */}
                <Logo />

                {/* Title */}
                <h1 className="text-5xl font-bold mb-4 gradient-text">
                    Mood on Demand
                </h1>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-12 leading-relaxed">
                    Transform your emotional state with personalized scenic experiences,
                    soothing music, and ambient soundscapes designed just for you.
                </p>

                {/* Features */}
                <FeatureGrid />

                {/* CTA Button */}
                <button
                    onClick={handleEnter}
                    disabled={isLoading}
                    className="group relative px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? (
                            'Loading...'
                        ) : (
                            <>
                                {hasCompletedSurvey ? 'Start Experience' : 'Get Started'}
                                <ArrowIcon />
                            </>
                        )}
                    </span>
                </button>

                {/* Footer Note */}
                <p className="mt-8 text-gray-400 text-sm">
                    Best experienced with headphones
                </p>
            </div>
        </div>
    );
}

// --- Sub-components for cleaner code ---

function BackgroundBlobs() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-40 animate-float" />
            <div
                className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-40 animate-float"
                style={{ animationDelay: '2s' }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full blur-3xl opacity-30" />
        </div>
    );
}

function Logo() {
    return (
        <div className="mb-8 animate-float">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </div>
        </div>
    );
}

function FeatureGrid() {
    const features = [
        { icon: 'music', label: 'Curated Music', color: 'text-indigo-500' },
        { icon: 'image', label: 'Scenic Views', color: 'text-cyan-500' },
        { icon: 'sun', label: 'Relaxation', color: 'text-purple-500' },
    ];

    return (
        <div className="grid grid-cols-3 gap-6 mb-12">
            {features.map((feature) => (
                <div key={feature.label} className="glass rounded-2xl p-4 text-center">
                    <FeatureIcon type={feature.icon} className={`w-8 h-8 mx-auto mb-2 ${feature.color}`} />
                    <div className="text-sm text-gray-600 font-medium">{feature.label}</div>
                </div>
            ))}
        </div>
    );
}

function FeatureIcon({ type, className }: { type: string; className: string }) {
    const icons: Record<string, ReactNode> = {
        music: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
        ),
        image: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        sun: (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            </svg>
        ),
    };

    return icons[type] || null;
}

function ArrowIcon() {
    return (
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
    );
}
