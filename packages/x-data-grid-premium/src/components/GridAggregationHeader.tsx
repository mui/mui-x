import * as React from 'react';
import clsx from 'clsx'
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { css, useStyled } from '@mui/x-data-grid/internals';
import {
  getDataGridUtilityClass,
  GridColDef,
  GridColumnHeaderParams,
  GridColumnHeaderTitle,
} from '@mui/x-data-grid';
import type { GridBaseColDef } from '@mui/x-data-grid/internals';
import { getAggregationFunctionLabel } from '../hooks/features/aggregation/gridAggregationUtils';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';

interface OwnerState extends DataGridPremiumProcessedProps {
  classes: DataGridPremiumProcessedProps['classes'];
  colDef: GridColDef;
}

const headerStyled = css({
  name: 'MuiDataGrid',
  slot: 'aggregationColumnHeader',
}, {
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  alignLeft: {
    alignItems: 'center',
  },
  alignCenter: {},
});

const GridAggregationFunctionLabel = styled('div', {
  name: 'MuiDataGrid',
  slot: 'AggregationColumnHeaderLabel',
  overridesResolver: (_, styles) => styles.aggregationColumnHeaderLabel,
})<{ ownerState: OwnerState }>(({ theme }) => {
  return {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: 'normal',
    color: theme.palette.text.secondary,
    marginTop: -1,
  };
});

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    aggregationLabel: ['aggregationColumnHeaderLabel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridAggregationHeader(
  props: GridColumnHeaderParams & {
    renderHeader: GridBaseColDef['renderHeader'];
  },
) {
  const { renderHeader, ...params } = props;
  const { colDef, aggregation } = params;

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const ownerState = { ...rootProps, classes: rootProps.classes, colDef };
  const classes = useUtilityClasses(ownerState);

  if (!aggregation) {
    return null;
  }

  const headerClasses = useStyled(headerStyled, { rootProps })

  const aggregationLabel = getAggregationFunctionLabel({
    apiRef,
    aggregationRule: aggregation.aggregationRule,
  });

  const rootClassName = clsx(
    headerClasses.root,
    colDef.headerAlign === 'left' && headerClasses.alignLeft,
    colDef.headerAlign === 'center' && headerClasses.alignCenter,
    colDef.headerAlign === 'right' && headerClasses.alignRight,
  );

  return (
    <div className={rootClassName}>
      {renderHeader ? (
        renderHeader(params)
      ) : (
        <GridColumnHeaderTitle
          label={colDef.headerName ?? colDef.field}
          description={colDef.description}
          columnWidth={colDef.computedWidth}
        />
      )}
      <GridAggregationFunctionLabel ownerState={ownerState} className={classes.aggregationLabel}>
        {aggregationLabel}
      </GridAggregationFunctionLabel>
    </div>
  );
}

export { GridAggregationHeader };
