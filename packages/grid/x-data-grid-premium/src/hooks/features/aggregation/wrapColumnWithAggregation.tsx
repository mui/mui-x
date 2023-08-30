import * as React from 'react';
import { GridColDef, GridFilterOperator, GridRowId } from '@mui/x-data-grid-pro';
import { GridBaseColDef, tagInternalFilter } from '@mui/x-data-grid-pro/internals';
import { GridApiPremium } from '../../../models/gridApiPremium';
import {
  GridAggregationCellMeta,
  GridAggregationLookup,
  GridAggregationPosition,
  GridAggregationRule,
} from './gridAggregationInterfaces';
import { gridAggregationLookupSelector } from './gridAggregationSelectors';
import { GridFooterCell } from '../../../components/GridFooterCell';
import { GridAggregationHeader } from '../../../components/GridAggregationHeader';

const AGGREGATION_WRAPPABLE_PROPERTIES = [
  'valueGetter',
  'valueFormatter',
  'renderCell',
  'renderHeader',
  'filterOperators',
] as const;

type WrappableColumnProperty = (typeof AGGREGATION_WRAPPABLE_PROPERTIES)[number];

interface GridColDefWithAggregationWrappers extends GridBaseColDef {
  aggregationWrappedColumn: GridBaseColDef;
}

type ColumnPropertyWrapper<P extends WrappableColumnProperty> = (params: {
  apiRef: React.MutableRefObject<GridApiPremium>;
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
  const wrappedValueGetter: GridBaseColDef['valueGetter'] = (params) => {
    const cellAggregationResult = getCellAggregationResult(params.id, params.field);
    if (cellAggregationResult != null) {
      return cellAggregationResult?.value ?? null;
    }

    if (valueGetter) {
      return valueGetter(params);
    }

    return params.row[params.field];
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

  const wrappedValueFormatter: GridBaseColDef['valueFormatter'] = (params) => {
    if (params.id != null) {
      const cellAggregationResult = getCellAggregationResult(params.id, params.field);
      if (cellAggregationResult != null) {
        return aggregationRule.aggregationFunction.valueFormatter!(params);
      }
    }

    if (valueFormatter) {
      return valueFormatter(params);
    }

    return params.value;
  };

  return wrappedValueFormatter;
};

const getAggregationValueWrappedRenderCell: ColumnPropertyWrapper<'renderCell'> = ({
  value: renderCell,
  aggregationRule,
  getCellAggregationResult,
}) => {
  const wrappedRenderCell: GridBaseColDef['renderCell'] = (params) => {
    const cellAggregationResult = getCellAggregationResult(params.id, params.field);
    if (cellAggregationResult != null) {
      if (!renderCell) {
        if (cellAggregationResult.position === 'footer') {
          return <GridFooterCell {...params} />;
        }

        return params.formattedValue;
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
    const baseGetApplyFilterFnV7 = operator.getApplyFilterFnV7;

    const getApplyFilterFn: GridFilterOperator<any, any, any>['getApplyFilterFn'] =
      tagInternalFilter((filterItem, colDef) => {
        const filterFn = baseGetApplyFilterFn(filterItem, colDef);
        if (!filterFn) {
          return null;
        }
        return (params) => {
          if (getCellAggregationResult(params.id, params.field) != null) {
            return true;
          }
          return filterFn(params);
        };
      });

    const getApplyFilterFnV7: GridFilterOperator<any, any, any>['getApplyFilterFnV7'] =
      baseGetApplyFilterFnV7 === undefined
        ? undefined
        : tagInternalFilter((filterItem, colDef) => {
            const filterFn = baseGetApplyFilterFnV7(filterItem, colDef);
            if (!filterFn) {
              return null;
            }
            return (value, row, column, api) => {
              if (getCellAggregationResult(apiRef.current.getRowId(row), column.field) != null) {
                return true;
              }
              return filterFn(value, row, column, api);
            };
          });

    return {
      ...operator,
      getApplyFilterFn,
      getApplyFilterFnV7,
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
    const aggregation = { aggregationRule };
    if (renderHeader) {
      return renderHeader({ ...params, aggregation });
    }
    return <GridAggregationHeader {...params} aggregation={aggregation} />;
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
  apiRef: React.MutableRefObject<GridApiPremium>;
  aggregationRule: GridAggregationRule;
}): GridBaseColDef => {
  const getCellAggregationResult = (
    id: GridRowId,
    field: string,
  ): GridAggregationLookup[GridRowId][string] | null => {
    let cellAggregationPosition: GridAggregationPosition | null = null;
    const rowNode = apiRef.current.getRowNode(id)!;

    if (rowNode.type === 'group') {
      cellAggregationPosition = 'inline';
    } else if (id.toString().startsWith('auto-generated-group-footer-')) {
      cellAggregationPosition = 'footer';
    }

    if (cellAggregationPosition == null) {
      return null;
    }

    // TODO: Add custom root id
    const groupId = cellAggregationPosition === 'inline' ? id : rowNode.parent ?? '';

    const aggregationResult = gridAggregationLookupSelector(apiRef)?.[groupId]?.[field];
    if (!aggregationResult || aggregationResult.position !== cellAggregationPosition) {
      return null;
    }

    return aggregationResult;
  };

  let didWrapSomeProperty = false;
  const wrappedColumn: GridColDefWithAggregationWrappers = {
    ...column,
    aggregationWrappedColumn: column,
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
  return (column as GridColDefWithAggregationWrappers).aggregationWrappedColumn ?? column;
};
