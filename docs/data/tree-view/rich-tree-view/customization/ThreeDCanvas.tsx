import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import CustomTreeItem from './three-d/CustomTreeItem';
import Scene from './three-d/Scene';
import { ALL_SCENE_OBJECTS } from './three-d/SceneObjects';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5ecaff',
    },
    background: {
      default: '#f5f5f5', // Replace with your desired background color
    },
  },
});

const DEFAULT_EXPANDED_ITEMS = ['lights', 'chassi', 'wheels', 'car'];

export default function ThreeDCanvas() {
  const [sceneObjects, setSceneObjects] = React.useState(ALL_SCENE_OBJECTS);

  const toggleVisibility = (itemId: string, items = sceneObjects) => {
    items.forEach((item) => {
      if (item.id === itemId) {
        item.visibility = !item.visibility;
      }
      if (item.children && item.children.length > 0) {
        // do it recursively
        toggleVisibility(itemId, item.children);
      }
    });
    setSceneObjects([...items]);
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <div
        style={{
          minHeight: 200,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          background: 'black',
          alignContent: 'center',
          maxWidth: '800px',
          borderRadius: '30px',
          overflow: 'hidden',
          margin: '10px auto',
        }}
      >
        <RichTreeView
          items={sceneObjects}
          defaultExpandedItems={DEFAULT_EXPANDED_ITEMS}
          sx={{ minWidth: '50%', paddingTop: '60px', paddingLeft: '20px' }}
          slots={{ item: CustomTreeItem as any }}
          slotProps={{
            item: { toggleVisibility } as any,
          }}
        />
        <Scene objects={sceneObjects} />
      </div>
    </ThemeProvider>
  );
}
