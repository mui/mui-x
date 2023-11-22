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
    root: ['main'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridMainContainerRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Main',
  overridesResolver: (props, styles) => styles.main,
})<{ ownerState: OwnerState }>(() => ({
  position: 'relative',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

export const GridMainContainer = React.forwardRef<HTMLDivElement, React.PropsWithChildren<{}>>(
  (props, ref) => {
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    const getAriaAttributes = rootProps.experimentalFeatures?.ariaV7 // ariaV7 should never change
      ? useGridAriaAttributes
      : null;
    const ariaAttributes = typeof getAriaAttributes === 'function' ? getAriaAttributes() : null;

    return (
      <GridMainContainerRoot
        ref={ref}
        className={classes.root}
        ownerState={rootProps}
        {...ariaAttributes}
      >
        {props.children}
      </GridMainContainerRoot>
    );
  },
);
