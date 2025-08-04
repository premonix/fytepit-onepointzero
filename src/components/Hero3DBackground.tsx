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

  // Create fighter-specific geometry based on characteristics
  const createFighterGeometry = (fighter: Fighter) => {
    const group = new THREE.Group();
    const colors = getRealmColors(fighter.world);
    
    // Base material
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: colors.primary,
      emissive: colors.emissive,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8,
    });

    // Fighter-specific characteristics
    switch (fighter.name) {
      case 'Nullbyte':
        return createDigitalGlitchFighter(group, baseMaterial, colors);
      case 'Gorehound':
        return createChainsawFighter(group, baseMaterial, colors);
      case 'TremorJack':
        return createHeavyMechFighter(group, baseMaterial, colors);
      case 'Blayze Coil':
        return createFlameWhipFighter(group, baseMaterial, colors);
      case 'Vanta Maw':
        return createGravityFighter(group, baseMaterial, colors);
      case 'Redline 09':
        return createSpeedsterFighter(group, baseMaterial, colors);
      case 'Axiom V3':
        return createPerfectionFighter(group, baseMaterial, colors);
      case 'NOVA Shard':
        return createSolarFighter(group, baseMaterial, colors);
      case 'Velora':
        return createDancerFighter(group, baseMaterial, colors);
      case 'PulseSync':
        return createTwinFighter(group, baseMaterial, colors);
      case 'Thornhelm':
        return createNatureFighter(group, baseMaterial, colors);
      case 'Caerith the Cursed':
        return createCursedFighter(group, baseMaterial, colors);
      case 'The Dread Relic':
        return createMassiveFighter(group, baseMaterial, colors);
      case 'Sigmaris':
        return createDivineFighter(group, baseMaterial, colors);
      case 'GloboMaximus':
        return createEgoFighter(group, baseMaterial, colors);
      case 'Kremlord':
        return createTankFighter(group, baseMaterial, colors);
      default:
        return createGenericFighter(group, baseMaterial, colors, fighter);
    }
  };

  // Specific fighter creation functions
  const createDigitalGlitchFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Angular, fragmented geometry for digital AI
    const torsoGeometry = new THREE.BoxGeometry(0.8, 1.4, 0.4);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.7;
    group.add(torso);

    // Cubic head with digital artifacts
    const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.6;
    head.rotation.y = 0.2;
    group.add(head);

    // Fragmented arms
    for (let i = 0; i < 3; i++) {
      const armPiece = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.2), material);
      armPiece.position.set(-0.7, 1 - i * 0.3, 0);
      armPiece.rotation.z = 0.3 + i * 0.2;
      group.add(armPiece);
    }

    // Add glitch effect cubes
    for (let i = 0; i < 5; i++) {
      const glitch = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), material.clone());
      glitch.material.emissiveIntensity = 1.2;
      glitch.position.set(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 0.5
      );
      group.add(glitch);
    }

    return group;
  };

  const createChainsawFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Bulky torso
    const torsoGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 8, 16);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.8;
    group.add(torso);

    // Intimidating head
    const headGeometry = new THREE.SphereGeometry(0.35, 16, 12);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.8;
    group.add(head);

    // Chainsaw arms - cylinders with teeth
    const chainsawMaterial = material.clone();
    chainsawMaterial.color.setHex(0x888888);
    chainsawMaterial.emissive.setHex(0x444444);

    const leftChainsaw = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1.2), chainsawMaterial);
    leftChainsaw.position.set(-0.8, 0.8, 0);
    leftChainsaw.rotation.z = 1.2;
    group.add(leftChainsaw);

    const rightChainsaw = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1.2), chainsawMaterial);
    rightChainsaw.position.set(0.8, 0.8, 0);
    rightChainsaw.rotation.z = -1.2;
    group.add(rightChainsaw);

    // Add teeth details
    for (let i = 0; i < 8; i++) {
      const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 4), chainsawMaterial);
      tooth.position.set(-0.8 + Math.cos(i) * 0.25, 0.8 + Math.sin(i) * 0.25, 0);
      group.add(tooth);
    }

    return group;
  };

  const createHeavyMechFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Massive, industrial build
    const torsoGeometry = new THREE.BoxGeometry(1.2, 1.8, 0.8);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.9;
    group.add(torso);

    // Boxy mech head
    const headGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.6);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 2;
    group.add(head);

    // Drill arms
    const drillMaterial = material.clone();
    drillMaterial.color.setHex(0x666666);
    
    const leftDrill = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.5, 8), drillMaterial);
    leftDrill.position.set(-0.9, 1, 0);
    leftDrill.rotation.z = Math.PI / 2;
    group.add(leftDrill);

    const rightDrill = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.5, 8), drillMaterial);
    rightDrill.position.set(0.9, 1, 0);
    rightDrill.rotation.z = -Math.PI / 2;
    group.add(rightDrill);

    // Thick legs
    const legGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.2);
    const leftLeg = new THREE.Mesh(legGeometry, material);
    leftLeg.position.set(-0.4, -0.6, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, material);
    rightLeg.position.set(0.4, -0.6, 0);
    group.add(rightLeg);

    return group;
  };

  const createSpeedsterFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Sleek, aerodynamic build
    const torsoGeometry = new THREE.CapsuleGeometry(0.3, 1.1, 8, 16);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.5;
    torso.scale.set(1, 1, 0.7); // Streamlined
    group.add(torso);

    // Aerodynamic head
    const headGeometry = new THREE.ConeGeometry(0.25, 0.5, 8);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.3;
    head.rotation.x = Math.PI;
    group.add(head);

    // Thin, fast arms
    const armGeometry = new THREE.CapsuleGeometry(0.1, 0.7, 6, 12);
    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(-0.4, 0.7, 0);
    leftArm.rotation.z = 0.5;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(0.4, 0.7, 0);
    rightArm.rotation.z = -0.5;
    group.add(rightArm);

    // Speed trail effects
    for (let i = 0; i < 3; i++) {
      const trail = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.5), material.clone());
      trail.material.transparent = true;
      trail.material.opacity = 0.3 - i * 0.1;
      trail.position.set(0, 0.5, -0.5 - i * 0.3);
      group.add(trail);
    }

    return group;
  };

  const createDancerFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Graceful, flowing form
    const torsoGeometry = new THREE.CapsuleGeometry(0.35, 1.2, 12, 20);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.6;
    group.add(torso);

    // Elegant head
    const headGeometry = new THREE.SphereGeometry(0.28, 20, 16);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.5;
    group.add(head);

    // Flowing arms in dance pose
    const armGeometry = new THREE.CapsuleGeometry(0.12, 0.8, 8, 16);
    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(-0.6, 1, 0);
    leftArm.rotation.z = 0.8;
    leftArm.rotation.y = 0.3;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(0.6, 1.2, 0);
    rightArm.rotation.z = -0.5;
    rightArm.rotation.y = -0.3;
    group.add(rightArm);

    // Holographic blade effects
    const bladeGeometry = new THREE.PlaneGeometry(0.1, 1.2);
    const bladeMaterial = material.clone();
    bladeMaterial.transparent = true;
    bladeMaterial.opacity = 0.6;
    bladeMaterial.emissiveIntensity = 1;

    const blade1 = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade1.position.set(-0.9, 1.3, 0);
    blade1.rotation.z = 0.8;
    group.add(blade1);

    const blade2 = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade2.position.set(0.9, 1.5, 0);
    blade2.rotation.z = -0.5;
    group.add(blade2);

    return group;
  };

  const createMassiveFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Enormous, imposing presence
    const torsoGeometry = new THREE.BoxGeometry(1.5, 2.2, 1);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 1.1;
    group.add(torso);

    // Massive helmet
    const headGeometry = new THREE.CylinderGeometry(0.6, 0.7, 0.8, 8);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 2.6;
    group.add(head);

    // Thick armored arms
    const armGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.4);
    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(-1, 1.3, 0);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(1, 1.3, 0);
    group.add(rightArm);

    // Massive legs
    const legGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.5);
    const leftLeg = new THREE.Mesh(legGeometry, material);
    leftLeg.position.set(-0.5, -0.75, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, material);
    rightLeg.position.set(0.5, -0.75, 0);
    group.add(rightLeg);

    // Scale up the entire fighter
    group.scale.setScalar(1.3);

    return group;
  };

  const createGenericFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any, fighter: Fighter) => {
    // Adjust proportions based on stats
    const attackScale = fighter.stats.attack / 100;
    const defenseScale = fighter.stats.defense / 100;
    const speedScale = fighter.stats.speed / 100;

    // Torso size based on defense
    const torsoGeometry = new THREE.CapsuleGeometry(0.3 + defenseScale * 0.2, 1 + defenseScale * 0.3, 8, 16);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.6;
    group.add(torso);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25 + defenseScale * 0.1, 16, 12);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.4 + defenseScale * 0.2;
    group.add(head);

    // Arms - size based on attack
    const armGeometry = new THREE.CapsuleGeometry(0.1 + attackScale * 0.1, 0.7 + attackScale * 0.2, 6, 12);
    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(-0.5 - defenseScale * 0.1, 0.8, 0);
    leftArm.rotation.z = 0.3;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(0.5 + defenseScale * 0.1, 0.8, 0);
    rightArm.rotation.z = -0.3;
    group.add(rightArm);

    // Legs - proportional to speed
    const legGeometry = new THREE.CapsuleGeometry(0.15 + speedScale * 0.05, 0.8 + speedScale * 0.2, 6, 12);
    const leftLeg = new THREE.Mesh(legGeometry, material);
    leftLeg.position.set(-0.2, -0.4, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, material);
    rightLeg.position.set(0.2, -0.4, 0);
    group.add(rightLeg);

    return group;
  };

  // Additional fighter-specific functions
  const createFlameWhipFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Agile fighter with flame effects
    const torsoGeometry = new THREE.CapsuleGeometry(0.4, 1.3, 8, 16);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.7;
    group.add(torso);

    // Flame-styled head
    const headGeometry = new THREE.SphereGeometry(0.32, 16, 12);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.6;
    group.add(head);

    // Whip arms with flame trails
    const whipMaterial = material.clone();
    whipMaterial.color.setHex(0xff6600);
    whipMaterial.emissiveIntensity = 0.9;

    for (let i = 0; i < 4; i++) {
      const whipSegment = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.3), whipMaterial);
      whipSegment.position.set(-0.6, 1 - i * 0.2, 0);
      whipSegment.rotation.z = 0.4 + i * 0.1;
      group.add(whipSegment);
    }

    return group;
  };

  const createGravityFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Dark, imposing presence with gravity effects
    const torsoGeometry = new THREE.SphereGeometry(0.6, 16, 12);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.8;
    torso.scale.set(1, 1.5, 1);
    group.add(torso);

    // Void-like head
    const headGeometry = new THREE.SphereGeometry(0.4, 16, 12);
    const headMaterial = material.clone();
    headMaterial.color.setHex(0x000000);
    headMaterial.emissiveIntensity = 1.2;
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.8;
    group.add(head);

    // Gravity orbs around the fighter
    for (let i = 0; i < 6; i++) {
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), material.clone());
      orb.material.emissiveIntensity = 1;
      const angle = (i / 6) * Math.PI * 2;
      orb.position.set(Math.cos(angle) * 1.2, 1 + Math.sin(angle) * 0.5, Math.sin(angle) * 1.2);
      group.add(orb);
    }

    return group;
  };

  const createPerfectionFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Sleek, geometric perfection
    const torsoGeometry = new THREE.BoxGeometry(0.7, 1.4, 0.35);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.7;
    group.add(torso);

    // Perfect geometric head
    const headGeometry = new THREE.OctahedronGeometry(0.35);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.6;
    group.add(head);

    // Precise geometric arms
    const armGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15);
    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(-0.55, 0.8, 0);
    leftArm.rotation.z = 0.2;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(0.55, 0.8, 0);
    rightArm.rotation.z = -0.2;
    group.add(rightArm);

    return group;
  };

  const createSolarFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Solar-powered energy fighter
    const torsoGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 12, 20);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.6;
    group.add(torso);

    // Solar crown head
    const headGeometry = new THREE.ConeGeometry(0.35, 0.7, 12);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.8;
    group.add(head);

    // Solar energy rays
    for (let i = 0; i < 8; i++) {
      const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), material.clone());
      ray.material.emissiveIntensity = 1.5;
      const angle = (i / 8) * Math.PI * 2;
      ray.position.set(Math.cos(angle) * 0.6, 1.8, Math.sin(angle) * 0.6);
      ray.rotation.z = angle;
      group.add(ray);
    }

    return group;
  };

  const createTwinFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Twin synchronized fighters
    for (let twin = 0; twin < 2; twin++) {
      const offset = twin === 0 ? -0.3 : 0.3;
      
      const twinTorso = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 1, 8, 16), material);
      twinTorso.position.set(offset, 0.5, 0);
      group.add(twinTorso);

      const twinHead = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), material);
      twinHead.position.set(offset, 1.3, 0);
      group.add(twinHead);

      // Connection between twins
      const connection = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), material.clone());
      connection.material.emissiveIntensity = 1.2;
      connection.position.set(0, 0.8, 0);
      connection.rotation.z = Math.PI / 2;
      if (twin === 0) group.add(connection);
    }

    return group;
  };

  const createNatureFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Nature-tech hybrid
    const torsoGeometry = new THREE.CapsuleGeometry(0.45, 1.4, 12, 20);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.7;
    group.add(torso);

    // Crown-like head
    const headGeometry = new THREE.ConeGeometry(0.4, 0.8, 8);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.8;
    group.add(head);

    // Vine-like extensions
    for (let i = 0; i < 6; i++) {
      const vine = new THREE.Mesh(new THREE.TorusGeometry(0.3 + i * 0.1, 0.05, 8, 16), material.clone());
      vine.material.color.setHex(0x44aa44);
      vine.position.y = 0.8;
      vine.rotation.x = Math.PI / 2;
      vine.rotation.z = (i / 6) * Math.PI * 2;
      group.add(vine);
    }

    return group;
  };

  const createCursedFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Cursed, corrupted form
    const torsoGeometry = new THREE.CapsuleGeometry(0.42, 1.3, 8, 16);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.65;
    torso.rotation.z = 0.1; // Slight tilt
    group.add(torso);

    // Corrupted head
    const headGeometry = new THREE.SphereGeometry(0.35, 16, 12);
    const headMaterial = material.clone();
    headMaterial.color.setHex(0x660033);
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.6;
    head.scale.set(1.2, 0.8, 1); // Distorted
    group.add(head);

    // Corruption particles
    for (let i = 0; i < 8; i++) {
      const particle = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), material.clone());
      particle.material.color.setHex(0x440022);
      particle.material.emissiveIntensity = 1.5;
      particle.position.set(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 0.8
      );
      group.add(particle);
    }

    return group;
  };

  const createDivineFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Divine, godlike presence
    const torsoGeometry = new THREE.CapsuleGeometry(0.5, 1.6, 16, 24);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.8;
    group.add(torso);

    // Divine halo head
    const headGeometry = new THREE.SphereGeometry(0.38, 20, 16);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.9;
    group.add(head);

    // Divine halo
    const haloGeometry = new THREE.TorusGeometry(0.6, 0.05, 16, 32);
    const haloMaterial = material.clone();
    haloMaterial.emissiveIntensity = 2;
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.y = 2.3;
    halo.rotation.x = Math.PI / 2;
    group.add(halo);

    // Divine wings
    for (let wing = 0; wing < 2; wing++) {
      const wingGeometry = new THREE.PlaneGeometry(0.8, 1.5);
      const wingMaterial = material.clone();
      wingMaterial.transparent = true;
      wingMaterial.opacity = 0.7;
      const wingMesh = new THREE.Mesh(wingGeometry, wingMaterial);
      wingMesh.position.set(wing === 0 ? -0.8 : 0.8, 1.2, 0);
      wingMesh.rotation.y = wing === 0 ? 0.3 : -0.3;
      group.add(wingMesh);
    }

    return group;
  };

  const createEgoFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Larger-than-life, ego-driven fighter
    const torsoGeometry = new THREE.CapsuleGeometry(0.55, 1.5, 8, 16);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.75;
    group.add(torso);

    // Oversized head
    const headGeometry = new THREE.SphereGeometry(0.45, 16, 12);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.8;
    group.add(head);

    // Dramatic cape
    const capeGeometry = new THREE.PlaneGeometry(1.5, 2);
    const capeMaterial = material.clone();
    capeMaterial.transparent = true;
    capeMaterial.opacity = 0.8;
    const cape = new THREE.Mesh(capeGeometry, capeMaterial);
    cape.position.set(0, 0.8, -0.3);
    group.add(cape);

    // Ego aura
    const auraGeometry = new THREE.RingGeometry(1, 1.5, 16);
    const auraMaterial = material.clone();
    auraMaterial.transparent = true;
    auraMaterial.opacity = 0.3;
    auraMaterial.emissiveIntensity = 1.5;
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    aura.position.y = 0.8;
    aura.rotation.x = Math.PI / 2;
    group.add(aura);

    return group;
  };

  const createTankFighter = (group: THREE.Group, material: THREE.MeshStandardMaterial, colors: any) => {
    // Heavily armored, defensive tank
    const torsoGeometry = new THREE.BoxGeometry(1, 1.6, 0.8);
    const torso = new THREE.Mesh(torsoGeometry, material);
    torso.position.y = 0.8;
    group.add(torso);

    // Fortified head
    const headGeometry = new THREE.BoxGeometry(0.6, 0.5, 0.6);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.8;
    group.add(head);

    // Heavy shoulder armor
    for (let shoulder = 0; shoulder < 2; shoulder++) {
      const armorGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.4);
      const armor = new THREE.Mesh(armorGeometry, material);
      armor.position.set(shoulder === 0 ? -0.7 : 0.7, 1.2, 0);
      group.add(armor);
    }

    // Thick legs
    const legGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.4);
    const leftLeg = new THREE.Mesh(legGeometry, material);
    leftLeg.position.set(-0.3, -0.6, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, material);
    rightLeg.position.set(0.3, -0.6, 0);
    group.add(rightLeg);

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
        const fighterGeometry = createFighterGeometry(fighter);
        
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