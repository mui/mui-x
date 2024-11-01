import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import composeClasses from '@mui/utils/composeClasses';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';

export type GridToolbarTooltipProps = TooltipProps;

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarTooltip'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const StyledTooltip = styled(Tooltip, {
  name: 'MuiDataGrid',
  slot: 'ToolbarTooltip',
  overridesResolver: (_, styles) => styles.toolbarTooltip,
})<{ ownerState: OwnerState }>({
  border: 0,
});

function GridToolbarTooltip(props: GridToolbarTooltipProps) {
  const rootProps = useGridRootProps();
  const { children, className, ...other } = props;
  const classes = useUtilityClasses(rootProps);

  return (
    <StyledTooltip
      ownerState={rootProps}
      className={clsx(classes.root, className)}
      as={rootProps.slots.baseTooltip}
      enterDelay={1000}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -10],
              },
            },
          ],
        },
      }}
      {...rootProps.slotProps?.baseTooltip}
      {...other}
    >
      {children}
    </StyledTooltip>
  );
}

export { GridToolbarTooltip };
