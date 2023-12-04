import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import earthImage from './earthTex.jpeg';
import { Html } from '@react-three/drei';
import './Globe.css';

const destinations = [
  { name: 'Tokyo', latitude: 35.6895, longitude: 139.6917 }, // Tokyo, Japan
  { name: 'New York', latitude: 40.7128, longitude: -74.006 }, // New York, USA
  { name: 'London', latitude: 51.5074, longitude: -0.1278 }, // London, UK
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522 }, // Paris, France
  { name: 'Beijing', latitude: 39.9042, longitude: 116.4074 }, // Beijing, China
  { name: 'Mumbai', latitude: 19.076, longitude: 72.8777 }, // Mumbai, India
  { name: 'Dhaka', latitude: 23.8103, longitude: 90.4125 }, // Dhaka, Bangladesh
  // Add more destinations with latitude and longitude information
];

const Globe = () => {
  const controlsRef = useRef();
  const [labelsVisible, setLabelsVisible] = useState(true);

  useEffect(() => {
    const controls = controlsRef.current;
    if (controls) {
      controls.addEventListener('change', handleGlobeRotation);
    }
    return () => {
      if (controls) {
        controls.removeEventListener('change', handleGlobeRotation);
      }
    };
  }, []);

  const handleGlobeRotation = () => {
    // When the globe is rotated, hide the labels
    setLabelsVisible(false);
  };

  // Function to convert latitude and longitude to 3D coordinates
  const latLongToVector3 = (lat, lon, radius) => {
    const phi = (lat * Math.PI) / 180;
    const theta = ((lon - 180) * Math.PI) / 180;

    const x = -radius * Math.cos(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(phi) * Math.sin(theta);

    return [x, y, z];
  };

  const toggleLabels = () => {
    setLabelsVisible(!labelsVisible);
  };

  return (
    <div>
      <button className='labelButton' onClick={toggleLabels}>
        {labelsVisible ? 'Hide Labels' : 'Show Labels'}
      </button>
      <Canvas
        style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}
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
                  visibility: labelsVisible ? 'visible' : 'hidden', // Toggle visibility based on state
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
    </div>
  );
};

export default Globe;
