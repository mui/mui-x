import * as React from 'react';
import { GridColDef, GridRowId, GridRowTreeNodeConfig } from '@mui/x-data-grid-pro';
import { isFunction } from '@mui/x-data-grid-pro/internals';
import { GridApiPremium } from '../../../models/gridApiPremium';
import {
  GridAggregationCellMeta,
  GridAggregationPosition,
  GridColumnAggregationRules,
} from './gridAggregationInterfaces';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { gridAggregationLookupSelector } from './gridAggregationSelectors';

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
  apiRef,
  valueGetter,
  getCellAggregationPosition,
}: {
  apiRef: React.MutableRefObject<GridApiPremium>;
  valueGetter: GridColDef['valueGetter'];
  getCellAggregationPosition: (id: GridRowId) => GridAggregationPosition | null;
}): AggregationWrappedColDefProperty<'valueGetter'> => {
  const wrappedValueGetter: AggregationWrappedColDefProperty<'valueGetter'> = (params) => {
    const cellAggregationPosition = getCellAggregationPosition(params.id);
    if (cellAggregationPosition === 'inline') {
      return gridAggregationLookupSelector(apiRef)[params.id]?.[params.field]?.inline ?? null;
    }
    if (cellAggregationPosition === 'footer') {
      // TODO: Add custom root id
      return (
        gridAggregationLookupSelector(apiRef)[params.rowNode.parent ?? '']?.[params.field]
          ?.footer ?? null
      );
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
  columnAggregationRules,
  getCellAggregationPosition,
}: {
  valueFormatter: GridColDef['valueFormatter'];
  columnAggregationRules: GridColumnAggregationRules;
  getCellAggregationPosition: (id: GridRowId) => GridAggregationPosition | null;
}): AggregationWrappedColDefProperty<'valueFormatter'> | undefined => {
  // If neither the inline aggregation function nor the footer aggregation function have a custom value formatter,
  // Then we don't wrap the column value formatter
  if (
    !columnAggregationRules.inline?.aggregationFunction.valueFormatter &&
    !columnAggregationRules.footer?.aggregationFunction.valueFormatter
  ) {
    return valueFormatter;
  }

  const wrappedValueFormatter: AggregationWrappedColDefProperty<'valueFormatter'> = (params) => {
    if (params.id != null) {
      const cellAggregationPosition = getCellAggregationPosition(params.id);

      if (
        cellAggregationPosition === 'inline' &&
        columnAggregationRules.inline?.aggregationFunction.valueFormatter
      ) {
        return columnAggregationRules.inline.aggregationFunction.valueFormatter(params);
      }

      if (
        cellAggregationPosition === 'footer' &&
        columnAggregationRules.footer?.aggregationFunction.valueFormatter
      ) {
        return columnAggregationRules.footer.aggregationFunction.valueFormatter(params);
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
  columnAggregationRules,
  getCellAggregationPosition,
}: {
  renderCell: GridColDef['renderCell'];
  columnAggregationRules: GridColumnAggregationRules;
  getCellAggregationPosition: (id: GridRowId) => GridAggregationPosition | null;
}): AggregationWrappedColDefProperty<'renderCell'> | undefined => {
  if (!renderCell) {
    return undefined;
  }

  const wrappedRenderCell: AggregationWrappedColDefProperty<'renderCell'> = (params) => {
    const cellAggregationPosition = getCellAggregationPosition(params.id);
    if (cellAggregationPosition && columnAggregationRules[cellAggregationPosition]) {
      const aggregationMeta: GridAggregationCellMeta = {
        hasCellUnit:
          columnAggregationRules[cellAggregationPosition]!.aggregationFunction.hasCellUnit ?? true,
        aggregationFunctionName:
          columnAggregationRules[cellAggregationPosition]!.aggregationFunctionName,
      };

      return renderCell({ ...params, aggregation: aggregationMeta });
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
  getCellAggregationPosition,
}: {
  filterOperators: GridColDef['filterOperators'];
  getCellAggregationPosition: (id: GridRowId) => GridAggregationPosition | null;
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
          if (getCellAggregationPosition(params.id)) {
            return true;
          }

          return originalFn(params);
        };
      },
    };
  });

const getAggregationLabelWrappedValueGetter = ({
  apiRef,
  valueGetter,
  getCellAggregationPosition,
  aggregationFooterLabel,
  shouldRenderLabel,
}: {
  apiRef: React.MutableRefObject<GridApiPremium>;
  valueGetter: GridColDef['valueGetter'];
  getCellAggregationPosition: (id: GridRowId) => GridAggregationPosition | null;
  aggregationFooterLabel: DataGridPremiumProcessedProps['aggregationFooterLabel'];
  shouldRenderLabel: (groupNode: GridRowTreeNodeConfig | null) => boolean;
}): AggregationWrappedColDefProperty<'valueGetter'> => {
  const wrappedValueGetter: AggregationWrappedColDefProperty<'valueGetter'> = (params) => {
    const cellAggregationPosition = getCellAggregationPosition(params.id);
    if (cellAggregationPosition === 'footer') {
      const groupNode =
        params.rowNode.parent == null ? null : apiRef.current.getRowNode(params.rowNode.parent);

      if (!shouldRenderLabel(groupNode)) {
        return '';
      }

      if (isFunction(aggregationFooterLabel)) {
        return aggregationFooterLabel(groupNode);
      }

      return aggregationFooterLabel ?? '';
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

/**
 * Add a wrapper around each wrappable property of the column to customize the behavior of the aggregation cells.
 */
export const wrapColumnWithAggregationValue = ({
  column,
  apiRef,
  columnAggregationRules,
  isGroupAggregated,
}: {
  column: GridColDef;
  apiRef: React.MutableRefObject<GridApiPremium>;
  columnAggregationRules: GridColumnAggregationRules;
  isGroupAggregated: DataGridPremiumProcessedProps['isGroupAggregated'];
}): GridColDef => {
  const getCellAggregationPosition = (id: GridRowId): GridAggregationPosition | null => {
    const isGroup = id.toString().startsWith('auto-generated-row-');

    if (isGroup) {
      if (isGroupAggregated && !isGroupAggregated(apiRef.current.getRowNode(id), 'inline')) {
        return null;
      }

      return 'inline';
    }

    const isFooter = id.toString().startsWith('auto-generated-group-footer-');
    if (isFooter) {
      if (!isGroupAggregated) {
        return 'footer';
      }

      const rowNode = apiRef.current.getRowNode(id)!;
      const parentRowNode =
        rowNode.parent == null ? null : apiRef.current.getRowNode(rowNode.parent);

      if (!isGroupAggregated(parentRowNode, 'footer')) {
        return null;
      }

      return 'footer';
    }

    return null;
  };

  return {
    ...column,
    valueGetter: getAggregationValueWrappedValueGetter({
      apiRef,
      valueGetter: column.valueGetter,
      getCellAggregationPosition,
    }),
    valueFormatter: getAggregationValueWrappedValueFormatter({
      valueFormatter: column.valueFormatter,
      columnAggregationRules,
      getCellAggregationPosition,
    }),
    renderCell: getAggregationValueWrappedRenderCell({
      renderCell: column.renderCell,
      columnAggregationRules,
      getCellAggregationPosition,
    }),
    filterOperators: getWrappedFilterOperators({
      filterOperators: column.filterOperators,
      getCellAggregationPosition,
    }),
  };
};

/**
 * Add a wrapper around each wrappable property of the column to customize the behavior of the aggregation label cells.
 */
export const wrapColumnWithAggregationLabel = ({
  column,
  apiRef,
  isGroupAggregated,
  aggregationFooterLabel,
  shouldRenderLabel,
}: {
  column: GridColDef;
  apiRef: React.MutableRefObject<GridApiPremium>;
  isGroupAggregated: DataGridPremiumProcessedProps['isGroupAggregated'];
  aggregationFooterLabel: DataGridPremiumProcessedProps['aggregationFooterLabel'];
  shouldRenderLabel: (groupNode: GridRowTreeNodeConfig | null) => boolean;
}): GridColDef => {
  const getCellAggregationPosition = (id: GridRowId): GridAggregationPosition | null => {
    const isFooter = id.toString().startsWith('auto-generated-group-footer-');
    if (isFooter) {
      if (!isGroupAggregated) {
        return 'footer';
      }

      const rowNode = apiRef.current.getRowNode(id)!;
      const parentRowNode =
        rowNode.parent == null ? null : apiRef.current.getRowNode(rowNode.parent);

      if (!isGroupAggregated(parentRowNode, 'footer')) {
        return null;
      }

      return 'footer';
    }

    return null;
  };

  return {
    ...column,
    valueGetter: getAggregationLabelWrappedValueGetter({
      apiRef,
      valueGetter: column.valueGetter,
      getCellAggregationPosition,
      shouldRenderLabel,
      aggregationFooterLabel,
    }),
    filterOperators: getWrappedFilterOperators({
      filterOperators: column.filterOperators,
      getCellAggregationPosition,
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
