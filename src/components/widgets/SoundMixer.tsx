import { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';

interface Sound {
    id: string;
    name: string;
    icon: string;
    url: string;
    volume: number;
    isPlaying: boolean;
    howl?: Howl;
}

const defaultSounds: Omit<Sound, 'howl'>[] = [
    { id: 'rain', name: 'Rain', icon: 'R', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3', volume: 0.5, isPlaying: false },
    { id: 'fire', name: 'Fireplace', icon: 'F', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_dc39bde776.mp3', volume: 0.5, isPlaying: false },
    { id: 'birds', name: 'Birds', icon: 'B', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_942694c6db.mp3', volume: 0.5, isPlaying: false },
    { id: 'waves', name: 'Waves', icon: 'W', url: 'https://cdn.pixabay.com/download/audio/2022/02/23/audio_ea70ad08cb.mp3', volume: 0.5, isPlaying: false },
    { id: 'wind', name: 'Wind', icon: 'Wi', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f49dffc.mp3', volume: 0.5, isPlaying: false },
    { id: 'coffee', name: 'Coffee Shop', icon: 'C', url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_4b2c96aa45.mp3', volume: 0.5, isPlaying: false },
];

export function SoundMixer() {
    const [sounds, setSounds] = useState<Sound[]>(defaultSounds);
    const [masterVolume, setMasterVolume] = useState(0.7);
    const howlsRef = useRef<Map<string, Howl>>(new Map());

    useEffect(() => {
        // Initialize Howls
        sounds.forEach((sound) => {
            if (!howlsRef.current.has(sound.id)) {
                const howl = new Howl({
                    src: [sound.url],
                    loop: true,
                    volume: sound.volume * masterVolume,
                });
                howlsRef.current.set(sound.id, howl);
            }
        });

        return () => {
            // Cleanup
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
                        howl.pause();
                    } else {
                        howl.play();
                    }
                    return { ...s, isPlaying: !s.isPlaying };
                }
                return s;
            })
        );
    };

    const setVolume = (id: string, volume: number) => {
        const howl = howlsRef.current.get(id);
        if (howl) {
            howl.volume(volume * masterVolume);
        }
        setSounds((prev) =>
            prev.map((s) => (s.id === id ? { ...s, volume } : s))
        );
    };

    const handleMasterVolume = (volume: number) => {
        setMasterVolume(volume);
        sounds.forEach((sound) => {
            const howl = howlsRef.current.get(sound.id);
            if (howl) {
                howl.volume(sound.volume * volume);
            }
        });
    };

    const activeSounds = sounds.filter((s) => s.isPlaying).length;

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-80">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Sound Mixer</h3>
                <span className="text-xs text-gray-400">
                    {activeSounds} active
                </span>
            </div>

            {/* Master Volume */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={masterVolume}
                    onChange={(e) => handleMasterVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-xs text-gray-500 w-8">{Math.round(masterVolume * 100)}%</span>
            </div>

            {/* Sound List */}
            <div className="space-y-2">
                {sounds.map((sound) => (
                    <div key={sound.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <button
                            onClick={() => toggleSound(sound.id)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${sound.isPlaying
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {sound.icon}
                        </button>
                        <div className="flex-1">
                            <div className="text-sm text-gray-700">{sound.name}</div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={sound.volume}
                                onChange={(e) => setVolume(sound.id, parseFloat(e.target.value))}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                disabled={!sound.isPlaying}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
