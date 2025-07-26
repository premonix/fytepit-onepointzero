import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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
      const targetScale = (hovered || selected) ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={() => onSelect(world.id)}
        onPointerEnter={() => {
          setHovered(true);
          playRealmHover(world.id);
        }}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={selected ? accentColor : primaryColor}
          metalness={0.7}
          roughness={0.3}
          emissive={selected ? accentColor : primaryColor}
          emissiveIntensity={selected ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Simple ring indicator */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.05, 8, 32]} />
        <meshBasicMaterial 
          color={primaryColor} 
          transparent 
          opacity={0.3} 
        />
      </mesh>
    </group>
  );
};

const ExpansionNode = ({ position, name }: { 
  position: [number, number, number]; 
  name: string; 
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
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#444444"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

interface WorldsMap3DProps {
  selectedRealm: string | null;
  onRealmSelect: (worldId: string) => void;
}

export const WorldsMap3D = ({ selectedRealm, onRealmSelect }: WorldsMap3DProps) => {
  const expansionZones = [
    { name: 'The Shatter Point', position: [-6, 3, 2] as [number, number, number] },
    { name: 'The Frostline Rift', position: [0, -3, 3] as [number, number, number] },
    { name: 'The Echo Span', position: [-6, 0, 0] as [number, number, number] },
    { name: 'The Ember Arc', position: [6, 3, 2] as [number, number, number] }
  ];

  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-background via-secondary/20 to-background rounded-lg border border-border overflow-hidden">
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#0066ff" />
        
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
        
        {/* Expansion zones */}
        {expansionZones.map((zone, index) => (
          <ExpansionNode
            key={index}
            position={zone.position}
            name={zone.name}
          />
        ))}
        
        {/* Central void/nexus */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial
            color="#000000"
            metalness={1}
            roughness={0}
            emissive="#0044ff"
            emissiveIntensity={0.5}
          />
        </mesh>
        
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
      
      {/* Realm labels overlay */}
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 space-y-2">
        {worlds.map((world, index) => {
          const fighterCount = fighters.filter(f => f.world === world.id).length;
          return (
            <div 
              key={world.id} 
              className={`text-xs cursor-pointer hover:text-primary transition-colors ${
                selectedRealm === world.id ? 'text-primary font-semibold' : 'text-muted-foreground'
              }`}
              onClick={() => onRealmSelect(world.id)}
            >
              {world.name.split(' ')[0]} ({fighterCount} fighters)
            </div>
          );
        })}
      </div>
    </div>
  );
};