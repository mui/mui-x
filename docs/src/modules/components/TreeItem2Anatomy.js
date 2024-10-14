import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

export default function TreeItem2Anatomy() {
  const { palette } = useTheme();

  const src =
    palette.mode === 'light'
      ? '/static/x/tree-view-illustrations/tree-item-light.png'
      : '/static/x/tree-view-illustrations/tree-item-dark.png';
  return (
    <Card elevation={0} variant="outlined" sx={{ padding: 4 }}>
      <CardMedia
        sx={{ minHeight: '250px', backgroundSize: 'contain' }}
        image={src}
        title="tree item anatomy"
      />
    </Card>
  );
}
