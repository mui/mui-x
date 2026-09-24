import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function LoadingRichTreeView() {
  const [loading, setLoading] = React.useState(true);

  const handleToggle = () => {
    setLoading((prev) => !prev);
  };

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Button
        onClick={handleToggle}
        variant="outlined"
        size="small"
        sx={{ alignSelf: 'start' }}
      >
        {loading ? 'Load items' : 'Reset to loading'}
      </Button>
      <RichTreeView
        loading={loading}
        items={loading ? [] : MUI_X_PRODUCTS}
        sx={{ minHeight: 200 }}
      />
    </Stack>
  );
}
