import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  PerspectiveCamera,
  OrbitControls,
  Box,
  Cylinder,
  Grid,
} from '@react-three/drei';
import { ThreeDItem } from './SceneObjects';

const renderSceneObjects = (objects: ThreeDItem[]) => {
  return objects.map((item) => {
    if (
      (item.type === 'collection' || (item.children && item.children.length > 0)) &&
      item.visibility
    ) {
      return renderSceneObjects(item.children);
    }

    switch (item.type) {
      case 'light':
        return item.id.toLowerCase().includes('spot') ? (
          <spotLight
            visible={item.visibility}
            key={item.id}
            position={item.position}
            intensity={item.intensity}
            color={item.color}
          />
        ) : (
          <ambientLight
            visible={item.visibility}
            key={item.id}
            color={item.color}
            intensity={item.intensity}
          />
        );
      case 'mesh':
        return item.id.toLowerCase().includes('wheel') ? (
          <Cylinder
            args={item.size}
            position={item.position}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            key={item.id}
            visible={item.visibility}
          >
            <meshStandardMaterial color={item.color} />
          </Cylinder>
        ) : (
          <Box
            args={item.size}
            position={item.position}
            visible={item.visibility}
            key={item.id}
          >
            <meshStandardMaterial color={item.color} />
          </Box>
        );
    }
    return null;
  });
};

export default function Scene(props: { objects: ThreeDItem[] }) {
  const { objects } = props;

  return (
    <Canvas style={{ width: '50vw', height: '80vh', backgroundColor: 'gray' }}>
      <PerspectiveCamera makeDefault position={[-3, 2, 3]} fov={60} />
      <Grid
        rotation={[0, 0, 0]}
        position={[0, 0, 0]}
        cellSize={1}
        sectionSize={1}
        sectionColor={'#e0dede'}
        args={[100, 100]}
      />
      <OrbitControls />
      {renderSceneObjects(objects)}
    </Canvas>
  );
}
