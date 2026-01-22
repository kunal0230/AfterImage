import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AudioData } from '../../store/useMoodStore';

export function EnergyPulse() {
    // Create array of particles for burst
    const count = 50;
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const meshRef = useRef<THREE.InstancedMesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.getElapsedTime();
        // Using AudioData.beat (future hook) to drive intensity
        const beatParams = AudioData.beat ? 1.5 : 1.0;

        // Rotate entire group fast
        meshRef.current.rotation.z += 0.05;

        // Scale on beat 
        const scale = beatParams + Math.sin(time * 20) * 0.2;
        meshRef.current.scale.setScalar(scale);

        // Color shift
        (meshRef.current.material as THREE.MeshBasicMaterial).color.setHSL((time * 0.5) % 1, 1, 0.5);

        // Update instances
        for (let i = 0; i < count; i++) {
            const radius = 2 + Math.sin(time * 5 + i) * 0.5;
            const angle = (i / count) * Math.PI * 2;
            dummy.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );
            dummy.lookAt(0, 0, 0);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <planeGeometry args={[0.1, 0.5]} />
            <meshBasicMaterial color="#ff0000" toneMapped={false} />
        </instancedMesh>
    );
}
