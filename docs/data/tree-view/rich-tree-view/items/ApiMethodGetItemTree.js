import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function ApiMethodGetItemTree() {
  const apiRef = useRichTreeViewApiRef();

  const [items, setItems] = React.useState(MUI_X_PRODUCTS);
  const [itemOnTop, setItemOnTop] = React.useState(items[0].label);

  const handleInvertItems = () => {
    setItems((prevItems) => [...prevItems].reverse());
  };

  const handleUpdateItemOnTop = () => {
    setItemOnTop(apiRef.current.getItemTree()[0].label);
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Button onClick={handleInvertItems}>Invert first tree</Button>
        <Button onClick={handleUpdateItemOnTop}>Update item on top</Button>
      </Stack>
      <Typography>Item on top: {itemOnTop}</Typography>
      <Box sx={{ minHeight: 352, minWidth: 300 }}>
        <RichTreeView apiRef={apiRef} items={items} />
      </Box>
    </Stack>
  );
}
