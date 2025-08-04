import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { fighters } from '@/data/fighters';
import { Fighter } from '@/types/fighter';

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

// Fighter Silhouettes System
const FighterSilhouettes = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const fighterRefs = useRef<THREE.Group[]>([]);
  const [activeFighters, setActiveFighters] = useState<Fighter[]>([]);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'attack' | 'defend' | 'victory'>('idle');
  const lastChangeTime = useRef(0);
  const animationTimer = useRef(0);

  // Select random fighters from different realms
  const selectRandomFighters = () => {
    const realms = ['dark-arena', 'sci-fi-ai', 'fantasy-tech', 'earth-1-0'];
    const selectedRealms = realms.sort(() => Math.random() - 0.5).slice(0, 2);
    
    const fighter1 = fighters.filter(f => f.world === selectedRealms[0])[
      Math.floor(Math.random() * fighters.filter(f => f.world === selectedRealms[0]).length)
    ];
    const fighter2 = fighters.filter(f => f.world === selectedRealms[1])[
      Math.floor(Math.random() * fighters.filter(f => f.world === selectedRealms[1]).length)
    ];
    
    return [fighter1, fighter2];
  };

  // Initialize fighters
  useEffect(() => {
    setActiveFighters(selectRandomFighters());
  }, []);

  // Get realm-specific colors
  const getRealmColors = (world: string) => {
    switch (world) {
      case 'dark-arena':
        return { primary: '#ff4444', emissive: '#ff2222', particle: '#ff8844' };
      case 'sci-fi-ai':
        return { primary: '#4488ff', emissive: '#2266ff', particle: '#44aaff' };
      case 'fantasy-tech':
        return { primary: '#aa44ff', emissive: '#8822ff', particle: '#cc66ff' };
      case 'earth-1-0':
        return { primary: '#66aa44', emissive: '#448822', particle: '#88cc44' };
      default:
        return { primary: '#888888', emissive: '#666666', particle: '#aaaaaa' };
    }
  };

  // Create fighter silhouette geometry
  const createFighterGeometry = (world: string) => {
    const group = new THREE.Group();
    const colors = getRealmColors(world);
    
    // Torso
    const torsoGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 8, 16);
    const torsoMaterial = new THREE.MeshStandardMaterial({
      color: colors.primary,
      emissive: colors.emissive,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8,
    });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.y = 0.6;
    group.add(torso);

    // Head
    const headGeometry = world === 'sci-fi-ai' 
      ? new THREE.ConeGeometry(0.3, 0.6, 8)
      : new THREE.SphereGeometry(0.3, 16, 12);
    const headMaterial = torsoMaterial.clone();
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    group.add(head);

    // Arms
    const armGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 6, 12);
    const leftArm = new THREE.Mesh(armGeometry, torsoMaterial.clone());
    leftArm.position.set(-0.6, 0.8, 0);
    leftArm.rotation.z = 0.3;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, torsoMaterial.clone());
    rightArm.position.set(0.6, 0.8, 0);
    rightArm.rotation.z = -0.3;
    group.add(rightArm);

    // Legs
    const legGeometry = new THREE.CapsuleGeometry(0.2, 1, 6, 12);
    const leftLeg = new THREE.Mesh(legGeometry, torsoMaterial.clone());
    leftLeg.position.set(-0.25, -0.5, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, torsoMaterial.clone());
    rightLeg.position.set(0.25, -0.5, 0);
    group.add(rightLeg);

    // Realm-specific enhancements
    if (world === 'dark-arena') {
      // Add spikes/edges
      const spikeGeometry = new THREE.ConeGeometry(0.1, 0.5, 6);
      const spikeMaterial = new THREE.MeshStandardMaterial({
        color: '#ff8844',
        emissive: '#ff4422',
        emissiveIntensity: 0.8,
      });
      const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
      spike.position.set(0, 1.8, 0);
      group.add(spike);
    } else if (world === 'fantasy-tech') {
      // Add mystical aura rings
      const ringGeometry = new THREE.TorusGeometry(0.8, 0.05, 8, 16);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: colors.particle,
        emissive: colors.emissive,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.y = 0.8;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }

    return group;
  };

  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    
    // Change fighters every 8 seconds
    if (elapsedTime - lastChangeTime.current > 8) {
      setActiveFighters(selectRandomFighters());
      lastChangeTime.current = elapsedTime;
      animationTimer.current = elapsedTime;
      setAnimationPhase('idle');
    }

    // Animation cycle every 2 seconds
    const animationCycle = (elapsedTime - animationTimer.current) % 6;
    if (animationCycle < 1.5) {
      setAnimationPhase('idle');
    } else if (animationCycle < 3) {
      setAnimationPhase('attack');
    } else if (animationCycle < 4.5) {
      setAnimationPhase('defend');
    } else {
      setAnimationPhase('victory');
    }

    // Animate fighter silhouettes
    fighterRefs.current.forEach((fighter, index) => {
      if (!fighter) return;
      
      const side = index === 0 ? -1 : 1;
      
      // Base positioning
      fighter.position.x = side * 2.5;
      fighter.position.y = -1.5;
      fighter.position.z = 0;
      
      // Face each other
      fighter.rotation.y = side > 0 ? Math.PI : 0;
      
      // Mouse interaction - slight head turn
      const headTurn = mouse.x * 0.2 * side;
      if (fighter.children[1]) { // Head
        fighter.children[1].rotation.y = headTurn;
      }
      
      // Combat animations
      const baseY = -1.5;
      const bounceOffset = Math.sin(elapsedTime * 2 + index) * 0.05;
      
      switch (animationPhase) {
        case 'idle':
          fighter.position.y = baseY + bounceOffset;
          fighter.rotation.x = 0;
          break;
        case 'attack':
          const attackLean = Math.sin(elapsedTime * 8) * 0.2;
          fighter.position.y = baseY + Math.abs(attackLean) * 0.3;
          fighter.rotation.x = attackLean * side;
          // Arm animation
          if (fighter.children[2] && fighter.children[3]) {
            fighter.children[2].rotation.z = 0.3 + attackLean * 0.5;
            fighter.children[3].rotation.z = -0.3 - attackLean * 0.5;
          }
          break;
        case 'defend':
          fighter.position.y = baseY + bounceOffset * 0.5;
          fighter.rotation.x = -0.1 * side;
          // Defensive stance
          if (fighter.children[2] && fighter.children[3]) {
            fighter.children[2].rotation.z = 0.8;
            fighter.children[3].rotation.z = -0.8;
          }
          break;
        case 'victory':
          const victoryBounce = Math.sin(elapsedTime * 4) * 0.15;
          fighter.position.y = baseY + Math.abs(victoryBounce);
          fighter.rotation.x = victoryBounce * 0.3;
          break;
      }
      
      // Particle effects during combat
      if (animationPhase === 'attack' && fighter.children.length > 5) {
        const colors = getRealmColors(activeFighters[index]?.world || 'dark-arena');
        const sparkIntensity = Math.sin(elapsedTime * 16) * 0.5 + 0.5;
        
        fighter.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissiveIntensity = 0.6 + sparkIntensity * 0.4;
          }
        });
      }
    });
  });

  if (activeFighters.length < 2) return null;

  return (
    <group>
      {activeFighters.map((fighter, index) => {
        const fighterGeometry = createFighterGeometry(fighter.world);
        
        return (
          <primitive
            key={`${fighter.id}-${index}`}
            object={fighterGeometry}
            ref={(el: THREE.Group) => el && (fighterRefs.current[index] = el)}
          />
        );
      })}
      
      {/* Combat impact effects */}
      {animationPhase === 'attack' && (
        <group>
          {/* Energy burst at center */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.3, 16, 12]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffaa00"
              emissiveIntensity={2}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      )}
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
        <FighterSilhouettes mouse={mouse} />
        
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