import type { RefObject } from '@mui/x-internals/types';
import { type GridColDef, type GridRowId, gridRowNodeSelector } from '@mui/x-data-grid-pro';
import {
  type GridBaseColDef,
  type GridAggregationCellMeta,
  type GridAggregationPosition,
  GridFooterCell,
} from '@mui/x-data-grid-pro/internals';
import type { GridApiPremium } from '../../../models/gridApiPremium';
import type { GridAggregationLookup, GridAggregationRule } from './gridAggregationInterfaces';
import { gridAggregationLookupSelector } from './gridAggregationSelectors';
import { GridAggregationHeader } from '../../../components/GridAggregationHeader';
import { gridPivotActiveSelector } from '../pivoting/gridPivotingSelectors';

type WrappableColumnProperty = 'renderCell' | 'renderHeader';

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
        position: cellAggregationResult.position,
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
export const wrapColumnWithAggregationValue = (
  column: GridBaseColDef,
  aggregationRule: GridAggregationRule,
  apiRef: RefObject<GridApiPremium>,
): GridBaseColDef => {
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

  wrapColumnProperty('renderCell', getAggregationValueWrappedRenderCell);
  wrapColumnProperty('renderHeader', getWrappedRenderHeader);

  if (!didWrapSomeProperty) {
    return column;
  }

  return wrappedColumn;
};

const isColumnWrappedWithAggregation = (
  column: GridColDef,
): column is GridColDefWithAggregationWrappers => {
  return (
    typeof (column as GridColDefWithAggregationWrappers).aggregationWrappedProperties !==
    'undefined'
  );
};

/**
 * Remove the aggregation wrappers around the wrappable properties of the column.
 */
export const unwrapColumnFromAggregation = (column: GridColDef) => {
  if (!isColumnWrappedWithAggregation(column)) {
    return column;
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
