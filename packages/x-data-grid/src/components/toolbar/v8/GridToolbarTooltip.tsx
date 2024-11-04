import * as React from 'react';
import clsx from 'clsx';
import { TooltipProps } from '@mui/material/Tooltip';
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

function GridToolbarTooltip(props: GridToolbarTooltipProps) {
  const rootProps = useGridRootProps();
  const { children, className, ...other } = props;
  const classes = useUtilityClasses(rootProps);

  return (
    <rootProps.slots.baseTooltip
      className={clsx(classes.root, className)}
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
    </rootProps.slots.baseTooltip>
  );
}

export { GridToolbarTooltip };
