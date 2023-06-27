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

    // ariaV7 should never change
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ariaAttributes = rootProps.experimentalFeatures?.ariaV7 ? useGridAriaAttributes() : null;

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
