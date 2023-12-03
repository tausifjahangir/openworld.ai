import React, { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Text } from 'troika-three-text';

const TextMesh = ({ text, position, color, fontSize }) => {
  const [font, setFont] = useState(null);

  useEffect(() => {
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('/roboto.json', loadedFont => {
      setFont(loadedFont);
    });
  }, []);

  const config = useMemo(() => {
    if (!font) return null;
    return {
      font: font,
      fontSize: fontSize,
      color: color,
      maxWidth: 300,
      lineHeight: 1,
      letterSpacing: 0,
      textAlign: 'center',
      materialType: 'MeshPhongMaterial'
    };
  }, [font, fontSize, color]);

  if (!config) {
    // Font hasn't loaded yet, render a loading text
    return <div>Loading font...</div>;
  }

  return (
    <Text position={position} {...config}>
      {text}
    </Text>
  );
};

export default TextMesh;
