import React from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import CustomTreeItem from './three-d/CustomTreeItem';
import CustomTreeItemContextMenu from './three-d/ContextMenu';
import Scene from './three-d/Scene';
import sceneObjects from './three-d/SceneObjects';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { createTheme } from '@mui/material/styles';

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

export default function Demo() {
  const [objectsToRender, setObjectsToRender] = React.useState(sceneObjects);
  const [expandedNodes, setExpandedNodes] = React.useState([
    'lights',
    'chassi',
    'wheels',
    'car',
  ]);

  const handleExpandedNodesChange = (event, nodeIds) => {
    setExpandedNodes(nodeIds);
  };

  const toggleVisibility = (nodeId, items = objectsToRender) => {
    items.forEach((item) => {
      if (item.id === nodeId) {
        item.visibility = !item.visibility;
      }
      if (item.children && item.children.length > 0) {
        // do it recursively
        toggleVisibility(nodeId, item.children);
      }
    });
    setObjectsToRender([...items]);
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
          expandedItems={expandedNodes}
          onExpandedItemsChange={handleExpandedNodesChange}
          sx={{ minWidth: '50%', paddingTop: '60px', paddingLeft: '20px' }}
          slots={{ item: CustomTreeItem }}
          slotProps={{
            item: {
              toggleVisibility: toggleVisibility,
              sceneObjects: objectsToRender, //temporarily solution
            },
          }}
        />
        <Scene objects={objectsToRender} />
      </div>
    </ThemeProvider>
  );
}
