"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const REDUCE_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Procedurally builds a small "neural network" graph: nodes on a sphere shell,
// edges drawn between nodes that are close enough to each other. This reads
// as an AI core rather than a stock geometric primitive.
function useNetworkGraph(nodeCount: number, radius: number) {
  return useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius * (0.7 + Math.random() * 0.3);
      nodes.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
      );
    }
    const edgePositions: number[] = [];
    const threshold = radius * 0.85;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < threshold) {
          edgePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          edgePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    const nodePositions = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      nodePositions[i * 3] = n.x;
      nodePositions[i * 3 + 1] = n.y;
      nodePositions[i * 3 + 2] = n.z;
    });
    return {
      nodePositions,
      edgePositions: new Float32Array(edgePositions),
    };
  }, [nodeCount, radius]);
}

function AICore() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const clock = useRef(0);

  const { nodePositions, edgePositions } = useNetworkGraph(46, 2.6);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame((_, delta) => {
    clock.current += delta;
    const breathe = 1 + Math.sin(clock.current * 1.1) * 0.06;

    if (coreRef.current) {
      coreRef.current.rotation.y += REDUCE_MOTION ? 0 : 0.0011;
      coreRef.current.scale.setScalar(breathe);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(breathe * 1.35);
    }
    if (lightRef.current) {
      // Lighting "breathes" alongside the core rather than staying flat.
      lightRef.current.intensity = 2.2 + Math.sin(clock.current * 1.1) * 0.6;
    }
    if (groupRef.current && !REDUCE_MOTION) {
      groupRef.current.rotation.y +=
        (mouse.current.x * 0.5 - groupRef.current.rotation.y) * 0.035;
      groupRef.current.rotation.x +=
        (mouse.current.y * 0.3 - groupRef.current.rotation.x) * 0.035;
      groupRef.current.rotation.z += 0.0003;
    }
  });

  return (
    <group ref={groupRef}>
      {/* faked glow — cheaper and more predictable than a postprocessing bloom pass */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color="#3f7fff" transparent opacity={0.08} />
      </mesh>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshStandardMaterial
          color="#0d1a33"
          emissive="#3f7fff"
          emissiveIntensity={1.1}
          roughness={0.25}
          metalness={0.6}
          wireframe
        />
      </mesh>
      <pointLight ref={lightRef} color="#3f7fff" intensity={2.4} distance={8} />

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodePositions.length / 3}
            array={nodePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#ffb020" size={0.045} transparent opacity={0.85} />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={edgePositions.length / 3}
            array={edgePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#3f7fff" transparent opacity={0.18} />
      </lineSegments>
    </group>
  );
}

function DustParticles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 140;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current || REDUCE_MOTION) return;
    ref.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#5a5a5a" size={0.015} transparent opacity={0.45} />
    </points>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const targetZ = useRef(9);

  useEffect(() => {
    function handleScroll() {
      // Subtle dolly — only moves within the hero's own scroll range.
      const hero = document.getElementById("hero");
      if (!hero) return;
      const progress = Math.min(Math.max(-hero.getBoundingClientRect().top, 0), 600) / 600;
      targetZ.current = 9 - progress * 1.2;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (REDUCE_MOTION) return;
    camera.position.z += (targetZ.current - camera.position.z) * 0.04;
  });

  return null;
}

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.15} />
      <CameraRig />
      <AICore />
      <DustParticles />
    </Canvas>
  );
}
