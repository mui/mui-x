import * as React from 'react';
import clsx from 'clsx';
import { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';
import composeClasses from '@mui/utils/composeClasses';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';

export type GridToolbarToggleButtonGroupProps = ToggleButtonGroupProps;

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarToggleButtonGroup'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridToolbarToggleButtonGroup(props: GridToolbarToggleButtonGroupProps) {
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const { children, className, ...other } = props;

  return (
    <rootProps.slots.baseToggleButtonGroup
      color="primary"
      size="small"
      className={clsx(classes.root, className)}
      {...other}
    >
      {children}
    </rootProps.slots.baseToggleButtonGroup>
  );
}

export { GridToolbarToggleButtonGroup };
