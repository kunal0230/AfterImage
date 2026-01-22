# computational-affective-engineering-spec

# Technical Specification: Mood on Demand Platform (High-Performance Edition)

## 1. Executive Summary

The "Mood on Demand" platform is a browser-based Digital Therapeutic (DTx) tool.
**Critical Requirement**: "Zero-Latency" feel. The system minimizes Input Lag, Audio Output Latency, and Render Loop Overhead using state-of-the-art web optimization techniques (Transient Updates, Shader-First Architecture, Interactive AudioContext).

## 2. System Architecture

### 2.1 Performance First Core Stack

* **Framework**: React (Vite) - *Micro-optimized build*
* **State**: Zustand + `zustand/middleware` (Transient Updates for 120Hz sync)
* **Visuals**: React Three Fiber (R3F) + custom GLSL (GPU-only computation)
* **Audio**: Tone.js (Web Audio API `AudioContext` with `latencyHint: 'interactive'`)

### 2.2 Data Flow & "Zero Latency" Strategy

To achieve the perception of 0ms latency:

1. **Immediate Input Feedback**: UI state updates optimistic (before audio confirms).
2. **Transient Subscription**: Visual components subscribe *directly* to the store's ephemeral state (e.g., audio analysis data) outside the React Render Cycle.
    * *Bad*: `State -> React Re-render -> Canvas Update` (~16ms-32ms lag)
    * *Good*: `State -> Ref Mutation -> Canvas Draw` (~0ms overhead)

## 3. High-Performance Module Specifications

### 3.1 The Mood Matrix (Configuration)

*Remains unchanged from v1, as it is a static config.*

### 3.2 Visual Engine (Shader-First Architecture)

**Objective**: 120FPS consistent rendering. CPU frame budget < 8ms.

* **Shader-Only Logic**:
  * Complex calculations (Perlin Noise, Reaction-Diffusion) MUST run on the Fragment Shader.
  * **CPU Role**: Passive. Only sends `uTime` and normalized `uAudioData`.
* **Instancing**:
  * **Calm Mode**: Use `InstancedMesh` for particles. 1 Draw Call maximum.
  * **Avoid**: Individual `<Mesh>` components for particles.
* **Frame Loop**:
  * Use `useFrame((state, delta) => ...)` with priority levels to ensure audio analysis happens *before* visual update.

### 3.3 Audio Engine (Precision Scheduling)

**Objective**: Glitch-free entrainment with minimum buffer latency.

* **Context Config**:

       ```javascript

   const context = new AudioContext({ latencyHint: 'interactive', sampleRate: 44100 });

   ```
*   **Scheduling**:
    *   Use `AudioContext.currentTime` ("Keep-Up" pattern) for isochronic pulses to prevent drift.
    *   **Lookahead**: Schedule audio events 50ms-100ms in advance (standard best practice) to prevent garbage collection jitters, but trigger *visual* cues immediately for perceived responsiveness.

### 3.4 Cross-Modal Synchronization (The "Tight Loop")
*   **Direct Binding**:
    *   Do NOT store audio analysis data in React State.
    *   Store in a `currentRef` or a vanilla JS singleton.
    *   R3F components read directly from this singleton inside the Shader Uniform update loop.

## 4. User Interface Recommendations
*   **Optimistic UI**: Click -> Instant Visual Change. The audio ramps (cross-fades) in the background (100-300ms) to prevent speakers popping, but the visual feedback is instant.
*   **Pointer Events**: Set `pointer-events: none` on the R3F Canvas to ensure it never blocks UI thread scrolling/interaction.

## 5. Security & Safety (Unchanged)
1.  **Epilepsy Warning**: Mandatory modal before "Energy" or "Focus" modes utilizing flicker.
2.  **Audio Safety**: Hard limiters on global gain.
