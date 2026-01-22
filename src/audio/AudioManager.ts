import * as Tone from 'tone';
import { Mood, AudioData } from '../store/useMoodStore';

export class AudioManager {
    private static instance: AudioManager;
    private isInitialized: boolean = false;

    // Oscillators
    private leftBinaural: Tone.Oscillator | null = null;
    private rightBinaural: Tone.Oscillator | null = null;
    private isochronicCarrier: Tone.Oscillator | null = null;
    private isochronicLFO: Tone.LFO | null = null;
    private isochronicGain: Tone.Gain | null = null;
    private mergeNode: Tone.Merge | null = null;

    // Master Chain
    private gainNode: Tone.Gain;

    // Audio Analysis
    private analyser: Tone.Analyser | null = null;
    private animationFrameId: number | null = null;

    private constructor() {
        // Initialize gain node lazily - don't connect until after user gesture
        this.gainNode = new Tone.Gain(0);
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    public async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // Resume Tone.js's built-in context (this is the proper way)
            await Tone.start();

            // Wait for context to actually be running
            if (Tone.context.state !== 'running') {
                await Tone.context.resume();
            }

            console.log('Audio Context State:', Tone.context.state);

            if (Tone.context.state !== 'running') {
                throw new Error('AudioContext failed to start');
            }

            // Now connect to destination after context is running
            this.gainNode.toDestination();

            // Setup Analyser for Audio-Reactive Visuals
            this.analyser = new Tone.Analyser('fft', 128);
            this.gainNode.connect(this.analyser);

            // Start analysis loop
            this.startAnalysisLoop();

            this.isInitialized = true;
            console.log('AudioManager initialized successfully');
        } catch (error) {
            console.error('AudioManager initialization failed:', error);
            throw error;
        }
    }

    private startAnalysisLoop() {
        const analyze = () => {
            if (this.analyser) {
                const frequencyData = this.analyser.getValue() as Float32Array;
                // Normalize and copy to transient store
                for (let i = 0; i < AudioData.frequency.length; i++) {
                    // Convert dB to 0-255 range
                    const val = Math.max(0, Math.min(255, (frequencyData[i] + 100) * 2.55));
                    AudioData.frequency[i] = val;
                }
                // Simple beat detection: check if bass is above threshold
                const bass = (AudioData.frequency[2] + AudioData.frequency[3] + AudioData.frequency[4]) / 3;
                AudioData.beat = bass > 180;
            }
            this.animationFrameId = requestAnimationFrame(analyze);
        };
        analyze();
    }

    public setVolume(volume: number) {
        if (this.isInitialized) {
            this.gainNode.gain.rampTo(volume, 0.1);
        }
    }

    public async setMood(mood: Mood) {
        if (!this.isInitialized) {
            console.warn('AudioManager not initialized, cannot set mood');
            return;
        }

        // 1. Fade Out Current
        const fadeOutTime = 1.5;
        this.gainNode.gain.rampTo(0, fadeOutTime);

        // 2. Wait for fade out, then swap
        setTimeout(() => {
            this.stopAll();

            // 3. Setup New Mood
            switch (mood) {
                case Mood.CALM:
                    this.playBinaural(200, 10); // Alpha
                    break;
                case Mood.FOCUS:
                    this.playIsochronic(400, 18); // Beta
                    break;
                case Mood.ENERGY:
                    this.playIsochronic(528, 40); // Gamma
                    break;
                case Mood.SLEEP:
                    this.playBinaural(150, 2); // Delta
                    break;
                case Mood.NOSTALGIA:
                    this.playBinaural(300, 10);
                    break;
            }

            // 4. Fade In New
            this.gainNode.gain.rampTo(0.5, 1.5); // Lower volume to 0.5 for safety
        }, fadeOutTime * 1000 + 50);
    }

    private playBinaural(carrierFreq: number, beatFreq: number) {
        this.mergeNode = new Tone.Merge().connect(this.gainNode);

        this.leftBinaural = new Tone.Oscillator(carrierFreq, "sine").connect(this.mergeNode, 0, 0).start();
        this.rightBinaural = new Tone.Oscillator(carrierFreq + beatFreq, "sine").connect(this.mergeNode, 0, 1).start();
    }

    private playIsochronic(carrierFreq: number, pulseRate: number) {
        this.isochronicGain = new Tone.Gain(0).connect(this.gainNode);
        this.isochronicCarrier = new Tone.Oscillator(carrierFreq, "sine").connect(this.isochronicGain).start();

        // LFO modulates gain for "Pulse" effect
        this.isochronicLFO = new Tone.LFO(pulseRate, 0, 1).start();
        this.isochronicLFO.connect(this.isochronicGain.gain);
    }

    public stopAll() {
        this.leftBinaural?.dispose();
        this.rightBinaural?.dispose();
        this.isochronicCarrier?.dispose();
        this.isochronicLFO?.dispose();
        this.isochronicGain?.dispose();
        this.mergeNode?.dispose();

        this.leftBinaural = null;
        this.rightBinaural = null;
        this.isochronicCarrier = null;
        this.isochronicLFO = null;
        this.isochronicGain = null;
        this.mergeNode = null;
    }

    public destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.stopAll();
        this.analyser?.dispose();
    }
}
