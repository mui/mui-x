import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import {
  GridColumnHeaderParams,
  GridColumnHeaderTitle,
  gridDensityHeaderHeightSelector,
  useGridSelector,
} from '@mui/x-data-grid';
import { getAggregationFunctionLabel } from '../hooks/features/aggregation/gridAggregationUtils';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';

interface OwnerState {
  classes: DataGridPremiumProcessedProps['classes'];
  headerHeight: number;
}

const GridAggregationHeaderRoot = styled(Box, {
  name: 'MuiDataGrid',
  slot: 'AggregationColumnHeader',
  overridesResolver: (_, styles) => styles.aggregationColumnHeader,
})<{ ownerState: OwnerState }>({
  position: 'relative',
  flex: 1,
});

const GridAggregationFunctionLabel = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AggregationColumnHeaderLabel',
  overridesResolver: (_, styles) => styles.aggregationColumnHeaderLabel,
})<{ ownerState: OwnerState }>(({ theme, ownerState }) => {
  const isCompact = ownerState.headerHeight < 40;

  return {
    position: 'absolute',
    bottom: `calc(50% - ${theme.typography.fontSize}px / 2 - ${
      theme.typography.caption.fontSize
    } - ${isCompact ? '0px' : theme.spacing(0.5)})`,
    left: 0,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.grey['600'],
    textTransform: 'uppercase',
  };
});

const GridAggregationHeader = (props: GridColumnHeaderParams) => {
  const { colDef, aggregation } = props;

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const headerHeight = useGridSelector(apiRef, gridDensityHeaderHeightSelector);

  const ownerState = { classes: rootProps.classes, headerHeight };

  if (!aggregation) {
    return null;
  }

  const aggregationLabel = getAggregationFunctionLabel({
    apiRef,
    aggregationRule: aggregation.aggregationRule,
  });

  return (
    <GridAggregationHeaderRoot ownerState={ownerState}>
      <GridColumnHeaderTitle
        label={colDef.headerName ?? colDef.field}
        description={colDef.description}
        columnWidth={colDef.computedWidth}
      />
      <GridAggregationFunctionLabel ownerState={ownerState}>
        {aggregationLabel}
      </GridAggregationFunctionLabel>
    </GridAggregationHeaderRoot>
  );
};

export { GridAggregationHeader };
