import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Combat Arena with pulsing energy barriers
const CombatArena = () => {
  const arenaRef = useRef<THREE.Group>(null);
  const barrierRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    if (arenaRef.current) {
      arenaRef.current.rotation.y += 0.002;
    }
    
    // Pulsing energy barriers
    barrierRefs.current.forEach((barrier, index) => {
      if (barrier && barrier.material instanceof THREE.MeshStandardMaterial) {
        const pulse = Math.sin(state.clock.elapsedTime * 2 + index) * 0.3 + 0.7;
        barrier.material.emissiveIntensity = pulse;
        barrier.scale.setScalar(0.95 + pulse * 0.05);
      }
    });
  });

  return (
    <group ref={arenaRef}>
      {/* Arena Floor */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 5, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#16213e"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Energy Barriers */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 4.5;
        const z = Math.sin(angle) * 4.5;
        
        return (
          <mesh
            key={i}
            ref={(el) => el && (barrierRefs.current[i] = el)}
            position={[x, 0, z]}
            rotation={[0, angle + Math.PI / 2, 0]}
          >
            <boxGeometry args={[0.1, 6, 2]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#0088ff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
      
      {/* Tiered Seating */}
      {Array.from({ length: 3 }).map((_, tier) => (
        <group key={tier}>
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            const radius = 6 + tier * 1.5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            return (
              <mesh
                key={`${tier}-${i}`}
                position={[x, tier * 2 + 1, z]}
                rotation={[0, angle, 0]}
              >
                <boxGeometry args={[1, 0.5, 0.3]} />
                <meshStandardMaterial
                  color="#2a2a3e"
                  emissive="#1a1a2e"
                  emissiveIntensity={0.1}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
};

// Interdimensional Portals
const PortalSystem = () => {
  const portalRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    portalRefs.current.forEach((portal, index) => {
      if (portal && portal.material instanceof THREE.MeshStandardMaterial) {
        portal.rotation.z += 0.02 + index * 0.005;
        const pulse = Math.sin(state.clock.elapsedTime * 1.5 + index * 2) * 0.5 + 0.5;
        portal.material.emissiveIntensity = pulse * 0.8;
      }
    });
  });

  const portals = [
    { position: [-8, 3, -5] as [number, number, number], color: '#ff4444', emissive: '#ff2222' }, // Dark Arena
    { position: [8, 2, -3] as [number, number, number], color: '#4488ff', emissive: '#2266ff' },  // Sci-Fi AI
    { position: [0, 5, -8] as [number, number, number], color: '#aa44ff', emissive: '#8822ff' },  // Fantasy Tech
  ];

  return (
    <group>
      {portals.map((portal, index) => (
        <mesh
          key={index}
          ref={(el) => el && (portalRefs.current[index] = el)}
          position={portal.position}
        >
          <torusGeometry args={[1.5, 0.3, 16, 32]} />
          <meshStandardMaterial
            color={portal.color}
            emissive={portal.emissive}
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// Floating Combat Elements
const CombatElements = () => {
  const elementRefs = useRef<THREE.Group[]>([]);
  
  useFrame((state) => {
    elementRefs.current.forEach((element, index) => {
      if (element) {
        element.rotation.y += 0.01 + index * 0.002;
        element.position.y += Math.sin(state.clock.elapsedTime + index) * 0.002;
      }
    });
  });

  const elements = [
    { position: [-6, 4, 2] as [number, number, number], type: 'weapon' },
    { position: [6, 3, -2] as [number, number, number], type: 'artifact' },
    { position: [0, 6, 4] as [number, number, number], type: 'display' },
    { position: [-3, 5, -6] as [number, number, number], type: 'debris' },
  ];

  return (
    <group>
      {elements.map((element, index) => (
        <group
          key={index}
          ref={(el) => el && (elementRefs.current[index] = el)}
          position={element.position}
        >
          {element.type === 'weapon' && (
            <mesh>
              <cylinderGeometry args={[0.1, 0.2, 2]} />
              <meshStandardMaterial
                color="#ffaa00"
                emissive="#ff8800"
                emissiveIntensity={0.4}
                metalness={0.9}
              />
            </mesh>
          )}
          {element.type === 'artifact' && (
            <mesh>
              <octahedronGeometry args={[0.8]} />
              <meshStandardMaterial
                color="#aa00ff"
                emissive="#8800ff"
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>
          )}
          {element.type === 'display' && (
            <mesh>
              <planeGeometry args={[2, 1]} />
              <meshStandardMaterial
                color="#00ffaa"
                emissive="#00aa88"
                emissiveIntensity={0.6}
                transparent
                opacity={0.7}
              />
            </mesh>
          )}
          {element.type === 'debris' && (
            <mesh>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial
                color="#666666"
                emissive="#444444"
                emissiveIntensity={0.2}
                metalness={0.7}
                roughness={0.8}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

// Enhanced Particle Systems
const EnhancedParticles = () => {
  const particleGroups = useRef<THREE.Points[]>([]);
  
  const particleSystems = useMemo(() => {
    const systems = [];
    
    // Energy sparks
    const sparkCount = 200;
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkColors = new Float32Array(sparkCount * 3);
    
    for (let i = 0; i < sparkCount; i++) {
      const radius = 3 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      const height = Math.random() * 10 - 2;
      
      sparkPositions[i * 3] = Math.cos(angle) * radius;
      sparkPositions[i * 3 + 1] = height;
      sparkPositions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.3 + 0.1, 1, 0.8);
      sparkColors[i * 3] = color.r;
      sparkColors[i * 3 + 1] = color.g;
      sparkColors[i * 3 + 2] = color.b;
    }
    
    systems.push({
      positions: sparkPositions,
      colors: sparkColors,
      size: 0.05,
      count: sparkCount
    });
    
    // Data streams
    const streamCount = 150;
    const streamPositions = new Float32Array(streamCount * 3);
    const streamColors = new Float32Array(streamCount * 3);
    
    for (let i = 0; i < streamCount; i++) {
      streamPositions[i * 3] = (Math.random() - 0.5) * 20;
      streamPositions[i * 3 + 1] = Math.random() * 15;
      streamPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      const color = new THREE.Color('#00aaff');
      streamColors[i * 3] = color.r;
      streamColors[i * 3 + 1] = color.g;
      streamColors[i * 3 + 2] = color.b;
    }
    
    systems.push({
      positions: streamPositions,
      colors: streamColors,
      size: 0.03,
      count: streamCount
    });
    
    return systems;
  }, []);
  
  useFrame((state) => {
    particleGroups.current.forEach((group, index) => {
      if (group) {
        group.rotation.y += 0.001 + index * 0.0005;
        
        if (index === 0) {
          // Energy sparks movement
          const positions = group.geometry.attributes.position.array;
          for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;
          }
          group.geometry.attributes.position.needsUpdate = true;
        }
      }
    });
  });

  return (
    <group>
      {particleSystems.map((system, index) => (
        <points
          key={index}
          ref={(el) => el && (particleGroups.current[index] = el)}
        >
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={system.count}
              array={system.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={system.count}
              array={system.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={system.size}
            vertexColors
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ))}
    </group>
  );
};

// Interactive Camera Controller
const InteractiveCamera = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
};

export const Hero3DBackground = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMouse({
      x: (event.clientX - rect.left) / rect.width * 2 - 1,
      y: -(event.clientY - rect.top) / rect.height * 2 + 1,
    });
  };

  return (
    <div 
      className="absolute inset-0 opacity-40"
      onMouseMove={handleMouseMove}
    >
      <Canvas camera={{ position: [0, 2, 12], fov: 60 }}>
        {/* Enhanced Lighting System */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-8, 4, -6]} intensity={1.2} color="#ff4444" />
        <pointLight position={[8, 3, -4]} intensity={1.2} color="#4488ff" />
        <pointLight position={[0, 8, -8]} intensity={1.0} color="#aa44ff" />
        <spotLight
          position={[0, 15, 0]}
          angle={Math.PI / 6}
          penumbra={1}
          intensity={0.8}
          color="#ffffff"
          target-position={[0, 0, 0]}
        />
        
        {/* Interactive Camera */}
        <InteractiveCamera mouse={mouse} />
        
        {/* 3D Arena Components */}
        <CombatArena />
        <PortalSystem />
        <CombatElements />
        <EnhancedParticles />
        
        {/* Subtle Orbit Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};