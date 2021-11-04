import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass } from '../../gridClasses';
import { GridComponentProps } from '../../GridComponentProps';

type OwnerState = { classes: GridComponentProps['classes'] };

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
})({
  overflow: 'auto',
  '@media print': {
    overflow: 'hidden',
  },
});

const GridVirtualScroller = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function GridVirtualScroller(props, ref) {
    const { className, ...other } = props;
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);

    return <VirtualScrollerRoot ref={ref} className={clsx(classes.root, className)} {...other} />;
  },
);

export { GridVirtualScroller };
