import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const MUI_X_PRODUCTS = [
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
  // `RichTreeView` forwards its `ref` to the root `<ul>` element, so there's
  // no need to go through `apiRef` to access it.
  const rootRef = React.useRef(null);
  const [borderColor, setBorderColor] = React.useState('');

  return (
    <Stack spacing={2}>
      <Button
        onClick={() => setBorderColor(rootRef.current ? 'red' : '')}
        sx={{ alignSelf: 'flex-start' }}
      >
        Highlight the root element
      </Button>
      <Box
        sx={{ minWidth: 250, border: 1, borderColor: borderColor || 'transparent' }}
      >
        <RichTreeView
          ref={rootRef}
          items={MUI_X_PRODUCTS}
          defaultExpandedItems={['grid']}
        />
      </Box>
    </Stack>
  );
}
