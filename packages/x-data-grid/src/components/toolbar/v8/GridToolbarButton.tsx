import * as React from 'react';
import ToggleButton, { ToggleButtonProps } from '@mui/material/ToggleButton';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';

export type GridToolbarButtonProps = Omit<ToggleButtonProps, 'selected' | 'value'>;

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarButton'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const StyledButton = styled(ToggleButton as React.ElementType<GridToolbarButtonProps>, {
  name: 'MuiDataGrid',
  slot: 'ToolbarButton',
  overridesResolver: (_, styles) => styles.toolbarButton,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  gap: theme.spacing(0.5),
  border: 0,
}));

const GridToolbarButton = React.forwardRef<HTMLButtonElement, GridToolbarButtonProps>(
  function GridToolbarButton(props, ref) {
    const { children, className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    return (
      <StyledButton
        // although this is a regular button (not a toggle button)
        // we use the Material UI ToggleButton component under-the-hood to match ToggleButton styles
        as={rootProps.slots.baseToggleButton}
        ref={ref}
        ownerState={rootProps}
        className={clsx(classes.root, className)}
        size="small"
        selected={other['aria-expanded'] === 'true'} // adds the "selected" styles when the button has an expanded popup
        aria-pressed={undefined} // removes the aria-pressed attribute that the ToggleButton component adds by default if `selected` is true}
        {...rootProps.slotProps?.baseToggleButton}
        {...other}
      >
        {children}
      </StyledButton>
    );
  },
);

export { GridToolbarButton };
