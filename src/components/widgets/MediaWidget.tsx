import { useState } from 'react';
import { WidgetFrame } from '../layout/WidgetFrame';

const playlists = [
    { name: 'Lofi Girl', id: '0vvXsWCC9xrXsKd4VuFAmn', type: 'spotify' },
    { name: 'Deep Focus', id: '37i9dQZF1DWZeKCadgRdKQ', type: 'spotify' },
    { name: 'Piano Chill', id: '37i9dQZF1DX4sWSpwq3LiO', type: 'spotify' },
    { name: 'Nature Sounds', id: '37i9dQZF1DX4wta2PV1lnB', type: 'spotify' },
];

export function MediaWidget() {
    const [currentPlaylist, setCurrentPlaylist] = useState(playlists[0]);
    const [view, setView] = useState<'player' | 'list'>('player');

    return (
        <WidgetFrame
            type="media"
            title="Spotify Player"
            className="w-80 h-96"
            icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            }
            headerAction={
                <button
                    onClick={() => setView(view === 'player' ? 'list' : 'player')}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-500 transition-colors"
                    title={view === 'player' ? "Change Playlist" : "Back to Player"}
                >
                    {view === 'player' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    )}
                </button>
            }
        >
            <div className="h-full flex flex-col">
                {view === 'player' ? (
                    <iframe
                        style={{ borderRadius: '12px' }}
                        src={`https://open.spotify.com/embed/playlist/${currentPlaylist.id}?utm_source=generator&theme=0`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="flex-1 shadow-sm"
                    />
                ) : (
                    <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                            Select Playlist
                        </h3>
                        {playlists.map((playlist) => (
                            <button
                                key={playlist.id}
                                onClick={() => {
                                    setCurrentPlaylist(playlist);
                                    setView('player');
                                }}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${currentPlaylist.id === playlist.id
                                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-medium'
                                        : 'hover:bg-white/50 text-gray-700'
                                    }`}
                            >
                                <span>{playlist.name}</span>
                                {currentPlaylist.id === playlist.id && (
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-200" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </WidgetFrame>
    );
}
