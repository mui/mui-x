import * as React from 'react';
import { GridColDef, GridRowId } from '@mui/x-data-grid-pro';
import { GridApiPremium } from '../../../models/gridApiPremium';
import {
  GridAggregationCellMeta,
  GridAggregationLookup,
  GridAggregationPosition,
  GridAggregationRule,
} from './gridAggregationInterfaces';
import { gridAggregationLookupSelector } from './gridAggregationSelectors';
import { GridFooterCell } from '../../../components/GridFooterCell';

const AGGREGATION_WRAPPABLE_PROPERTIES = [
  'valueGetter',
  'valueFormatter',
  'renderCell',
  'filterOperators',
] as const;

type AggregationWrappedObject<M extends Function | object> = M & {
  originalMethod?: M;
  isWrappedWithAggregation?: boolean;
};

type AggregationWrappedVariable<M extends Function | object[]> = M extends Function
  ? AggregationWrappedObject<M> | undefined
  : M extends object[]
  ? AggregationWrappedObject<M>[number][]
  : never;

type AggregationWrappedColDefProperty<M extends typeof AGGREGATION_WRAPPABLE_PROPERTIES[number]> =
  AggregationWrappedVariable<NonNullable<GridColDef[M]>>;

const getAggregationValueWrappedValueGetter = ({
  valueGetter,
  getCellAggregationResult,
}: {
  valueGetter: GridColDef['valueGetter'];
  getCellAggregationResult: (
    id: GridRowId,
    field: string,
  ) => GridAggregationLookup[GridRowId][string] | null;
}): AggregationWrappedColDefProperty<'valueGetter'> => {
  const wrappedValueGetter: AggregationWrappedColDefProperty<'valueGetter'> = (params) => {
    const cellAggregationResult = getCellAggregationResult(params.id, params.field);
    if (cellAggregationResult != null) {
      return cellAggregationResult?.value ?? null;
    }

    if (valueGetter) {
      return valueGetter(params);
    }

    return params.row[params.field];
  };

  wrappedValueGetter.isWrappedWithAggregation = true;
  wrappedValueGetter.originalMethod = valueGetter;

  return wrappedValueGetter;
};

