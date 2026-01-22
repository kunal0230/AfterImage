/**
 * App.tsx - Main Application Entry Point
 * 
 * Virtual Productivity Workspace inspired by LifeAt.io
 * Features: Sidebar, Draggable Widgets, Background Scenes, Sound Mixer
 */

import { useState, useEffect } from 'react';
import { ScenePlayer } from './components/canvas/ScenePlayer';
import { Sidebar } from './components/layout/Sidebar';
import { WidgetContainer } from './components/layout/WidgetContainer';
import { BackgroundSelector } from './components/layout/BackgroundSelector';
import { Airlock } from './components/ui/Airlock';
import { useMoodStore } from './store/useMoodStore';

function App() {
  const isPlaying = useMoodStore((state) => state.isPlaying);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bgSelectorOpen, setBgSelectorOpen] = useState(false);

  // Don't render workspace until user completes onboarding
  if (!isPlaying) {
    return <Airlock />;
  }

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden select-none font-sans">
      {/* Background Scene (Video/Image) */}
      <ScenePlayer />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content Area */}
      <main className={`absolute inset-0 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Bar */}
        <header className="fixed top-0 right-0 z-30 p-4" style={{ left: sidebarOpen ? '16rem' : '4rem' }}>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium text-gray-800">
              Virtual Workspace
            </h1>
            <div className="flex items-center gap-3">
              <ChangeSceneButton onClick={() => setBgSelectorOpen(true)} />
              <SessionTimer />
            </div>
          </div>
        </header>

        {/* Draggable Widgets */}
        <WidgetContainer />
      </main>

      {/* Background Selector Modal */}
      <BackgroundSelector
        isOpen={bgSelectorOpen}
        onClose={() => setBgSelectorOpen(false)}
      />
    </div>
  );
}

/**
 * Button to open background scene selector
 */
function ChangeSceneButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
    >
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-sm text-gray-700">Change Scene</span>
    </button>
  );
}

/**
 * Session Timer - Tracks time spent in workspace
 */
function SessionTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number): string => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-sm text-gray-700 tabular-nums font-medium">
        {formatTime(seconds)}
      </span>
    </div>
  );
}

export default App;
