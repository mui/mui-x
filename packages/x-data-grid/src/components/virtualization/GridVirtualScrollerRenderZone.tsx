'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, type SxProps, type Theme } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['virtualScrollerRenderZone'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const VirtualScrollerRenderZoneRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'VirtualScrollerRenderZone',
})<{ ownerState: OwnerState }>({
  position: 'absolute',
  display: 'flex', // Prevents margin collapsing when using `getRowSpacing`
  flexDirection: 'column',
});

const GridVirtualScrollerRenderZone = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sx?: SxProps<Theme> }
>(function GridVirtualScrollerRenderZone(props, ref) {
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return (
    <VirtualScrollerRenderZoneRoot
      ownerState={rootProps}
      {...props}
      className={clsx(classes.root, props.className)}
      ref={ref}
    />
  );
});

export { GridVirtualScrollerRenderZone };
