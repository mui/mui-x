import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export default function RootElementRef() {
  // `SimpleTreeView` forwards its `ref` to the root `<ul>` element
  const rootRef = React.useRef(null);

  const handleHighlight = () => {
    const rootElement = rootRef.current;
    if (!rootElement) {
      return;
    }

    rootElement.style.outline = '2px solid red';
    setTimeout(() => {
      rootElement.style.outline = '';
    }, 1000);
  };

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleHighlight}>Highlight the root element</Button>
      </div>
      <Box sx={{ minWidth: 250 }}>
        <SimpleTreeView ref={rootRef} defaultExpandedItems={['grid']}>
          <TreeItem itemId="grid" label="Data Grid">
            <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
            <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
          </TreeItem>
          <TreeItem itemId="pickers" label="Date and Time Pickers" />
        </SimpleTreeView>
      </Box>
    </Stack>
  );
}
