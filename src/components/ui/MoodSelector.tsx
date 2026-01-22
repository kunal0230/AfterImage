import { useMoodStore, Mood } from '../../store/useMoodStore';

export function MoodSelector() {
    const { currentMood, setMood, isPlaying } = useMoodStore();

    const handleMood = (mood: Mood) => {
        setMood(mood);
    };

    if (!isPlaying) return null;

    const moods = [
        { key: Mood.CALM, label: 'Calm', color: 'from-cyan-400 to-cyan-600' },
        { key: Mood.FOCUS, label: 'Focus', color: 'from-amber-400 to-amber-600' },
        { key: Mood.ENERGY, label: 'Energy', color: 'from-red-400 to-red-600' },
        { key: Mood.SLEEP, label: 'Sleep', color: 'from-violet-400 to-violet-600' },
        { key: Mood.NOSTALGIA, label: 'Nostalgia', color: 'from-orange-400 to-orange-600' },
    ];

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
            <div className="glass rounded-full px-2 py-2 flex gap-1">
                {moods.map((m) => (
                    <button
                        key={m.key}
                        onClick={() => handleMood(m.key)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${currentMood === m.key
                                ? `bg-gradient-to-r ${m.color} text-white shadow-lg scale-105`
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
