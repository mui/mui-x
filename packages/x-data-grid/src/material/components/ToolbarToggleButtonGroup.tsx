import * as React from 'react';
import MUIToggleButtonGroup, {
  ToggleButtonGroupProps as MUIToggleButtonGroupProps,
} from '@mui/material/ToggleButtonGroup';
import composeClasses from '@mui/utils/composeClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridToolbarUtilityClass } from '../../constants/gridToolbarClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface ToolbarToggleButtonGroupProps extends MUIToggleButtonGroupProps {}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    toggleButtonGroup: ['toggleButtonGroup'],
  };

  return composeClasses(slots, getDataGridToolbarUtilityClass, classes);
};

function ToolbarToggleButtonGroup(props: ToolbarToggleButtonGroupProps) {
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return <MUIToggleButtonGroup className={classes.toggleButtonGroup} {...props} />;
}

export { ToolbarToggleButtonGroup };
