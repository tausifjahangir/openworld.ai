import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import earthImage from './earthTex.jpeg';
import { Html } from '@react-three/drei';


const destinations = [
  { name: 'New York', latitude: 40.7128, longitude: -74.006 },
  { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  // Add more destinations with latitude and longitude information
  // ...
];

const Globe = () => {
  const controlsRef = useRef();

  // Function to convert latitude and longitude to 3D coordinates
  const latLongToVector3 = (lat, lon, radius) => {
    const phi = (lat * Math.PI) / 180;
    const theta = ((lon - 180) * Math.PI) / 180;

    const x = -radius * Math.cos(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(phi) * Math.sin(theta);

    return [x, y, z];
  };

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      camera={{ position: [0, 0, 3] }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Globe */}
      <Sphere args={[1.7, 64, 64]}>
        <meshStandardMaterial
          attach="material"
          map={new THREE.TextureLoader().load(earthImage)}
        />
      </Sphere>

      {/* Markers for destinations */}
      {destinations.map((destination, index) => {
        const [x, y, z] = latLongToVector3(
          destination.latitude,
          destination.longitude,
          1.7
        );
        return (
          <group key={index} position={[x, y, z]}>
            {/* Shiny sphere */}
            <mesh>
              <sphereGeometry args={[0.01, 32, 32]} />
              <meshStandardMaterial
                color="gold"
                emissive="#FFDD43"
                emissiveIntensity={3} // Increase the intensity for a stronger glow
                metalness={1} // Set metalness for shininess
                roughness={0.1} // Adjust roughness for reflection
                
              />
            </mesh>
            {/* HTML label */}
            <Html
              position={[0, 0.1, 0]}
              center
              distanceFactor={10}
              style={{
                color: 'white',
                fontSize: 3, // Adjust the font size here
                pointerEvents: 'none',
              }}
            >
              <div>{destination.name}</div>
            </Html>
          </group>
        );
      })}

      {/* OrbitControls */}
      <OrbitControls ref={controlsRef} />
    </Canvas>
  );
};

export default Globe;
