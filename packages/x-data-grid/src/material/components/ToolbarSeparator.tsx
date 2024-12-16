import * as React from 'react';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridToolbarUtilityClass } from '../../constants/gridToolbarClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface ToolbarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    separator: ['separator'],
  };

  return composeClasses(slots, getDataGridToolbarUtilityClass, classes);
};

const StyledToolbarSeparator = styled('div', {
  name: 'MuiDataGridToolbar',
  slot: 'Separator',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  height: 24,
  width: 1,
  margin: theme.spacing(0.25),
  backgroundColor: theme.palette.divider,
}));

const ToolbarSeparator = React.forwardRef<HTMLDivElement, ToolbarSeparatorProps>(
  function ToolbarSeparator(props, ref) {
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    return (
      <StyledToolbarSeparator
        ref={ref}
        className={classes.separator}
        ownerState={rootProps}
        {...props}
      />
    );
  },
);

export { ToolbarSeparator };
