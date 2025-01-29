import * as React from 'react';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { styled } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import {
  gridDimensionsSelector,
  GRID_ROOT_GROUP_ID,
  gridRowsLoadingSelector,
  getDataGridUtilityClass,
  useGridRootProps,
} from '@mui/x-data-grid-pro';
import { GridSkeletonLoadingOverlayInner, useGridSelector } from '@mui/x-data-grid-pro/internals';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridAggregationLookupSelector } from '../hooks/features/aggregation/gridAggregationSelectors';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';

const GridAggregationRowOverlayWrapper = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AggregationRowOverlayWrapper',
  overridesResolver: (_, styles) => styles.aggregationRowOverlayWrapper,
})({
  position: 'absolute',
  top: 0,
});

type OwnerState = { classes: DataGridPremiumProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['aggregationRowOverlayWrapper'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridAggregationRowOverlay = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function GridSkeletonLoadingOverlay(props, forwardedRef) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses({ classes: rootProps.classes });
    const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
    const isLoading = useGridSelector(apiRef, gridRowsLoadingSelector);
    const aggregationLookup = useGridSelector(apiRef, gridAggregationLookupSelector);
    if (!isLoading) {
      return null;
    }
    const rootLookup = aggregationLookup[GRID_ROOT_GROUP_ID];
    const initialDataFetched = Object.values(rootLookup).some(({ value }) => value !== '');
    if (initialDataFetched) {
      return null;
    }

    const visibleColumns = new Set(Object.keys(rootLookup));
    const viewportHeight = dimensions.bottomContainerHeight ?? 0;
    const skeletonRowsCount = Math.ceil(viewportHeight / dimensions.rowHeight);

    return (
      <GridAggregationRowOverlayWrapper className={classes.root}>
        <GridSkeletonLoadingOverlayInner
          {...props}
          skeletonRowsCount={skeletonRowsCount}
          visibleColumns={visibleColumns}
          ref={forwardedRef}
        />
      </GridAggregationRowOverlayWrapper>
    );
  },
);

export { GridAggregationRowOverlay };
