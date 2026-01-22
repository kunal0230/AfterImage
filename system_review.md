# System Review: Mood on Demand

## Executive Summary

The platform builds successfully and has a solid foundation. However, several **critical issues** and **missing features** must be addressed before production.

---

## 🔴 Critical Issues

### 1. Scene.tsx: Nostalgia Mode Not Rendering

**File**: `Scene.tsx` (Line 14)
**Problem**: `isNostalgia` is never defined, so `NostalgiaEffect` is never rendered.

```tsx
// Missing:
const isNostalgia = currentMood === Mood.NOSTALGIA;
```

**Status**: ⚠️ **BUG** — Nostalgia post-processing is imported but never used.

---

### 2. AudioManager: Memory Leak on Binaural

**File**: `AudioManager.ts` (Line 79)
**Problem**: The `Tone.Merge()` node is created but never disposed in `stopAll()`.

```ts
const merge = new Tone.Merge().connect(this.gainNode);
// merge is never stored or disposed
```

**Status**: ⚠️ **MEMORY LEAK** — Each mood switch creates orphaned nodes.

---

### 3. TheOrb.tsx: Unused Ref Warning

**File**: `TheOrb.tsx` (Line 10)
**Problem**: `orbitalRef` is declared but never actually used for anything meaningful.
**Status**: ℹ️ **Minor** — Dead code, no functional impact.

---

## 🟡 Missing Features

| Feature | Status | Notes |
|---------|--------|-------|
| **SLEEP Mode Visual** | ❌ Missing | No visual component defined. Falls to black screen. |
| **NOSTALGIA Mode Visual** | ❌ Missing | No custom visual, only post-processing. Should have Lo-Fi/Film Grain shader plane. |
| **Audio Analyzer Population** | ❌ Missing | `AudioData.frequency/waveform/beat` are never populated. The transient store exists but isn't connected to `Tone.Analyser`. |
| **Reduced Motion Support** | ❌ Missing | `reducedMotion` is in store but not checked anywhere. |
| **musicVolume Integration** | ❌ Missing | `musicVolume` is in store but not passed to `AudioManager.gainNode`. |
| **Left/Right Gesture for Orb** | ⚠️ Partial | Left drag not mapped. Only Up/Down/Right. |

---

## 🟢 Strengths

| Area | Assessment |
|------|------------|
| **Architecture** | ✅ Clean separation of concerns (Store, Audio, Visual, UI). |
| **State Management** | ✅ Zustand with transient data pattern is correct. |
| **Audio Engine** | ✅ Low-latency context (interactive) is configured. Cross-fade works. |
| **Shader System** | ✅ GLSL imports via `vite-plugin-glsl` working. Custom shaders compile. |
| **UI/UX** | ✅ Orb physics feel premium. Airlock is elegant onboarding. |

---

## Recommendations (Priority Order)

1. **[P0] Fix Nostalgia Rendering**: Add `isNostalgia` constant and conditionally render `NostalgiaEffect`.
2. **[P0] Fix AudioManager Leak**: Store `merge` node as class property and dispose it in `stopAll()`.
3. **[P1] Add SLEEP Visual**: Implement a `Starfield.tsx` component with fading particles.
4. **[P1] Populate AudioData**: Connect `Tone.Analyser` in `AudioManager` and update `AudioData.frequency` every frame.
5. **[P2] Integrate Volume Store**: Pass `useMoodStore.musicVolume` to `AudioManager.gainNode.gain.value`.
6. **[P2] Respect Reduced Motion**: Check `reducedMotion` store in visual components to disable animations.

---

## Build & Performance Notes

- **Bundle Size**: 1.4MB (gzipped: 403KB). Recommend code-splitting R3F effects.
- **Node Version**: Using Node 18.x but Vite 7.x requires Node 20+. Recommend upgrade.
- **TypeScript**: `// @ts-nocheck` is used in `Scene.tsx` due to `@react-three/postprocessing` types. Acceptable workaround.
