import * as React from 'react';
import Popover, { popoverClasses, PopoverProps } from '@mui/material/Popover';
import { styled } from '@mui/system';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';

export type GridToolbarPopoverProps = PopoverProps;

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarPopover'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const StyledPopover = styled(Popover, {
  name: 'MuiDataGrid',
  slot: 'ToolbarPopover',
  overridesResolver: (_, styles) => styles.toolbarPopover,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  [`.${popoverClasses.paper}`]: {
    padding: theme.spacing(0.5),
  },
}));

function GridToolbarPopover(props: GridToolbarPopoverProps) {
  const rootProps = useGridRootProps();
  const { children, className, ...other } = props;
  const classes = useUtilityClasses(rootProps);

  return (
    <StyledPopover
      ownerState={rootProps}
      className={clsx(classes.root, className)}
      as={rootProps.slots.basePopover}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      {...rootProps.slotProps?.basePopover}
      {...other}
    >
      {children}
    </StyledPopover>
  );
}

export { GridToolbarPopover };
