// @ts-nocheck
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { useMoodStore, Mood } from '../../store/useMoodStore';
import { FlowField } from './FlowField';
import { ReactionDiffusion } from './ReactionDiffusion';
import { EnergyPulse } from './EnergyPulse';
import { Starfield } from './Starfield';
import { NostalgiaEffect } from '../../effects/NostalgiaEffect';

export function Scene() {
    const currentMood = useMoodStore((state) => state.currentMood);

    const isCalm = currentMood === Mood.CALM;
    const isFocus = currentMood === Mood.FOCUS;
    const isEnergy = currentMood === Mood.ENERGY;
    const isSleep = currentMood === Mood.SLEEP;
    const isNostalgia = currentMood === Mood.NOSTALGIA;

    return (
        <>
            <color attach="background" args={[isCalm ? '#001015' : '#000000']} />

            {/* Visual Modes */}
            {isCalm ? <FlowField /> : null}
            {isFocus ? <ReactionDiffusion /> : null}
            {isEnergy ? <EnergyPulse /> : null}
            {isSleep ? <Starfield /> : null}
            {isNostalgia ? <FlowField /> : null} {/* Nostalgia reuses Calm visual + Sepia */}

            {/* Post Processing Chain */}
            <EffectComposer disableNormalPass>
                {isCalm ? <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.4} /> : null}
                {(isFocus || isEnergy) ? <Bloom luminanceThreshold={0.8} intensity={0.5} /> : null}

                {/* Nostalgia Post-Processing */}
                {isNostalgia ? <NostalgiaEffect opacity={0.8} /> : null}

                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                <Noise opacity={isCalm ? 0.05 : 0.1} />
            </EffectComposer>
        </>
    );
}
