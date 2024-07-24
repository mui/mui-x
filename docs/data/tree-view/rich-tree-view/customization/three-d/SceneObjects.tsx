import { Vector3 } from '@react-three/fiber';

interface ThreeDBaseItem {
  id: string;
  label: string;
  visibility: boolean;
  position?: Vector3;
}

interface ThreeDCollectionItem extends ThreeDBaseItem {
  type: 'collection';
  children: ThreeDItem[];
}

interface ThreeDLightItem extends ThreeDBaseItem {
  type: 'light';
  color: string;
  intensity: number;
}

interface ThreeDMeshItem extends ThreeDBaseItem {
  type: 'mesh';
  color: string;
  size: [number, number, number, number?];
}

export type ThreeDItem = ThreeDCollectionItem | ThreeDLightItem | ThreeDMeshItem;

export const ALL_SCENE_OBJECTS: ThreeDItem[] = [
  {
    id: 'lights',
    label: 'Scene Lights',
    visibility: true,
    type: 'collection',
    children: [
      {
        id: 'ambientLight',
        label: 'Ambient Light',
        visibility: false,
        type: 'light',
        color: 'white',
        intensity: 1,
      },
      {
        id: 'spotLight',
        label: 'Red Spot Light',
        visibility: true,
        type: 'light',
        color: 'red',
        intensity: 10,
        position: [-2, 1.5, 1],
      },
    ],
  },
  {
    id: 'car',
    label: 'Car',
    visibility: true,
    type: 'collection',
    children: [
      {
        id: 'chassis',
        label: 'Chassis',
        visibility: true,
        type: 'collection',
        children: [
          {
            id: 'chassis-bottom-box',
            label: 'Base Frame',
            visibility: true,
            type: 'mesh',
            size: [2, 0.5, 1],
            position: [0, 0.5, 0],
            color: 'yellow',
          },
          {
            id: 'chassis-top-box',
            label: 'Cabin Frame',
            type: 'mesh',
            visibility: true,
            size: [1, 0.5, 0.8],
            position: [0.25, 1, 0],
            color: 'blue',
          },
        ],
      },
      {
        id: 'wheels',
        label: 'Wheels',
        visibility: true,
        type: 'collection',
        children: [
          {
            id: 'wheel-front-left',
            label: 'Front Left Wheel',
            visibility: true,
            type: 'mesh',
            size: [0.25, 0.25, 0.2, 32],
            position: [-0.5, 0.25, 0.5],
            color: 'purple',
          },
          {
            id: 'wheel-front-right',
            label: 'Front Right Wheel',
            visibility: true,
            type: 'mesh',
            size: [0.25, 0.25, 0.2, 32],
            position: [-0.5, 0.25, -0.5],
            color: 'purple',
          },
          {
            id: 'wheel-back-left',
            label: 'Back Left Wheel',
            visibility: true,
            type: 'mesh',
            size: [0.3, 0.3, 0.2, 32],
            position: [0.5, 0.3, 0.5],
            color: 'purple',
          },
          {
            id: 'wheel-back-right',
            label: 'Back Right Wheel',
            visibility: true,
            type: 'mesh',
            size: [0.3, 0.3, 0.2, 32],
            position: [0.5, 0.3, -0.5],
            color: 'purple',
          },
        ],
      },
    ],
  },
  {
    id: 'street',
    label: 'Street',
    visibility: false,
    type: 'mesh',
    size: [100, 0.01, 3],
    position: [0, 0, 0],
    color: 'darkgray',
  },
];
