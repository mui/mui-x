import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function ApiMethodGetItemDOMElement() {
  const apiRef = useRichTreeViewApiRef();
  const handleScrollToChartsCommunity = (event) => {
    apiRef.current.focusItem(event, 'charts-community');
    apiRef.current
      .getItemDOMElement('charts-community')
      ?.scrollIntoView({ block: 'nearest' });
  };

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleScrollToChartsCommunity}>
          Focus and scroll to charts community item
        </Button>
      </div>
      <Box sx={{ height: 200, minWidth: 250, overflowY: 'scroll' }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          apiRef={apiRef}
          defaultExpandedItems={['grid', 'pickers', 'charts', 'tree-view']}
        />
      </Box>
    </Stack>
  );
}
