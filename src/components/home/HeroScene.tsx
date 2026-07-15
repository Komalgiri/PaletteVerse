import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, Box, MeshDistortMaterial, Float, TorusKnot, Octahedron } from '@react-three/drei';

const FloatingShapes = () => {
  return (
    <>
      {/* Top Left */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Box args={[1.2, 1.2, 1.2]} position={[-4.5, 2.5, -3]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <meshPhysicalMaterial 
            color="#6366f1" 
            roughness={0.1} 
            metalness={0.8}
            transmission={0.5}
            thickness={1}
          />
        </Box>
      </Float>

      {/* Bottom Right */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <TorusKnot args={[0.6, 0.2, 128, 16]} position={[4.5, -2.5, -2]}>
          <meshPhysicalMaterial 
            color="#a855f7" 
            roughness={0.2} 
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </TorusKnot>
      </Float>

      {/* Top Right */}
      <Float speed={2.5} rotationIntensity={1} floatIntensity={2.5}>
        <Sphere args={[1.2, 64, 64]} position={[4.5, 2.5, -4]}>
          <MeshDistortMaterial
            color="#ec4899"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.8}
          />
        </Sphere>
      </Float>

      {/* Bottom Left */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Octahedron args={[0.8]} position={[-4.5, -2.5, -2]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <meshPhysicalMaterial 
            color="#38bdf8" 
            roughness={0.3} 
            metalness={0.6}
            clearcoat={0.5}
          />
        </Octahedron>
      </Float>
    </>
  );
};

export const HeroScene: React.FC = () => {
  return (
    <div className="hero-scene-container">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#e0e7ff" />
        <spotLight position={[0, 5, 5]} intensity={1.5} color="#fbcfe8" penumbra={1} />
        <FloatingShapes />
      </Canvas>
    </div>
  );
};
