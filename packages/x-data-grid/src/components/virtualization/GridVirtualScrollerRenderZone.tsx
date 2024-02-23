import * as React from 'react';
import clsx from 'clsx';
import { styled, SxProps, Theme } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridOffsetsSelector } from '../../hooks/features/virtualization';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

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
  overridesResolver: (props, styles) => styles.virtualScrollerRenderZone,
})<{ ownerState: OwnerState }>({
  position: 'absolute',
  display: 'flex', // Prevents margin collapsing when using `getRowSpacing`
  flexDirection: 'column',
});

const GridVirtualScrollerRenderZone = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sx?: SxProps<Theme> }
>(function GridVirtualScrollerRenderZone(props, ref) {
  const { className, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const offsets = useGridSelector(apiRef, gridOffsetsSelector);

  return (
    <VirtualScrollerRenderZoneRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={rootProps}
      style={{
        transform: `translate3d(0, ${offsets.top}px, 0)`,
      }}
      {...other}
    />
  );
});

export { GridVirtualScrollerRenderZone };
