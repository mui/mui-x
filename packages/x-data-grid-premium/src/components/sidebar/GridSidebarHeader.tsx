import * as React from 'react';
import { styled } from '@mui/system';
import { DataGridProcessedProps, useGridSelector, vars } from '@mui/x-data-grid/internals';
import {
  getDataGridUtilityClass,
  gridDimensionsSelector,
  useGridRootProps,
} from '@mui/x-data-grid';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import clsx from 'clsx';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

export type GridSidebarHeaderProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['sidebarHeader'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridSidebarHeaderRoot = styled('div', {
  name: 'DataGrid',
  slot: 'SidebarHeader',
  overridesResolver: (_, styles) => styles.sidebarHeader,
})<{ ownerState: OwnerState }>({
  position: 'sticky',
  top: 0,
  borderBottom: `1px solid ${vars.colors.border.base}`,
});

export function GridSidebarHeader(props: GridSidebarHeaderProps) {
  const { className, children, ...other } = props;
  const apiRef = useGridApiContext();
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return (
    <GridSidebarHeaderRoot
      style={{ minHeight: dimensions.headerHeight }}
      className={clsx(className, classes.root)}
      ownerState={rootProps}
      {...other}
    >
      {children}
    </GridSidebarHeaderRoot>
  );
}
