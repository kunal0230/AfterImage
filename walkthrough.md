# Walkthrough - Mood on Demand

I have successfully built the **Mood on Demand** "Computational Affective Engineering" platform. This system triggers emotional states through congruent auditory and visual stimulation with a focus on "Zero-Latency" responsiveness.

## 1. System Components

### The Mood Orb (Design)

The central interface element. It uses physics-based spring animation (`react-use-gesture` + `react-spring`) to provide tactile feedback.

- Drag **UP** for Energy.
- Drag **DOWN** for Calm.
- Drag **RIGHT** for Focus.

### The Visual Engine (Shader-First)

- **Calm Mode**: `FlowField.tsx` uses custom Perlin Noise shaders to create a bioluminescent fluid simulation.
- **Focus Mode**: `ReactionDiffusion.tsx` implements Gray-Scott reaction-diffusion algorithm using Ping-Pong FBOs for biological pattern generation.
- **Energy Mode**: `EnergyPulse.tsx` creates high-frequency radial bursts.

### The Audio Engine (Low-Latency)

- `AudioManager.ts` wraps `Tone.js` with `latencyHint: 'interactive'`.
- Implements smooth `gain.rampTo` cross-fading (Iso-Principle) to transition between binaural beats (Alpha/Delta) and isochronic tones (Beta/Gamma).

### Post-Processing

- **Nostalgia Effect**: A custom `NostalgiaEffect.tsx` shader pass that implements Sepia constraints.
- **Bloom**: High-performance selectively applied bloom.

## 2. Verification Results

- **Build Status**: `npm run build` is **PASSING** (0 errors).
- **Latency**: AudioContext initialized on user interaction (Airlock) ensures compliance with browser autoplay policies.
- **Performance**: Shaders are compiled to `vite-plugin-glsl` strings, minimizing runtime overhead.

## 3. How to Run

1. `npm install` (Already done)
2. `npm run dev`
3. Click "INITIALIZE" to start the experience.
