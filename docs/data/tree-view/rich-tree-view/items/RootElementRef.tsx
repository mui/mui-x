import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewDefaultItemModelProperties } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewDefaultItemModelProperties[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
    ],
  },
  { id: 'pickers', label: 'Date and Time Pickers' },
];

export default function RootElementRef() {
  // `RichTreeView` forwards its `ref` to the root `<ul>` element
  const rootRef = React.useRef<HTMLUListElement>(null);

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
        <RichTreeView
          ref={rootRef}
          items={MUI_X_PRODUCTS}
          defaultExpandedItems={['grid']}
        />
      </Box>
    </Stack>
  );
}
