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
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};

// Connection points based on the reference image
const ConnectionPoint = ({ position, name, color }: {
  position: [number, number, number];
  name: string;
  color: string;
}) => {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
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
  // Connection points from the reference image
  const connectionPoints = [
    { name: 'Synapse Spire', position: [0, 2.5, 0] as [number, number, number], color: '#00ffff' },
    { name: 'Tron Pulse', position: [-2, 1, -1] as [number, number, number], color: '#0099ff' },
    { name: 'Corepit', position: [-4, -0.5, -2] as [number, number, number], color: '#ff4400' },
    { name: 'Sigil Stride', position: [2, 1, -1] as [number, number, number], color: '#44ff00' },
    { name: 'Hecc Bridge', position: [0, 0, -2] as [number, number, number], color: '#ffff00' },
    { name: 'Scrac Ravlt', position: [4, -0.5, -2] as [number, number, number], color: '#00ff88' }
  ];

  const expansionZones = [
    { name: 'Shatter Point', position: [-6, 3, 2] as [number, number, number] },
    { name: 'Frostline Rift', position: [6, -3, 3] as [number, number, number] },
    { name: 'Echo Span', position: [-6, -1, 0] as [number, number, number] },
    { name: 'Ember Arc', position: [6, 3, 2] as [number, number, number] }
  ];

  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-border overflow-hidden relative">
      <Canvas camera={{ position: [0, 8, 12], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#0066ff" />
        <pointLight position={[0, 15, 0]} intensity={0.6} color="#00ffaa" />
        
        {/* Dark space background */}
        <mesh>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial color="#050510" side={THREE.BackSide} />
        </mesh>
        
        {/* Main realms positioned like in reference image */}
        {worlds.map((world, index) => {
          const positions: [number, number, number][] = [
            [-4, 0, -2], // Brutalis Prime - lower left
            [0, 3, 0],   // Virelia Constll - top center
            [4, 0, -2]   // Mythrendahl - lower right
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
        
        {/* Connection points */}
        {connectionPoints.map((point, index) => (
          <ConnectionPoint
            key={index}
            position={point.position}
            name={point.name}
            color={point.color}
          />
        ))}
        
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
        <div className="text-xs font-semibold text-primary mb-2">THE WORLDS OF FYTEPIT</div>
        {worlds.map((world, index) => {
          const fighterCount = fighters.filter(f => f.world === world.id).length;
          const realmNames = ['BRUTALIS PRIME', 'VIRELIA CONSTLL', 'MYTHRENDAHL'];
          return (
            <div 
              key={world.id} 
              className={`text-xs cursor-pointer hover:text-primary transition-colors ${
                selectedRealm === world.id ? 'text-primary font-semibold' : 'text-muted-foreground'
              }`}
              onClick={() => onRealmSelect(world.id)}
            >
              {realmNames[index]} ({fighterCount} fighters)
            </div>
          );
        })}
      </div>
      
      {/* Connection points overlay */}
      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 space-y-1">
        <div className="text-xs font-semibold text-accent mb-2">Connection Points</div>
        {connectionPoints.map((point, index) => (
          <div key={index} className="text-xs text-muted-foreground flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: point.color }}
            />
            {point.name}
          </div>
        ))}
      </div>
      
      {/* Expansion zones overlay */}
      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 space-y-1">
        <div className="text-xs font-semibold text-muted-foreground mb-2">Expansion Anchors</div>
        {expansionZones.map((zone, index) => (
          <div key={index} className="text-xs text-muted-foreground">
            {zone.name}
          </div>
        ))}
      </div>
    </div>
  );
};