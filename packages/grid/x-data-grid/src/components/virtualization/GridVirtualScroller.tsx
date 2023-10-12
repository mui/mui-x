import * as React from 'react';
import clsx from 'clsx';
import { styled, SxProps, Theme } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['virtualScroller'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const VirtualScrollerRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'VirtualScroller',
  overridesResolver: (props, styles) => styles.virtualScroller,
})<{ ownerState: OwnerState }>({
  overflow: 'auto',
  height: '100%',

  // See https://github.com/mui/mui-x/issues/4360
  position: 'relative',
  '@media print': {
    overflow: 'hidden',
  },
});

const GridVirtualScroller = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sx?: SxProps<Theme> }
>(function GridVirtualScroller(props, ref) {
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const styles = React.useMemo(
    () => (rootProps.autoHeight ? props.style : { ...props.style, flex: '1 1 0' }),
    [rootProps.autoHeight, props.style],
  );

  return (
    <VirtualScrollerRoot
      ref={ref}
      {...props}
      style={styles}
      className={clsx(classes.root, props.className)}
      ownerState={rootProps}
    />
  );
});

export { GridVirtualScroller };
