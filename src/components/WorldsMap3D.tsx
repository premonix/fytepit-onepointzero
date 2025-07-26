import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder } from '@react-three/drei';
import { worlds } from '@/data/worlds';
import { fighters } from '@/data/fighters';
import { useSound } from '@/hooks/useSound';
import * as THREE from 'three';

interface RealmSphereProps {
  world: typeof worlds[0];
  position: [number, number, number];
  onSelect: (worldId: string) => void;
  selected: boolean;
}

const RealmSphere = ({ world, position, onSelect, selected }: RealmSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { playRealmHover } = useSound();
  
  const fighterCount = fighters.filter(f => f.world === world.id).length;
  
  // Extract HSL values for Three.js color
  const getColorFromHSL = (hslString: string) => {
    const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      const h = parseInt(match[1]) / 360;
      const s = parseInt(match[2]) / 100;
      const l = parseInt(match[3]) / 100;
      return new THREE.Color().setHSL(h, s, l);
    }
    return new THREE.Color(0x666666);
  };

  const primaryColor = getColorFromHSL(world.theme.primary);
  const accentColor = getColorFromHSL(world.theme.accent);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered || selected) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[1, 32, 32]}
        onClick={() => onSelect(world.id)}
        onPointerEnter={() => {
          setHovered(true);
          playRealmHover(world.id);
        }}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={selected ? accentColor : primaryColor}
          metalness={0.7}
          roughness={0.3}
          emissive={selected ? accentColor : primaryColor}
          emissiveIntensity={selected ? 0.3 : 0.1}
        />
      </Sphere>
      
      {/* Floating text label */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        fillOpacity={hovered || selected ? 1 : 0.7}
      >
        {world.name.split(' ')[0]}
      </Text>
      
      {/* Fighter count indicator */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.2}
        color="cyan"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.8}
      >
        {fighterCount} fighters
      </Text>
      
      {/* Orbital rings for visual flair */}
      <group rotation={[Math.PI / 4, 0, 0]}>
        <Cylinder args={[1.5, 1.5, 0.05, 64, 1, true]} position={[0, 0, 0]}>
          <meshBasicMaterial color={primaryColor} transparent opacity={0.3} />
        </Cylinder>
      </group>
      
      <group rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <Cylinder args={[1.8, 1.8, 0.03, 64, 1, true]} position={[0, 0, 0]}>
          <meshBasicMaterial color={accentColor} transparent opacity={0.2} />
        </Cylinder>
      </group>
    </group>
  );
};

const ExpansionNode = ({ position, name, description }: { 
  position: [number, number, number]; 
  name: string; 
  description: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[0.8, 0.8, 0.8]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color="#444444"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </Box>
      
      {hovered && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
        >
          {name}
        </Text>
      )}
    </group>
  );
};

const ConnectionLines = () => {
  const points1 = [
    new THREE.Vector3(-4, 0, -2),
    new THREE.Vector3(0, 2, 0),
  ];
  
  const points2 = [
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(4, 0, -2),
  ];
  
  const points3 = [
    new THREE.Vector3(-4, 0, -2),
    new THREE.Vector3(4, 0, -2),
  ];

  return (
    <group>
      {[points1, points2, points3].map((points, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ffff" transparent opacity={0.3} />
        </line>
      ))}
    </group>
  );
};

interface WorldsMap3DProps {
  selectedRealm: string | null;
  onRealmSelect: (worldId: string) => void;
}

export const WorldsMap3D = ({ selectedRealm, onRealmSelect }: WorldsMap3DProps) => {
  const expansionZones = [
    { name: 'The Shatter Point', description: 'Chaotic realm entry', position: [-6, 3, 2] as [number, number, number] },
    { name: 'The Frostline Rift', description: 'Frozen combat plains', position: [0, -3, 3] as [number, number, number] },
    { name: 'The Echo Span', description: 'Time-looped warriors', position: [-6, 0, 0] as [number, number, number] },
    { name: 'The Ember Arc', description: 'Fire-forged tech realm', position: [6, 3, 2] as [number, number, number] }
  ];

  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-background via-secondary/20 to-background rounded-lg border border-border overflow-hidden">
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#0066ff" />
        <spotLight position={[0, 15, 0]} intensity={0.8} color="#ff6600" castShadow />
        
        {/* Starfield background */}
        <mesh>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial color="#000011" side={THREE.BackSide} />
        </mesh>
        
        {/* Main realms positioned in triangle formation */}
        {worlds.map((world, index) => {
          const positions: [number, number, number][] = [
            [-4, 0, -2], // Brutalis Prime - left
            [0, 2, 0],   // Virelia - top center
            [4, 0, -2]   // Mythrendahl - right
          ];
          
          return (
            <RealmSphere
              key={world.id}
              world={world}
              position={positions[index]}
              onSelect={onRealmSelect}
              selected={selectedRealm === world.id}
            />
          );
        })}
        
        {/* Connection lines between realms */}
        <ConnectionLines />
        
        {/* Expansion zones */}
        {expansionZones.map((zone, index) => (
          <ExpansionNode
            key={index}
            position={zone.position}
            name={zone.name}
            description={zone.description}
          />
        ))}
        
        {/* Central void/nexus */}
        <Sphere args={[0.5, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#000000"
            metalness={1}
            roughness={0}
            emissive="#0044ff"
            emissiveIntensity={0.5}
          />
        </Sphere>
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>
      
      {/* UI overlay instructions */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3">
        <p className="text-xs text-muted-foreground">
          Click and drag to orbit • Scroll to zoom • Click spheres to select realms
        </p>
      </div>
    </div>
  );
};