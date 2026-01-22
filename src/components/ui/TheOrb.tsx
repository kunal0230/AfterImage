import { useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useMoodStore, Mood } from '../../store/useMoodStore';

export function TheOrb() {
    const { currentMood, setMood, isPlaying } = useMoodStore();
    const [active, setActive] = useState(false);
    const orbitalRef = useRef<HTMLDivElement>(null);

    const moodColors: Record<Mood, string> = {
        CALM: 'from-cyan-400 to-cyan-600',
        FOCUS: 'from-amber-400 to-amber-600',
        ENERGY: 'from-red-400 to-red-600',
        SLEEP: 'from-violet-400 to-violet-600',
        NOSTALGIA: 'from-orange-400 to-orange-600',
    };

    const [{ x, y, scale }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        scale: 1,
        config: { mass: 5, tension: 350, friction: 40 }
    }));

    const bind = useDrag(({ down, movement: [mx, my] }) => {
        setActive(down);
        api.start({
            x: down ? mx : 0,
            y: down ? my : 0,
            scale: down ? 1.1 : 1
        });

        if (!down) {
            if (my < -100) {
                setMood(Mood.ENERGY);
            } else if (my > 100) {
                setMood(Mood.CALM);
            } else if (mx > 100) {
                setMood(Mood.FOCUS);
            } else if (mx < -100) {
                setMood(Mood.SLEEP);
            }
        }
    });

    if (!isPlaying) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <animated.div
                ref={orbitalRef}
                {...bind()}
                style={{ x, y, scale, touchAction: 'none' }}
                className={`w-28 h-28 rounded-full cursor-grab active:cursor-grabbing pointer-events-auto 
                    bg-gradient-to-br ${moodColors[currentMood]} 
                    shadow-2xl flex items-center justify-center transition-all duration-500`}
            >
                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${active ? 'scale-150 opacity-100' : 'scale-100 opacity-80'}`} />
            </animated.div>

            {/* Drag hints */}
            <div className={`absolute transition-opacity duration-300 pointer-events-none ${active ? 'opacity-100' : 'opacity-0'}`}>
                <span className="absolute -top-32 left-1/2 -translate-x-1/2 text-gray-400 text-xs font-medium tracking-wider">ENERGY</span>
                <span className="absolute top-28 left-1/2 -translate-x-1/2 text-gray-400 text-xs font-medium tracking-wider">CALM</span>
                <span className="absolute top-0 left-32 text-gray-400 text-xs font-medium tracking-wider">FOCUS</span>
                <span className="absolute top-0 right-32 text-gray-400 text-xs font-medium tracking-wider">SLEEP</span>
            </div>
        </div>
    );
}
