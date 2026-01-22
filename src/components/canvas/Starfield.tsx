import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Starfield() {
    const count = 500;
    const meshRef = useRef<THREE.Points>(null);

    // Generate random star positions
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Slow drift
        meshRef.current.rotation.y += 0.0003;
        meshRef.current.rotation.x += 0.0001;

        // Breathing opacity (fade in/out effect)
        const material = meshRef.current.material as THREE.PointsMaterial;
        material.opacity = 0.3 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    });

    return (
        <points ref={meshRef} geometry={geometry}>
            <pointsMaterial
                color="#ffffff"
                size={0.05}
                sizeAttenuation
                transparent
                opacity={0.5}
                depthWrite={false}
            />
        </points>
    );
}
