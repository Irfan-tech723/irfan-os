"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Mangaluru, India
const LAT = 12.9141;
const LON = 74.856;
const RADIUS = 2;

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const clock = useRef(0);
  const markerPos = useMemo(() => latLonToVector3(LAT, LON, RADIUS), []);

  useFrame((_, delta) => {
    clock.current += delta;
    if (groupRef.current) groupRef.current.rotation.y += 0.0025;
    if (ringRef.current) {
      const t = (clock.current * 0.6) % 1;
      ringRef.current.scale.setScalar(1 + t * 1.2);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.6 - t * 0.6);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[RADIUS, 24, 18]} />
        <meshBasicMaterial color="#242424" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[RADIUS * 0.995, 32, 24]} />
        <meshBasicMaterial color="#050505" transparent opacity={0.7} />
      </mesh>

      {/* Marker pin at Mangaluru */}
      <mesh position={markerPos}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#ffb020" />
      </mesh>
      {/* Pulsing arc/ring emanating from the marker */}
      <mesh ref={ringRef} position={markerPos}>
        <ringGeometry args={[0.05, 0.065, 32]} />
        <meshBasicMaterial color="#ffb020" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function InteractiveGlobe() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative w-full max-w-[320px] aspect-square mx-auto md:mx-0">
      {mounted && (
        <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }} gl={{ alpha: true, antialias: true }}>
          <Globe />
        </Canvas>
      )}
      <div className="absolute inset-x-0 -bottom-2 flex flex-col items-center gap-1 pointer-events-none">
        <div
          className="font-mono text-[10px] text-amber uppercase"
          style={{ letterSpacing: "0.14em" }}
        >
          Mangaluru, India
        </div>
        <div className="flex gap-2">
          <span className="font-mono text-[9px] text-blue border border-blue/40 rounded-full px-2 py-0.5">
            Open to Opportunities
          </span>
          <span className="font-mono text-[9px] text-blue border border-blue/40 rounded-full px-2 py-0.5">
            Open to Relocation
          </span>
        </div>
      </div>
    </div>
  );
}
