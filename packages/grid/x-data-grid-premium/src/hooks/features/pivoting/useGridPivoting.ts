import * as React from 'react';
import {
  GridColDef,
  GridColumnGroup,
  GridColumnGroupingModel,
  GridColumnNode,
  GridRowModel,
  gridFilteredRowsLookupSelector,
  gridStringOrNumberComparator,
  isLeaf,
} from '@mui/x-data-grid-pro';
import { GridInitialStatePremium } from '../../../models/gridStatePremium';
import {
  DataGridPremiumProps,
  DataGridPremiumProcessedProps,
} from '../../../models/dataGridPremiumProps';
import { GridAggregationModel } from '../aggregation';
import { GridApiPremium } from '../../../models/gridApiPremium';

export interface PivotModel {
  columns: { field: GridColDef['field']; sort?: 'asc' | 'desc' }[];
  rows: GridColDef['field'][];
  values: {
    field: GridColDef['field'];
    aggFunc: string;
  }[];
}

function getFieldValue(row: GridRowModel, field: GridColDef['field']) {
  // TODO: valueGetter
  return row[field];
}

function sortColumnGroups(
  columnGroups: GridColumnNode[],
  pivotModelColumns: PivotModel['columns'],
  depth = 0,
) {
  if (depth > pivotModelColumns.length - 1) {
    return;
  }
  const sort = pivotModelColumns[depth].sort || 'asc';
  columnGroups.sort((a, b) => {
    if (isLeaf(a) || isLeaf(b)) {
      return 0;
    }
    if (a.children) {
      sortColumnGroups(a.children, pivotModelColumns, depth + 1);
    }
    if (b.children) {
      sortColumnGroups(b.children, pivotModelColumns, depth + 1);
    }
    return (
      (sort === 'asc' ? 1 : -1) *
      gridStringOrNumberComparator(a.headerName, b.headerName, {} as any, {} as any)
    );
  });
}

