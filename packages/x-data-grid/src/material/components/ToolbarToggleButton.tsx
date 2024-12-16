import * as React from 'react';
import MUIToggleButton, {
  ToggleButtonProps as MUIToggleButtonProps,
} from '@mui/material/ToggleButton';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridToolbarUtilityClass } from '../../constants/gridToolbarClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export interface ToolbarToggleButtonProps extends MUIToggleButtonProps {}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    toggleButton: ['toggleButton'],
  };

  return composeClasses(slots, getDataGridToolbarUtilityClass, classes);
};

const StyledToolbarToggleButton = styled(MUIToggleButton, {
  name: 'MuiDataGridToolbar',
  slot: 'ToggleButton',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  gap: theme.spacing(0.5),
}));

const ToolbarToggleButton = React.forwardRef<HTMLButtonElement, ToolbarToggleButtonProps>(
  function ToolbarToggleButton(props, ref) {
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    return (
      <StyledToolbarToggleButton
        ref={ref}
        className={classes.toggleButton}
        ownerState={rootProps}
        {...props}
      />
    );
  },
);

export { ToolbarToggleButton };
