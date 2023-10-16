import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { styled } from '@mui/system';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridAriaAttributes } from '../../hooks/utils/useGridAriaAttributes';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['scrollerContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Element = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ScrollerContainer',
  overridesResolver: (props, styles) => styles.main,
})<{ ownerState: OwnerState }>(() => ({
  position: 'relative',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

export const GridVirtualScrollerContainer = React.forwardRef<HTMLDivElement, React.PropsWithChildren<{}>>(
  (props, ref) => {
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    const getAriaAttributes = rootProps.experimentalFeatures?.ariaV7 // ariaV7 should never change
      ? useGridAriaAttributes
      : null;
    const ariaAttributes = typeof getAriaAttributes === 'function' ? getAriaAttributes() : null;

    return (
      <Element
        ref={ref}
        className={classes.root}
        ownerState={rootProps}
        {...ariaAttributes}
      >
        {props.children}
      </Element>
    );
  },
);
