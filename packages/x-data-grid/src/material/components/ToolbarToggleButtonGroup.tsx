import * as React from 'react';
import MUIToggleButtonGroup, {
  ToggleButtonGroupProps as MUIToggleButtonGroupProps,
} from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
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

const StyledToolbarToggleButtonGroup = styled(MUIToggleButtonGroup, {
  name: 'MuiDataGridToolbar',
  slot: 'ToggleButtonGroup',
})<{ ownerState: OwnerState }>({});

function ToolbarToggleButtonGroup(props: ToolbarToggleButtonGroupProps) {
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return (
    <StyledToolbarToggleButtonGroup
      className={classes.toggleButtonGroup}
      ownerState={rootProps}
      {...props}
    />
  );
}

export { ToolbarToggleButtonGroup };
