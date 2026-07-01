'use client';

import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Suppress THREE.Clock deprecation warning (comes from @react-three/drei Float, not our code)
const _origWarn = console.warn;
console.warn = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
  _origWarn.apply(console, args);
};

const projectColors = ['#c4a35a', '#5a8fc4', '#5ac4a3'];

function TexturedScreen({ url }: { url: string }) {
  const texture = useTexture(url);
  return (
    <meshBasicMaterial
      color="#fff"
      map={texture}
      transparent
    />
  );
}

// Preload all project textures to prevent the fallback color flash on first render
const preloadImages = ['/wifi_thumbnail.png', '/optivraaa.jpeg', '/flowcare.jpeg'];
if (typeof window !== 'undefined') {
  preloadImages.forEach((url) => useTexture.preload(url));
}

export default function FloatingDevice({
  activeProject,
  isExpanded,
  projectImage,
}: {
  activeProject: number;
  isExpanded: boolean;
  projectImage?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const screenGroupRef = useRef<THREE.Group>(null);
  const targetColor = useRef(new THREE.Color(projectColors[0]));
  const currentColor = useRef(new THREE.Color(projectColors[0]));
  const screenRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !screenGroupRef.current) return;

    const isMobile = state.viewport.width < 5;

    if (isExpanded) {
      // Expanded: Lock to the RIGHT (x = 1.5) on desktop, center on mobile. Shift back (z = -5) on mobile.
      const targetX = isMobile ? 0 : 1.5;
      const targetY = isMobile ? -0.4 : -0.4;
      const targetZ = isMobile ? -5 : 0;
      const targetScale = isMobile ? 1.5 : 2.5;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, delta * 4);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.4, delta * 4);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 4);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 4);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 4);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 4));

      // Deconstruct: Screen lifts up (X-Ray effect)
      screenGroupRef.current.position.y = THREE.MathUtils.lerp(screenGroupRef.current.position.y, 1.8, delta * 3);
      screenGroupRef.current.position.z = THREE.MathUtils.lerp(screenGroupRef.current.position.z, -0.2, delta * 3);
      screenGroupRef.current.rotation.x = THREE.MathUtils.lerp(screenGroupRef.current.rotation.x, 0, delta * 4);
    } else {
      // Normal: Follow cursor VERY slightly (reduced movement), float right, shift down slightly
      // Face the laptop towards the left (towards the center of the screen)
      const targetRotX = state.pointer.y * 0.02;
      const targetRotY = -state.pointer.x * 0.02 - 0.25;
      
      const targetX = isMobile ? 0 : 1.7;
      const targetY = isMobile ? -2 : -0.4;
      const targetZ = 0;
      const targetScale = isMobile ? 1.0 : 1.8;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 2);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 2);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 4);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 4);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 4);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 4));

      // Normal: Screen attached (more upright)
      screenGroupRef.current.position.y = THREE.MathUtils.lerp(screenGroupRef.current.position.y, 0.75, delta * 4);
      screenGroupRef.current.position.z = THREE.MathUtils.lerp(screenGroupRef.current.position.z, -0.65, delta * 4);
      screenGroupRef.current.rotation.x = THREE.MathUtils.lerp(screenGroupRef.current.rotation.x, -0.05, delta * 4);
    }

    // Lerp screen color to active project
    targetColor.current.set(projectColors[activeProject] || projectColors[0]);
    currentColor.current.lerp(targetColor.current, delta * 3);
    if (screenRef.current && !projectImage) {
      screenRef.current.color.copy(currentColor.current);
    }
  });

  return (
    <Float speed={isExpanded ? 0 : 1} rotationIntensity={isExpanded ? 0 : 0.05} floatIntensity={isExpanded ? 0 : 0.1}>
      <group ref={groupRef}>
        {/* Laptop Base */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[2, 0.06, 1.4]} />
          {isExpanded ? (
            <meshBasicMaterial
              color={projectColors[activeProject]}
              wireframe={true}
              transparent
              opacity={0.6}
            />
          ) : (
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.8}
              roughness={0.2}
            />
          )}
          {!isExpanded && <Edges color="#333" />}
        </mesh>

        {/* Detachable Screen Group */}
        <group ref={screenGroupRef}>
          {/* Laptop Screen Frame */}
          <mesh>
            <boxGeometry args={[1.9, 1.3, 0.04]} />
            {isExpanded ? (
              <meshBasicMaterial
                color={projectColors[activeProject]}
                wireframe={true}
                transparent
                opacity={0.6}
              />
            ) : (
              <meshStandardMaterial
                color="#111"
                metalness={0.9}
                roughness={0.1}
              />
            )}
            {!isExpanded && <Edges color="#333" />}
          </mesh>

          {/* Screen Surface (Texture or Color) */}
          <mesh position={[0, 0, 0.021]}>
            <planeGeometry args={[1.7, 1.1]} />
            {projectImage ? (
              <Suspense fallback={<meshBasicMaterial color={projectColors[activeProject]} />}>
                <TexturedScreen url={projectImage} />
              </Suspense>
            ) : (
              <meshBasicMaterial
                key="colored"
                ref={screenRef}
                color={projectColors[activeProject]}
                transparent
                opacity={isExpanded ? 0.8 : 1}
              />
            )}
          </mesh>

          <pointLight intensity={0.5} distance={3} color={projectColors[activeProject] || projectColors[0]} position={[0, 0, 0.5]} />
        </group>
      </group>
    </Float>
  );
}
