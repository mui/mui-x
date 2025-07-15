import * as React from 'react';
import { forwardRef } from '@mui/x-internals/forwardRef';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass, useGridRootProps } from '@mui/x-data-grid-pro';
import { GridSkeletonLoadingOverlayInner, useGridSelector } from '@mui/x-data-grid-pro/internals';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { gridAggregationModelSelector } from '../hooks/features/aggregation/gridAggregationSelectors';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';

type OwnerState = { classes: DataGridPremiumProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['aggregationRowOverlayWrapper'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridAggregationRowOverlay = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function GridAggregationRowOverlay(props, forwardedRef) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses({ classes: rootProps.classes });
    const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);

    const visibleColumns = new Set(Object.keys(aggregationModel));

    return (
      <div className={classes.root}>
        <GridSkeletonLoadingOverlayInner
          {...props}
          skeletonRowsCount={1}
          visibleColumns={visibleColumns}
          showFirstRowBorder
          ref={forwardedRef}
        />
      </div>
    );
  },
);

export { GridAggregationRowOverlay };
