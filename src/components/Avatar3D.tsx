import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarModelProps {
  isPlaying: boolean;
  isWoman: boolean;
  speed: number;
}

function AvatarModel({ isPlaying, isWoman, speed }: AvatarModelProps) {
  const leftShoulderRef = useRef<THREE.Group>(null);
  const leftElbowRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const rightElbowRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  const skinColor = "#fcd5b8";
  const shirtColor = isWoman ? "#ec4899" : "#3b82f6";
  const hairColor = isWoman ? "#451a03" : "#1e293b";

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * speed;
    
    if (isPlaying) {
      if (leftShoulderRef.current && rightShoulderRef.current && headRef.current && leftElbowRef.current && rightElbowRef.current) {
        // Shoulders
        leftShoulderRef.current.rotation.x = Math.sin(time * 3) * 0.4 - 0.2;
        leftShoulderRef.current.rotation.z = Math.cos(time * 2.5) * 0.3 + 0.3;
        
        rightShoulderRef.current.rotation.x = Math.cos(time * 2.8) * 0.4 - 0.2;
        rightShoulderRef.current.rotation.z = -Math.sin(time * 3.2) * 0.3 - 0.3;
        
        // Elbows (bending them upwards)
        leftElbowRef.current.rotation.x = -Math.abs(Math.sin(time * 4)) * 1.5 - 0.5;
        rightElbowRef.current.rotation.x = -Math.abs(Math.cos(time * 3.5)) * 1.5 - 0.5;
        
        // Head subtle movement
        headRef.current.rotation.y = Math.sin(time * 1.5) * 0.1;
        headRef.current.rotation.z = Math.sin(time * 2) * 0.05;
      }
    } else {
      // Idle animation (hands down, subtle breathing)
      if (leftShoulderRef.current && rightShoulderRef.current && headRef.current && leftElbowRef.current && rightElbowRef.current) {
        leftShoulderRef.current.rotation.x = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.x, 0, 0.1);
        leftShoulderRef.current.rotation.z = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.z, 0.1, 0.1);
        rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, 0, 0.1);
        rightShoulderRef.current.rotation.z = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.z, -0.1, 0.1);
        
        leftElbowRef.current.rotation.x = THREE.MathUtils.lerp(leftElbowRef.current.rotation.x, -0.1, 0.1);
        rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, -0.1, 0.1);

        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0, 0.1);
        headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, Math.sin(time) * 0.02, 0.1);
      }
    }
  });

  return (
    <group position={[0, -1.2, 0]}>
      {/* Torso */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.9, 1.2, 0.5]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      
      {/* Head Group */}
      <group ref={headRef} position={[0, 1.8, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.3]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        
        {/* Face */}
        <mesh position={[0, 0.2, 0.05]}>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.12, 0.3, 0.32]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.12, 0.3, 0.32]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        
        {/* Smiling Mouth */}
        <mesh position={[0, 0.1, 0.32]}>
          <boxGeometry args={[0.15, 0.02, 0.02]} />
          <meshStandardMaterial color="#9f1239" />
        </mesh>
        
        {/* Hair Base */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.55, 0.15, 0.55]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
        
        {/* Hair additions for Woman */}
        {isWoman && (
          <mesh position={[0, 0.2, -0.2]}>
            <boxGeometry args={[0.6, 0.8, 0.3]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        )}
      </group>

      {/* Left Arm */}
      <group ref={leftShoulderRef} position={[-0.55, 1.5, 0]}>
        <mesh position={[-0.1, -0.25, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.6]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        <group ref={leftElbowRef} position={[-0.1, -0.55, 0]}>
          <mesh position={[0, -0.25, 0]}>
             <cylinderGeometry args={[0.09, 0.08, 0.5]} />
             <meshStandardMaterial color={skinColor} />
          </mesh>
          <mesh position={[0, -0.55, 0]}>
            <boxGeometry args={[0.15, 0.25, 0.1]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </group>
      </group>

      {/* Right Arm */}
      <group ref={rightShoulderRef} position={[0.55, 1.5, 0]}>
        <mesh position={[0.1, -0.25, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.6]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        <group ref={rightElbowRef} position={[0.1, -0.55, 0]}>
          <mesh position={[0, -0.25, 0]}>
             <cylinderGeometry args={[0.09, 0.08, 0.5]} />
             <meshStandardMaterial color={skinColor} />
          </mesh>
          <mesh position={[0, -0.55, 0]}>
            <boxGeometry args={[0.15, 0.25, 0.1]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </group>
      </group>
      
      {/* Legs */}
      <mesh position={[-0.22, 0.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.22, 0.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}

export function Avatar3D({ isPlaying, isWoman, speed }: AvatarModelProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 1.6, 3.5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 2]} intensity={1.5} />
        <Environment preset="city" />
        <AvatarModel isPlaying={isPlaying} isWoman={isWoman} speed={speed} />
      </Canvas>
    </div>
  );
}
