import * as React from 'react';
import { styled } from '@mui/material/styles';

const GridPanelContentRoot = styled('div', {
  name: 'MuiGridPanelContent',
  slot: 'Root',
})({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  flex: '1 1',
  maxHeight: 400,
});

export function GridPanelContent(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const { className, ...other } = props;
  return <GridPanelContentRoot className={className} {...other} />;
}
