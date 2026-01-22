import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, createPortal } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import * as THREE from 'three';
import vertexShader from '../../shaders/ReactionDiffusion.vertex.glsl';
import fragmentShader from '../../shaders/ReactionDiffusion.fragment.glsl';
import { AudioData } from '../../store/useMoodStore';

export function ReactionDiffusion() {
    const { size } = useThree();

    // Create Ping-Pong Buffers
    const bufferA = useFBO(size.width / 2, size.height / 2, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGFormat,
        type: THREE.FloatType,
    });

    const bufferB = useFBO(size.width / 2, size.height / 2, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGFormat,
        type: THREE.FloatType,
    });

    const simulationMaterial = useRef<THREE.ShaderMaterial>(null);
    const displayMaterial = useRef<THREE.ShaderMaterial>(null);
    const scene = useMemo(() => new THREE.Scene(), []);
    const camera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
    const mesh = useRef<THREE.Mesh>(null);

    // Simulation Uniforms
    const simUniforms = useMemo(() => ({
        uTime: { value: 0 },
        uTexture: { value: null },
        uResolution: { value: new THREE.Vector2(size.width / 2, size.height / 2) },
        uFeed: { value: 0.037 },
        uKill: { value: 0.06 },
        uDt: { value: 0.8 },
        uColor: { value: new THREE.Color('#ffcc00') },
    }), [size.height, size.width]);

    // Display Uniforms 
    const displayUniforms = useMemo(() => ({
        uTexture: { value: null },
        uColor: { value: new THREE.Color('#ffcc00') },
    }), []);

    // Initial Seed
    useEffect(() => {
        // Seed logic placeholder
    }, []);

    // State for ping-pong
    const frameRef = useRef(0);

    useFrame(({ gl, clock }) => {
        if (!simulationMaterial.current || !displayMaterial.current) return;

        // Swap buffers
        const readBuffer = frameRef.current % 2 === 0 ? bufferA : bufferB;
        const writeBuffer = frameRef.current % 2 === 0 ? bufferB : bufferA;
        frameRef.current++;

        // Update Uniforms
        simulationMaterial.current.uniforms.uTexture.value = readBuffer.texture;
        simulationMaterial.current.uniforms.uTime.value = clock.getElapsedTime();

        // Audio Reactivity
        const beat = AudioData.beat ? 0.005 : 0.0;
        simulationMaterial.current.uniforms.uFeed.value = 0.037 + beat;

        // Render Simulation to FBO
        gl.setRenderTarget(writeBuffer);
        gl.render(scene, camera);
        gl.setRenderTarget(null);

        // Output to Screen
        displayMaterial.current.uniforms.uTexture.value = writeBuffer.texture;
    });

    return (
        <>
            {createPortal(
                <mesh ref={mesh}>
                    <planeGeometry args={[2, 2]} />
                    <shaderMaterial
                        ref={simulationMaterial}
                        vertexShader={vertexShader}
                        fragmentShader={fragmentShader}
                        uniforms={simUniforms}
                    />
                </mesh>,
                scene
            )}

            <mesh scale={[size.width / 100, size.height / 100, 1]}>
                <planeGeometry args={[1, 1]} />
                <shaderMaterial
                    ref={displayMaterial}
                    vertexShader={vertexShader}
                    fragmentShader={`
                uniform sampler2D uTexture;
                uniform vec3 uColor;
                varying vec2 vUv;
                void main() {
                    float val = texture2D(uTexture, vUv).g;
                    vec3 col = uColor * val * 3.0;
                    gl_FragColor = vec4(col, 1.0);
                }
            `}
                    uniforms={displayUniforms}
                    transparent
                />
            </mesh>
        </>
    );
}
