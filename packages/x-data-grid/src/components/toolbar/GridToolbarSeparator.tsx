import * as React from 'react';
import { styled } from '@mui/material/styles';

const Separator = styled('div')(({ theme }) => ({
  height: 24,
  width: 1,
  margin: theme.spacing(0.25),
  backgroundColor: theme.palette.divider,
}));

function GridToolbarSeparator() {
  return <Separator role="separator" aria-orientation="vertical" />;
}

export { GridToolbarSeparator };
