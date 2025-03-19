import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  GridColDef,
  GridFilterOperator,
  GridRowId,
  gridRowIdSelector,
  gridRowNodeSelector,
} from '@mui/x-data-grid-pro';
import { type GridBaseColDef } from '@mui/x-data-grid-pro/internals';
import { GridApiPremium } from '../../../models/gridApiPremium';
import type {
  GridAggregationCellMeta,
  GridAggregationLookup,
  GridAggregationPosition,
  GridAggregationRule,
} from './gridAggregationInterfaces';
import { gridAggregationLookupSelector } from './gridAggregationSelectors';
import { GridFooterCell } from '../../../components/GridFooterCell';
import { GridAggregationHeader } from '../../../components/GridAggregationHeader';
import { gridPivotActiveSelector } from '../pivoting/gridPivotingSelectors';

type WrappableColumnProperty =
  | 'valueGetter'
  | 'valueFormatter'
  | 'renderCell'
  | 'renderHeader'
  | 'filterOperators';

interface GridColDefWithAggregationWrappers extends GridBaseColDef {
  aggregationWrappedProperties: {
    name: WrappableColumnProperty;
    originalValue: GridBaseColDef[WrappableColumnProperty];
    wrappedValue: GridBaseColDef[WrappableColumnProperty];
  }[];
}

type ColumnPropertyWrapper<P extends WrappableColumnProperty> = (params: {
  apiRef: RefObject<GridApiPremium>;
  value: GridBaseColDef[P];
  colDef: GridBaseColDef;
  aggregationRule: GridAggregationRule;
  getCellAggregationResult: (
    id: GridRowId,
    field: string,
  ) => GridAggregationLookup[GridRowId][string] | null;
}) => GridBaseColDef[P];

const getAggregationValueWrappedValueGetter: ColumnPropertyWrapper<'valueGetter'> = ({
  value: valueGetter,
  getCellAggregationResult,
}) => {
  const wrappedValueGetter: GridBaseColDef['valueGetter'] = (value, row, column, apiRef) => {
    const rowId = gridRowIdSelector(apiRef, row);
    const cellAggregationResult = rowId ? getCellAggregationResult(rowId, column.field) : null;
    if (cellAggregationResult != null) {
      return cellAggregationResult?.value ?? null;
    }

    if (valueGetter) {
      return valueGetter(value, row, column, apiRef);
    }

    return row[column.field];
  };

  return wrappedValueGetter;
};

const getAggregationValueWrappedValueFormatter: ColumnPropertyWrapper<'valueFormatter'> = ({
  value: valueFormatter,
  aggregationRule,
  getCellAggregationResult,
}) => {
  // If neither the inline aggregation function nor the footer aggregation function have a custom value formatter,
  // Then we don't wrap the column value formatter
  if (!aggregationRule.aggregationFunction.valueFormatter) {
    return valueFormatter;
  }

  const wrappedValueFormatter: GridBaseColDef['valueFormatter'] = (value, row, column, apiRef) => {
    const rowId = gridRowIdSelector(apiRef, row);
    if (rowId != null) {
      const cellAggregationResult = getCellAggregationResult(rowId, column.field);
      if (cellAggregationResult != null) {
        return aggregationRule.aggregationFunction.valueFormatter?.(value, row, column, apiRef);
      }
    }

    if (valueFormatter) {
      return valueFormatter(value, row, column, apiRef);
    }

    return value;
  };

  return wrappedValueFormatter;
};

const getAggregationValueWrappedRenderCell: ColumnPropertyWrapper<'renderCell'> = ({
  value: renderCell,
  aggregationRule,
  getCellAggregationResult,
  apiRef,
}) => {
  const pivotActive = gridPivotActiveSelector(apiRef);
  const wrappedRenderCell: GridBaseColDef['renderCell'] = (params) => {
    const cellAggregationResult = getCellAggregationResult(params.id, params.field);
    if (cellAggregationResult != null) {
      if (!renderCell) {
        if (cellAggregationResult.position === 'footer') {
          return <GridFooterCell {...params} />;
        }

        if (pivotActive && cellAggregationResult.value === 0) {
          return null;
        }

        return params.formattedValue;
      }

      if (pivotActive && cellAggregationResult.value === 0) {
        return null;
      }

      const aggregationMeta: GridAggregationCellMeta = {
        hasCellUnit: aggregationRule!.aggregationFunction.hasCellUnit ?? true,
        aggregationFunctionName: aggregationRule!.aggregationFunctionName,
      };

      return renderCell({ ...params, aggregation: aggregationMeta });
    }

    if (!renderCell) {
      return params.formattedValue;
    }

    return renderCell(params);
  };

  return wrappedRenderCell;
};

/**
 * Skips the filtering for aggregated rows
 */
