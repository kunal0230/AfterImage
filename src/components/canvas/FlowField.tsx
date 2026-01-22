import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../../shaders/FlowField.vertex.glsl';
import fragmentShader from '../../shaders/FlowField.fragment.glsl';
import { AudioData } from '../../store/useMoodStore';

export function FlowField() {
    const meshRef = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('#0088aa') }, // Calm Teal
            uSpeed: { value: 0.1 },
        }),
        []
    );

    useFrame((state) => {
        if (meshRef.current) {
            // Shader Time
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();

            // Audio Reactivity (Transient Update)
            // Map low frequencies (bass) to speed or color intensity
            const bass = AudioData.frequency[10] / 255.0; // Simple sample
            // Lerp speed slightly
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.uSpeed.value = THREE.MathUtils.lerp(
                (meshRef.current.material as THREE.ShaderMaterial).uniforms.uSpeed.value,
                0.1 + bass * 0.2,
                0.1
            );
        }
    });

    return (
        <mesh ref={meshRef} scale={[10, 10, 1]}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
            />
        </mesh>
    );
}
