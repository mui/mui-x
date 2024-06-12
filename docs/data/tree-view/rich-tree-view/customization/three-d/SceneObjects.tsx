import { TreeViewBaseItem } from '@mui/x-tree-view/models';

export interface ThreeDItem extends TreeViewBaseItem {
  type: 'mesh' | 'light' | 'collection';
  visibility?: boolean;
  size?: number[];
  position?: number[];
  color?: string;
  intensity?: number;
  children?: ThreeDItem[];
}

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
            children: [],
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
            children: [],
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
            children: [],
            size: [0.25, 0.25, 0.2, 32],
            position: [-0.5, 0.25, 0.5],
            color: 'purple',
          },
          {
            id: 'wheel-front-right',
            label: 'Front Right Wheel',
            visibility: true,
            type: 'mesh',
            children: [],
            size: [0.25, 0.25, 0.2, 32],
            position: [-0.5, 0.25, -0.5],
            color: 'purple',
          },
          {
            id: 'wheel-back-left',
            label: 'Back Left Wheel',
            visibility: true,
            type: 'mesh',
            children: [],
            size: [0.3, 0.3, 0.2, 32],
            position: [0.5, 0.3, 0.5],
            color: 'purple',
          },
          {
            id: 'wheel-back-right',
            label: 'Back Right Wheel',
            visibility: true,
            type: 'mesh',
            children: [],
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
    children: [],
    size: [100, 0.01, 3],
    position: [0, 0, 0],
    color: 'darkgray',
  },
];
