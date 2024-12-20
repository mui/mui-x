import * as React from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { getDataGridToolbarUtilityClass } from './gridToolbarClasses';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export interface ToolbarProps extends React.ComponentPropsWithRef<'div'> {
  sx?: SxProps<Theme>;
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getDataGridToolbarUtilityClass, classes);
};

const StyledToolbar = styled('div', {
  name: 'MuiDataGridToolbar',
  slot: 'Root',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  flex: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(props, ref) {
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return <StyledToolbar ref={ref} className={classes.root} ownerState={rootProps} {...props} />;
});

export { Toolbar };
