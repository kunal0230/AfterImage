import { useState } from 'react';
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

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden select-none font-sans">
      {/* 1. Onboarding */}
      <Airlock />

      {/* Main Workspace (shown after onboarding) */}
      {isPlaying && (
        <>
          {/* 2. Background Scene */}
          <ScenePlayer />

          {/* 3. Sidebar Navigation */}
          <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

          {/* 4. Draggable Widgets */}
          <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
            <WidgetContainer />
          </div>

          {/* 5. Background Selector Modal */}
          <BackgroundSelector isOpen={bgSelectorOpen} onClose={() => setBgSelectorOpen(false)} />

          {/* 6. Top Bar */}
          <div className={`fixed top-0 right-0 left-0 z-30 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
            <div className="flex items-center justify-between p-4">
              {/* Left: Title */}
              <div className="text-gray-800 font-medium">
                <span className="text-xl">Virtual Workspace</span>
              </div>

              {/* Right: Controls */}
              <div className="flex items-center gap-3">
                {/* Change Background Button */}
                <button
                  onClick={() => setBgSelectorOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-700">Change Scene</span>
                </button>

                {/* Session Timer */}
                <SessionTimer />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Session Timer Component
function SessionTimer() {
  const [seconds, setSeconds] = useState(0);

  useState(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  });

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
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
      <span className="text-sm text-gray-700 tabular-nums font-medium">{formatTime(seconds)}</span>
    </div>
  );
}

export default App;
