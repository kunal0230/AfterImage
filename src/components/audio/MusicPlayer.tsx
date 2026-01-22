import { useEffect, useRef, useState } from 'react';
import { useMoodStore } from '../../store/useMoodStore';
import { usePreferenceStore } from '../../store/usePreferenceStore';
import type { MusicStyle } from '../../store/usePreferenceStore';

// Real ambient music tracks (royalty-free sources)
const musicTracks: Record<MusicStyle, { name: string; artist: string; url: string }[]> = {
    ambient: [
        { name: 'Floating', artist: 'Ambient Works', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
    ],
    lofi: [
        { name: 'Chill Vibes', artist: 'Lo-Fi Beats', url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946bc5ac9a.mp3' },
    ],
    classical: [
        { name: 'Moonlight Sonata', artist: 'Classical Collection', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bf6.mp3' },
    ],
    nature: [
        { name: 'Forest Morning', artist: 'Nature Sounds', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_8e1b5cb2ea.mp3' },
    ],
    piano: [
        { name: 'Gentle Keys', artist: 'Piano Dreams', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bf6.mp3' },
    ],
};

export function MusicPlayer() {
    const isPlaying = useMoodStore((state) => state.isPlaying);
    const { musicStyle } = usePreferenceStore();

    const audioRef = useRef<HTMLAudioElement>(null);
    const [volume, setVolume] = useState(0.6);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    const tracks = musicTracks[musicStyle] || musicTracks.ambient;
    const currentTrack = tracks[0];

    useEffect(() => {
        if (audioRef.current && isPlaying) {
            audioRef.current.volume = isMuted ? 0 : volume;
            audioRef.current.play().then(() => {
                setIsAudioPlaying(true);
            }).catch(() => {
                console.log('Audio autoplay blocked');
                setIsAudioPlaying(false);
            });
        }
    }, [isPlaying, volume, isMuted]);

    useEffect(() => {
        if (audioRef.current) {
            setIsLoading(true);
            audioRef.current.load();
        }
    }, [musicStyle]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isAudioPlaying) {
                audioRef.current.pause();
                setIsAudioPlaying(false);
            } else {
                audioRef.current.play();
                setIsAudioPlaying(true);
            }
        }
    };

    if (!isPlaying) return null;

    return (
        <>
            <audio
                ref={audioRef}
                loop
                onCanPlay={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            >
                <source src={currentTrack.url} type="audio/mpeg" />
            </audio>

            {/* Music Controls - Bottom Right */}
            <div className="fixed bottom-24 right-6 z-40 pointer-events-auto">
                <div className="glass rounded-2xl p-4 shadow-xl">
                    {/* Track Info */}
                    <div className="mb-3">
                        <div className="text-sm font-medium text-gray-700">
                            {isLoading ? 'Loading...' : currentTrack.name}
                        </div>
                        <div className="text-xs text-gray-400">
                            {currentTrack.artist}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        {/* Play/Pause */}
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            {isAudioPlaying ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>

                        {/* Volume */}
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {isMuted ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                            )}
                        </button>

                        {/* Volume Slider */}
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-20 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