const getWrappedFilterOperators: ColumnPropertyWrapper<'filterOperators'> = ({
  value: filterOperators,
  apiRef,
  getCellAggregationResult,
}) =>
  filterOperators!.map((operator) => {
    const baseGetApplyFilterFn = operator.getApplyFilterFn;

    const getApplyFilterFn: GridFilterOperator<any, any, any>['getApplyFilterFn'] = (
      filterItem,
      colDef,
    ) => {
      const filterFn = baseGetApplyFilterFn(filterItem, colDef);
      if (!filterFn) {
        return null;
      }
      return (value, row, column, api) => {
        const rowId = gridRowIdSelector(apiRef, row);
        if (getCellAggregationResult(rowId, column.field) != null) {
          return true;
        }
        return filterFn(value, row, column, api);
      };
    };

    return {
      ...operator,
      getApplyFilterFn,
    } as GridFilterOperator;
  });

/**
 * Add the aggregation method around the header name
 */
const getWrappedRenderHeader: ColumnPropertyWrapper<'renderHeader'> = ({
  value: renderHeader,
  aggregationRule,
}) => {
  const wrappedRenderHeader: GridBaseColDef['renderHeader'] = (params) => {
    // TODO: investigate why colDef is undefined
    if (!params.colDef) {
      return null;
    }
    return (
      <GridAggregationHeader
        {...params}
        aggregation={{ aggregationRule }}
        renderHeader={renderHeader}
      />
    );
  };

  return wrappedRenderHeader;
};

/**
 * Add a wrapper around each wrappable property of the column to customize the behavior of the aggregation cells.
 */
export const wrapColumnWithAggregationValue = ({
  column,
  apiRef,
  aggregationRule,
}: {
  column: GridBaseColDef;
  apiRef: RefObject<GridApiPremium>;
  aggregationRule: GridAggregationRule;
}): GridBaseColDef => {
  const getCellAggregationResult = (
    id: GridRowId,
    field: string,
  ): GridAggregationLookup[GridRowId][string] | null => {
    let cellAggregationPosition: GridAggregationPosition | null = null;
    const rowNode = gridRowNodeSelector(apiRef, id);

    if (!rowNode) {
      return null;
    }

    if (rowNode.type === 'group') {
      cellAggregationPosition = 'inline';
    } else if (id.toString().startsWith('auto-generated-group-footer-')) {
      cellAggregationPosition = 'footer';
    }

    if (cellAggregationPosition == null) {
      return null;
    }

    // TODO: Add custom root id
    const groupId = cellAggregationPosition === 'inline' ? id : (rowNode.parent ?? '');

    const aggregationResult = gridAggregationLookupSelector(apiRef)?.[groupId]?.[field];
    if (!aggregationResult || aggregationResult.position !== cellAggregationPosition) {
      return null;
    }

    return aggregationResult;
  };

  let didWrapSomeProperty = false;
  const wrappedColumn: GridColDefWithAggregationWrappers = {
    ...column,
    aggregationWrappedProperties: [],
  };

  const wrapColumnProperty = <P extends WrappableColumnProperty>(
    property: P,
    wrapper: ColumnPropertyWrapper<P>,
  ) => {
    const originalValue = column[property];
    const wrappedProperty = wrapper({
      apiRef,
      value: originalValue,
      colDef: column,
      aggregationRule,
      getCellAggregationResult,
    });

    if (wrappedProperty !== originalValue) {
      didWrapSomeProperty = true;
      wrappedColumn[property] = wrappedProperty as any;
      wrappedColumn.aggregationWrappedProperties.push({
        name: property,
        originalValue,
        wrappedValue: wrappedProperty,
      });
    }
  };

  wrapColumnProperty('valueGetter', getAggregationValueWrappedValueGetter);
  wrapColumnProperty('valueFormatter', getAggregationValueWrappedValueFormatter);
  wrapColumnProperty('renderCell', getAggregationValueWrappedRenderCell);
  wrapColumnProperty('renderHeader', getWrappedRenderHeader);
  wrapColumnProperty('filterOperators', getWrappedFilterOperators);

  if (!didWrapSomeProperty) {
    return column;
  }

  return wrappedColumn;
};

/**
 * Remove the aggregation wrappers around the wrappable properties of the column.
 */
export const unwrapColumnFromAggregation = ({
  column,
}: {
  column: GridColDef | GridColDefWithAggregationWrappers;
}) => {
  if (!(column as GridColDefWithAggregationWrappers).aggregationWrappedProperties) {
    return column as GridColDef;
  }
  const { aggregationWrappedProperties, ...unwrappedColumn } =
    column as GridColDefWithAggregationWrappers;

  aggregationWrappedProperties.forEach(({ name, originalValue, wrappedValue }) => {
    // The value changed since we wrapped it
    if (wrappedValue !== unwrappedColumn[name]) {
      return;
    }
    unwrappedColumn[name] = originalValue as any;
  });

  return unwrappedColumn;
};
