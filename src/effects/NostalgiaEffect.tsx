import { forwardRef, useMemo } from 'react';
import { Effect } from 'postprocessing';
import { Uniform } from 'three';

const fragmentShader = `
uniform float opacity;
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Sepia Tone
    vec3 sepia = vec3(
        dot(inputColor.rgb, vec3(0.393, 0.769, 0.189)),
        dot(inputColor.rgb, vec3(0.349, 0.686, 0.168)),
        dot(inputColor.rgb, vec3(0.272, 0.534, 0.131))
    );
    
    vec3 color = mix(inputColor.rgb, sepia, 0.6 * opacity);
    outputColor = vec4(color, inputColor.a);
}
`;

// @ts-nocheck
class NostalgiaEffectImpl extends Effect {
    constructor({ opacity = 1.0 } = {}) {
        super('NostalgiaEffect', fragmentShader, {
            uniforms: new Map([['opacity', new Uniform(opacity)]]),
        });
    }
}

// R3F Component wrapper would typically go here or be used via primitive
// But sticking to simple custom pass pattern
export const NostalgiaEffect = forwardRef(({ opacity = 1.0 }: { opacity?: number }, ref) => {
    const effect = useMemo(() => new NostalgiaEffectImpl({ opacity }), [opacity]);
    return <primitive ref={ref} object={effect} dispose={null} />;
});
