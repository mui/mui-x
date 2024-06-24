/* eslint-disable react/no-unknown-property */
import * as React from 'react';
import { Canvas } from '@react-three/fiber';
import {
  PerspectiveCamera,
  OrbitControls,
  Box,
  Cylinder,
  Grid,
} from '@react-three/drei';
import { ThreeDItem } from './SceneObjects';

const renderThreeDItem = (item: ThreeDItem): React.ReactNode => {
  switch (item.type) {
    case 'collection': {
      if (!item.visibility) {
        return null;
      }

      return item.children.map(renderThreeDItem);
    }

    case 'light': {
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
    }

    case 'mesh': {
      if (item.id.toLowerCase().includes('wheel')) {
        return (
          <Cylinder
            args={item.size}
            position={item.position}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            key={item.id}
            visible={item.visibility}
          >
            <meshStandardMaterial color={item.color} />
          </Cylinder>
        );
      }

      return (
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

    default: {
      return null;
    }
  }
};

export function Scene(props: { items: ThreeDItem[] }) {
  const { items } = props;

  return (
    <Canvas style={{ height: '300px', backgroundColor: 'gray' }}>
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
      {items.map(renderThreeDItem)}
    </Canvas>
  );
}
