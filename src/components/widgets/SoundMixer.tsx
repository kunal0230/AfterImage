import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Howl } from 'howler';
import { WidgetFrame } from '../layout/WidgetFrame';

interface Sound {
    id: string;
    name: string;
    icon: ReactNode;
    url: string;
    volume: number;
    isPlaying: boolean;
    howl?: Howl;
}

// Sound icons (using SVG for portability)
const ICONS = {
    rain: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    ),
    fire: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
    ),
    birds: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
    ),
    waves: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
};

const defaultSounds: Omit<Sound, 'howl'>[] = [
    { id: 'rain', name: 'Rain', icon: ICONS.rain, url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3', volume: 0.5, isPlaying: false },
    { id: 'fire', name: 'Fireplace', icon: ICONS.fire, url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_dc39bde776.mp3', volume: 0.5, isPlaying: false },
    { id: 'birds', name: 'Forest', icon: ICONS.birds, url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_942694c6db.mp3', volume: 0.5, isPlaying: false },
    { id: 'waves', name: 'Ocean', icon: ICONS.waves, url: 'https://cdn.pixabay.com/download/audio/2022/02/23/audio_ea70ad08cb.mp3', volume: 0.5, isPlaying: false },
];

export function SoundMixer() {
    const [sounds, setSounds] = useState<Sound[]>(defaultSounds);
    const [masterVolume, setMasterVolume] = useState(0.8);
    const howlsRef = useRef<Map<string, Howl>>(new Map());

    // Initialize Howls
    useEffect(() => {
        sounds.forEach((sound) => {
            if (!howlsRef.current.has(sound.id)) {
                const howl = new Howl({
                    src: [sound.url],
                    loop: true,
                    volume: sound.volume * masterVolume,
                    html5: true,
                });
                howlsRef.current.set(sound.id, howl);
            }
        });

        return () => {
            howlsRef.current.forEach((howl) => howl.unload());
            howlsRef.current.clear();
        };
    }, []);

    const toggleSound = (id: string) => {
        const howl = howlsRef.current.get(id);
        if (!howl) return;

        setSounds((prev) =>
            prev.map((s) => {
                if (s.id === id) {
                    if (s.isPlaying) {
                        howl.fade(howl.volume(), 0, 1000);
                        setTimeout(() => howl.pause(), 1000);
                    } else {
                        howl.play();
                        howl.fade(0, s.volume * masterVolume, 1000);
                    }
                    return { ...s, isPlaying: !s.isPlaying };
                }
                return s;
            })
        );
    };

    const setVolume = (id: string, volume: number) => {
        const howl = howlsRef.current.get(id);
        if (howl && howl.playing()) {
            howl.volume(volume * masterVolume);
        }
        setSounds((prev) =>
            prev.map((s) => (s.id === id ? { ...s, volume } : s))
        );
    };

    return (
        <WidgetFrame
            type="music"
            title="Ambience"
            className="w-80"
            icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            }
        >
            <div className="space-y-4">
                {/* Master Volume */}
                <div className="flex items-center gap-3 px-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={masterVolume}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setMasterVolume(val);
                            sounds.forEach(s => {
                                const h = howlsRef.current.get(s.id);
                                if (h && s.isPlaying) h.volume(s.volume * val);
                            });
                        }}
                        className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600"
                    />
                </div>

                {/* Channels */}
                <div className="space-y-3">
                    {sounds.map((sound) => (
                        <div key={sound.id} className="group relative bg-white/40 border border-white/40 rounded-xl p-3 hover:bg-white/60 transition-colors">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleSound(sound.id)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${sound.isPlaying
                                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200 scale-105'
                                            : 'bg-gray-100 text-gray-400 group-hover:scale-105'
                                        }`}
                                >
                                    {sound.icon}
                                </button>

                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{sound.name}</span>
                                        {sound.isPlaying && (
                                            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold">ON</span>
                                        )}
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={sound.volume}
                                        onChange={(e) => setVolume(sound.id, parseFloat(e.target.value))}
                                        className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50"
                                        disabled={!sound.isPlaying}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </WidgetFrame>
    );
}
