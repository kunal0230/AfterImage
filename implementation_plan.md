# Implementation Plan - Mood on Demand (High-Performance)

# Goal Description

Build a "Computational Affective Engineering" platform with "Zero-Latency" responsiveness.

## User Review Required
>
> [!IMPORTANT]
> **Performance Architecture**: This plan mandates the use of **Transient State Updates** (bypassing React render for frame-loops) and **Shader-First** visuals. This increases code complexity but is required for 60/120Hz consistency.

## Proposed Changes

### Phase 1: Foundation & High-Perf Architecture

#### [NEW] [Project Scaffolding]

- Initialize Vite + React.
- Install `r3f-perf` (for monitoring) alongside standard dependencies.
- **Optimization**: Configure `vite.config.ts` for shader file support (`.glsl`).

#### [NEW] [src/store/useMoodStore.ts] (Transient)

- Implement standard Zustand store for UI state.
- **Optimization**: Create a `Ref` based singleton (or `zustand/vanilla` store) for high-frequency audio data to avoid React reconciliation during frame loops.

### Phase 2: Low-Latency Audio Engine

#### [NEW] [src/audio/AudioManager.ts]

- Initialize `AudioContext` with `latencyHint: 'interactive'`.
- Implement `scheduleAheadTime` pattern (0.1s lookahead) for jitter-free rhythm.
- **Optimization**: Use `GainNode` ramping for click-free state switching.

### Phase 3: Shader-First Visual Engine

#### [NEW] [src/components/canvas/Scene.tsx]

- Setup `Canvas` with `dpr={[1, 2]}` (adaptive DPI) and `gl={{ powerPreference: "high-performance" }}`.

#### [NEW] [src/shaders/FlowField.glsl] (Calm)

- **GPU-Only**: Move particle physics entirely to Vertex Shader (using Curl Noise) if possible, or Fragment shader for fluids.

#### [NEW] [src/shaders/ReactionDiffusion.glsl] (Focus)

- Implement ping-pong buffer technique for reaction-diffusion (requires off-screen buffer).

### Phase 4: Emotional Design System & Integration

#### [NEW] [src/components/ui/TheOrb.tsx]

- Central interactive sphere.
- **Physics**: Uses `react-use-gesture` for drag/dial interaction with inertia.
- **Feedback**: Vibrates (CSS transform/R3F shader) based on `moodIntensity`.

#### [NEW] [src/effects/NostalgiaEffect.tsx]

- Custom EffectPass for `postprocessing`.
- **Chain**: `SepiaLUT` -> `FilmGrain` -> `Vignette`.
- **Logic**: Activated when `mood === 'NOSTALGIA'`.

#### [NEW] [src/styles/typography.css]

- Import Variable Fonts.
- CSS Variables for `--font-weight-current` mapped to store state.

#### [NEW] [src/components/ui/Airlock.tsx]

- Full-screen onboarding overlay.

#### [NEW] [src/components/ui/MoodSelector.tsx] (Optimistic)

- Implement `onClick` handler that updates UI state *immediately* (0ms) while triggering the async audio/visual transition (300ms fade).

## Verification Plan

### Automated Tests

- Unit tests for State logic.

### Manual Verification (Performance Focused)

- **Latency Check**: Click "Energy" -> Visuals change within 1 frame (16ms).
- **FPS Check**: Sustain 60fps (or 120fps) on target device.
- **Audio Check**: No "crackling" (underruns) during heavy shader compilation.