const getAggregationValueWrappedValueFormatter = ({
  valueFormatter,
  aggregationRule,
  getCellAggregationResult,
}: {
  valueFormatter: GridColDef['valueFormatter'];
  aggregationRule: GridAggregationRule;
  getCellAggregationResult: (
    id: GridRowId,
    field: string,
  ) => GridAggregationLookup[GridRowId][string] | null;
}): AggregationWrappedColDefProperty<'valueFormatter'> | undefined => {
  // If neither the inline aggregation function nor the footer aggregation function have a custom value formatter,
  // Then we don't wrap the column value formatter
  if (!aggregationRule.aggregationFunction.valueFormatter) {
    return valueFormatter;
  }

  const wrappedValueFormatter: AggregationWrappedColDefProperty<'valueFormatter'> = (params) => {
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

  wrappedValueFormatter.isWrappedWithAggregation = true;
  wrappedValueFormatter.originalMethod = valueFormatter;

  return wrappedValueFormatter;
};

const getAggregationValueWrappedRenderCell = ({
  renderCell,
  aggregationRule,
  getCellAggregationResult,
}: {
  renderCell: GridColDef['renderCell'];
  aggregationRule: GridAggregationRule;
  getCellAggregationResult: (
    id: GridRowId,
    field: string,
  ) => GridAggregationLookup[GridRowId][string] | null;
}): AggregationWrappedColDefProperty<'renderCell'> => {
  const wrappedRenderCell: AggregationWrappedColDefProperty<'renderCell'> = (params) => {
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

  wrappedRenderCell.isWrappedWithAggregation = true;
  wrappedRenderCell.originalMethod = renderCell;

  return wrappedRenderCell;
};

/**
 * Skips the filtering for aggregated rows
 */
const getWrappedFilterOperators = ({
  filterOperators,
  getCellAggregationResult,
}: {
  filterOperators: GridColDef['filterOperators'];
  getCellAggregationResult: (
    id: GridRowId,
    field: string,
  ) => GridAggregationLookup[GridRowId][string] | null;
}): AggregationWrappedColDefProperty<'filterOperators'> =>
  filterOperators!.map((operator) => {
    return {
      ...operator,
      getApplyFilterFn: (filterItem, column) => {
        const originalFn = operator.getApplyFilterFn(filterItem, column);
        if (!originalFn) {
          return null;
        }

        return (params) => {
          if (getCellAggregationResult(params.id, params.field) != null) {
            return true;
          }

          return originalFn(params);
        };
      },
    };
  });

/**
 * Add a wrapper around each wrappable property of the column to customize the behavior of the aggregation cells.
 */
export const wrapColumnWithAggregationValue = ({
  column,
  apiRef,
  aggregationRule,
}: {
  column: GridColDef;
  apiRef: React.MutableRefObject<GridApiPremium>;
  aggregationRule: GridAggregationRule;
}): GridColDef => {
  const getCellAggregationResult = (
    id: GridRowId,
    field: string,
  ): GridAggregationLookup[GridRowId][string] | null => {
    let cellAggregationPosition: GridAggregationPosition | null = null;

    if (id.toString().startsWith('auto-generated-row-')) {
      cellAggregationPosition = 'inline';
    } else if (id.toString().startsWith('auto-generated-group-footer-')) {
      cellAggregationPosition = 'footer';
    }

    if (cellAggregationPosition == null) {
      return null;
    }

    // TODO: Add custom root id
    const groupId =
      cellAggregationPosition === 'inline' ? id : apiRef.current.getRowNode(id)!.parent ?? '';

    const aggregationResult = gridAggregationLookupSelector(apiRef)[groupId]?.[field];
    if (!aggregationResult || aggregationResult.position != cellAggregationPosition) {
      return null;
    }

    return aggregationResult;
  };

  return {
    ...column,
    valueGetter: getAggregationValueWrappedValueGetter({
      valueGetter: column.valueGetter,
      getCellAggregationResult,
    }),
    valueFormatter: getAggregationValueWrappedValueFormatter({
      valueFormatter: column.valueFormatter,
      aggregationRule,
      getCellAggregationResult,
    }),
    renderCell: getAggregationValueWrappedRenderCell({
      renderCell: column.renderCell,
      aggregationRule,
      getCellAggregationResult,
    }),
    filterOperators: getWrappedFilterOperators({
      filterOperators: column.filterOperators,
      getCellAggregationResult,
    }),
  };
};

/**
 * Remove the aggregation wrappers around the wrappable properties of the column.
 */
export const unwrapColumnFromAggregation = ({ column }: { column: GridColDef }) => {
  let hasUnwrappedSomeProperty = false;

  const unwrappedColumn: GridColDef = { ...column };

  AGGREGATION_WRAPPABLE_PROPERTIES.forEach((propertyName) => {
    const propertyValue = unwrappedColumn[propertyName];
    if (propertyValue == null) {
      return;
    }

    if (Array.isArray(propertyValue)) {
      let hasUnwrappedSomeSubProperty = false;
      const unwrappedPropertyValue: any = [];

      propertyValue.forEach((propertySubValue) => {
        if ((propertySubValue as any).isWrappedWithAggregation) {
          hasUnwrappedSomeSubProperty = true;
          unwrappedPropertyValue.push((propertySubValue as any).originalMethod);
        } else {
          unwrappedPropertyValue.push(propertySubValue);
        }

        if (hasUnwrappedSomeSubProperty) {
          hasUnwrappedSomeProperty = true;
          unwrappedColumn[propertyName] = unwrappedPropertyValue;
        }
      });
    }

    if ((propertyValue as any)?.isWrappedWithAggregation) {
      hasUnwrappedSomeProperty = true;
      unwrappedColumn[propertyName] = (propertyValue as any).originalMethod;
    }
  });

  if (!hasUnwrappedSomeProperty) {
    return column;
  }

  return unwrappedColumn;
};
