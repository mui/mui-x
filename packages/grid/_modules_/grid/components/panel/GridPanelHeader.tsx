import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';

const DataGridPanelHeaderRoot = styled('div', {
  name: 'MuiDataGridPanelHeader',
  slot: 'Root',
})(({ theme }) => ({
  padding: theme.spacing(1),
}));

export function GridPanelHeader(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>,
) {
  const { className, ...other } = props;
  return (
    <DataGridPanelHeaderRoot
      className={clsx('MuiDataGridPanelHeader-root', className)}
      {...other}
    />
  );
}
