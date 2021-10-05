import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';

const GridPanelFooterRoot = styled('div', {
  name: 'MuiGridPanelFooter',
  slot: 'Root',
})(({ theme }) => ({
  padding: theme.spacing(0.5),
  display: 'flex',
  justifyContent: 'space-between',
}));

export function GridPanelFooter(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const { className, ...other } = props;
  return <GridPanelFooterRoot className={clsx('MuiGridPanelFooter-root', className)} {...other} />;
}
