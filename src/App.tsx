import { Canvas } from '@react-three/fiber';
import { Scene } from './components/canvas/Scene';
import { ScenePlayer } from './components/canvas/ScenePlayer';
import { TheOrb } from './components/ui/TheOrb';
import { MoodSelector } from './components/ui/MoodSelector';
import { Airlock } from './components/ui/Airlock';
import { MusicPlayer } from './components/audio/MusicPlayer';
import { useMoodStore } from './store/useMoodStore';

function App() {
  const isPlaying = useMoodStore((state) => state.isPlaying);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 overflow-hidden select-none font-sans">
      {/* 1. Onboarding Layer (includes Survey) */}
      <Airlock />

      {/* 2. Scenic Background Layer (Video/Image) */}
      <ScenePlayer />

      {/* 3. Subtle Visual Overlay (R3F Shaders) */}
      {isPlaying && (
        <div className="absolute inset-0 z-5 pointer-events-none opacity-20">
          <Canvas
            dpr={[1, 2]}
            gl={{
              powerPreference: "high-performance",
              antialias: false,
              stencil: false,
              depth: false
            }}
            camera={{ position: [0, 0, 5], fov: 75 }}
          >
            <Scene />
          </Canvas>
        </div>
      )}

      {/* 4. Music Player */}
      <MusicPlayer />

      {/* 5. The Interactive UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <TheOrb />
        <MoodSelector />
      </div>

      {/* 6. Header */}
      <div className="absolute top-6 w-full text-center pointer-events-none z-20">
        <h1 className="text-gray-400 text-xs tracking-[0.3em] uppercase font-medium">
          Mood on Demand
        </h1>
      </div>

      {/* 7. Timer/Session Info (New Feature) */}
      {isPlaying && (
        <div className="absolute top-6 right-6 z-20 pointer-events-auto">
          <SessionTimer />
        </div>
      )}
    </div>
  );
}

// New Feature: Session Timer
function SessionTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass rounded-xl px-4 py-2">
      <div className="text-xs text-gray-400 mb-0.5">Session</div>
      <div className="text-lg font-medium text-gray-700">{formatTime(seconds)}</div>
    </div>
  );
}

import { useState, useEffect } from 'react';

export default App;
