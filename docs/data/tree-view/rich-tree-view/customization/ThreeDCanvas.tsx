import * as React from 'react';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { CustomTreeItem } from './three-d/CustomTreeItem';
import { Scene } from './three-d/Scene';
import { ALL_SCENE_OBJECTS, ThreeDItem } from './three-d/SceneObjects';

const DEFAULT_EXPANDED_ITEMS = ['lights', 'chassi', 'wheels', 'car'];

export default function ThreeDCanvas() {
  const [sceneObjects, setSceneObjects] = React.useState(ALL_SCENE_OBJECTS);

  const toggleVisibility = (itemId: string) => {
    const toggleItemVisibility = (item: ThreeDItem): ThreeDItem => {
      if (item.id === itemId) {
        return { ...item, visibility: !item.visibility };
      }

      if (item.type === 'collection') {
        return {
          ...item,
          children: item.children.map(toggleItemVisibility),
        };
      }

      return item;
    };

    setSceneObjects((prevState) => prevState.map(toggleItemVisibility));
  };
  return (
    <Stack spacing={2} sx={{ flexGrow: 1, position: 'relative' }}>
      <RichTreeView
        items={sceneObjects}
        defaultExpandedItems={DEFAULT_EXPANDED_ITEMS}
        slots={{ item: CustomTreeItem as any }}
        slotProps={{
          item: { toggleVisibility } as any,
        }}
      />
      <Scene items={sceneObjects} />
    </Stack>
  );
}