const getPivotedData = ({
  rows,
  // columns,
  pivotModel,
  apiRef,
}: {
  rows: GridRowModel[];
  columns: GridColDef[];
  pivotModel: PivotModel;
  apiRef: React.MutableRefObject<GridApiPremium>;
}): {
  rows: DataGridPremiumProcessedProps['rows'];
  columns: DataGridPremiumProcessedProps['columns'];
  rowGroupingModel: NonNullable<DataGridPremiumProcessedProps['rowGroupingModel']>;
  aggregationModel: NonNullable<DataGridPremiumProcessedProps['aggregationModel']>;
  getAggregationPosition: NonNullable<DataGridPremiumProcessedProps['getAggregationPosition']>;
  columnVisibilityModel: NonNullable<DataGridPremiumProcessedProps['columnVisibilityModel']>;
  columnGroupingModel: NonNullable<DataGridPremiumProcessedProps['columnGroupingModel']>;
  unstable_pivotMode: NonNullable<DataGridPremiumProcessedProps['unstable_pivotMode']>;
} => {
  const pivotColumns: GridColDef[] = [];
  const columnVisibilityModel: DataGridPremiumProcessedProps['columnVisibilityModel'] = {};
  const filteredRowsLookup = apiRef.current.state ? gridFilteredRowsLookupSelector(apiRef) : null;

  pivotModel.rows.forEach((field) => {
    pivotColumns.push({
      field,
      groupable: true,
    });
    columnVisibilityModel[field] = false;
  });

  const aggregationModel: GridAggregationModel = {};

  const columnGroupingModel: GridColumnGroupingModel = [];
  // Use lookup for faster access to column groups
  const columnGroupingModelLookup: Record<string, GridColumnGroup> = {};

  let newRows: GridRowModel[] = [];

  if (pivotModel.columns.length === 0) {
    newRows = rows;

    pivotModel.values.forEach((pivotValue) => {
      pivotColumns.push({
        field: pivotValue.field,
        aggregable: true,
        availableAggregationFunctions: [pivotValue.aggFunc],
      });
      aggregationModel[pivotValue.field] = pivotValue.aggFunc;
    });
  } else {
    rows.forEach((row) => {
      if (filteredRowsLookup) {
        const isRowFiltered = filteredRowsLookup[row.id];
        if (!isRowFiltered) {
          return;
        }
      }
      const newRow = { ...row };
      const columnGroupPath: string[] = [];

      pivotModel.columns.forEach(({ field: colGroupField }, depth) => {
        const colValue = getFieldValue(row, colGroupField) || '(No value)';
        columnGroupPath.push(String(colValue));
        const groupId = columnGroupPath.join('-');

        if (!columnGroupingModelLookup[groupId]) {
          const columnGroup: GridColumnGroupingModel[number] = {
            groupId,
            headerName: String(colValue),
            children: [],
          };
          columnGroupingModelLookup[groupId] = columnGroup;
          if (depth === 0) {
            columnGroupingModel.push(columnGroup);
          } else {
            const parentGroupId = columnGroupPath.slice(0, -1).join('-');
            const parentGroup = columnGroupingModelLookup[parentGroupId];
            parentGroup.children.push(columnGroup);
          }

          const isLastColumnGroupLevel = depth === pivotModel.columns.length - 1;

          if (isLastColumnGroupLevel) {
            pivotModel.values.forEach((pivotValue) => {
              const valueField = pivotValue.field;
              const valueKey = `${columnGroupPath.join('-')}-${valueField}`;
              newRow[valueKey] = newRow[valueField];
              delete newRow[valueField];
            });
          }
        }
      });

      newRows.push(newRow);
    });

    sortColumnGroups(columnGroupingModel, pivotModel.columns);
  }

  function createColumns(columnGroups: GridColumnNode[], depth = 0) {
    columnGroups.forEach((columnGroup) => {
      if (isLeaf(columnGroup)) {
        return;
      }
      const isLastColumnGroupLevel = depth === pivotModel.columns.length - 1;
      if (isLastColumnGroupLevel) {
        pivotModel.values.forEach((pivotValue) => {
          const valueField = pivotValue.field;
          const mapValueKey = `${columnGroup.groupId}-${valueField}`;
          pivotColumns.push({
            field: mapValueKey,
            headerName: String(valueField),
            aggregable: true,
            availableAggregationFunctions: [pivotValue.aggFunc],
          });
          aggregationModel[mapValueKey] = pivotValue.aggFunc;
          if (columnGroup) {
            columnGroup.children.push({ field: mapValueKey });
          }
        });
      } else {
        createColumns(columnGroup.children, depth + 1);
      }
    });
  }

  createColumns(columnGroupingModel);

  return {
    rows: newRows,
    columns: pivotColumns,
    rowGroupingModel: pivotModel.rows,
    aggregationModel,
    getAggregationPosition: (groupNode) => (groupNode.depth === -1 ? 'footer' : 'inline'),
    columnVisibilityModel,
    columnGroupingModel,
    unstable_pivotMode: true,
  };
};

export const useGridPivoting = ({
  initialIsPivot = false,
  columns,
  rows,
  pivotModel,
  apiRef,
}: {
  initialIsPivot?: boolean;
  rows: GridRowModel[];
  columns: GridColDef[];
  pivotModel: PivotModel;
  apiRef: React.MutableRefObject<GridApiPremium>;
}) => {
  const [isPivot, setIsPivot] = React.useState(initialIsPivot);
  const exportedStateRef = React.useRef<GridInitialStatePremium | null>(null);

  const props = React.useMemo(() => {
    if (isPivot) {
      if (apiRef.current.exportState) {
        exportedStateRef.current = apiRef.current.exportState();
      }
      return getPivotedData({
        rows,
        columns,
        pivotModel,
        apiRef,
      });
    }

    const nonPivotProps: {
      rows: DataGridPremiumProps['rows'];
      columns: DataGridPremiumProps['columns'];
      initialState?: DataGridPremiumProps['initialState'];
    } = { rows, columns };
    if (exportedStateRef.current) {
      nonPivotProps.initialState = exportedStateRef.current;
    }
    return nonPivotProps;
  }, [isPivot, columns, rows, pivotModel, apiRef]);

  return {
    isPivot,
    setIsPivot,
    props,
  };
};
