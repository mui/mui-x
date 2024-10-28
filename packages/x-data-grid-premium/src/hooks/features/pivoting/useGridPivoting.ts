import * as React from 'react';
import {
  GridColDef,
  GridColumnGroup,
  GridColumnGroupingModel,
  GridColumnNode,
  GridRowModel,
  gridColumnDefinitionsSelector,
  gridDataRowIdsSelector,
  gridFilteredRowsLookupSelector,
  gridRowsLookupSelector,
  gridStringOrNumberComparator,
  isLeaf,
} from '@mui/x-data-grid-pro';
import { usePreviousProps } from '@mui/utils';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { GridInitialStatePremium } from '../../../models/gridStatePremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridAggregationModel } from '../aggregation';
import { GridApiPremium } from '../../../models/gridApiPremium';

export interface PivotModel {
  columns: { field: GridColDef['field']; sort?: 'asc' | 'desc' }[];
  rows: {
    field: GridColDef['field'];
  }[];
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
  const sort = pivotModelColumns[depth].sort;
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
    if (sort === undefined) {
      return 0;
    }
    return (
      (sort === 'asc' ? 1 : -1) *
      gridStringOrNumberComparator(a.headerName, b.headerName, {} as any, {} as any)
    );
  });
}

const getPivotedData = ({
  rows,
  columns,
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
} => {
  const pivotColumns: GridColDef[] = [];
  const columnVisibilityModel: DataGridPremiumProcessedProps['columnVisibilityModel'] = {};
  const filteredRowsLookup = apiRef.current.state ? gridFilteredRowsLookupSelector(apiRef) : null;

  // Returns the column definition from the initial columns array before pivoting
  const getInitialColumn = (() => {
    const initialColumnsLookup: Record<string, GridColDef | null> = {};

    return (field: string) => {
      if (typeof initialColumnsLookup[field] === 'undefined') {
        initialColumnsLookup[field] = columns.find((column) => column.field === field) || null;
      }
      return initialColumnsLookup[field];
    };
  })();

  const getAttributesFromInitialColumn = (field: string) => {
    const attributes: Partial<GridColDef> = {};
    const initialColumn = getInitialColumn(field);
    if (!initialColumn) {
      return attributes;
    }

    if (initialColumn?.valueFormatter) {
      attributes.valueFormatter = initialColumn.valueFormatter;
    }

    if (initialColumn?.valueGetter) {
      attributes.valueGetter = initialColumn.valueGetter;
    }

    if (initialColumn?.headerName) {
      attributes.headerName = initialColumn.headerName;
    }

    return attributes;
  };

  pivotModel.rows.forEach((pivotRow) => {
    pivotColumns.push({
      field: pivotRow.field,
      groupable: true,
    });
    columnVisibilityModel[pivotRow.field] = false;
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
        ...getAttributesFromInitialColumn(pivotValue.field),
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
          const column: GridColDef = {
            field: mapValueKey,
            headerName: String(valueField),
            aggregable: true,
            availableAggregationFunctions: [pivotValue.aggFunc],
            ...getAttributesFromInitialColumn(pivotValue.field),
          };
          pivotColumns.push(column);
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
    rowGroupingModel: pivotModel.rows.map((row) => row.field),
    aggregationModel,
    getAggregationPosition: (groupNode) => (groupNode.depth === -1 ? 'footer' : 'inline'),
    columnVisibilityModel,
    columnGroupingModel,
  };
};

export const useGridPivoting = ({
  // initialIsPivot = false,
  pivotModel,
  onPivotModelChange,
  apiRef,
  pivotMode,
  onPivotModeChange,
}: {
  // initialIsPivot?: boolean;
  pivotModel: PivotModel;
  onPivotModelChange: React.Dispatch<React.SetStateAction<PivotModel>>;
  apiRef: React.MutableRefObject<GridApiPremium>;
  pivotMode: boolean;
  onPivotModeChange: (isPivot: boolean) => void;
}) => {
  const isPivot = pivotMode;
  const setIsPivot = onPivotModeChange;
  // const [isPivot, setIsPivot] = React.useState(initialIsPivot);
  const [pivotSettingsOpen, setPivotSettingsOpen] = React.useState(false);
  const exportedStateRef = React.useRef<GridInitialStatePremium | null>(null);
  const prevProps = usePreviousProps({ isPivot });
  const nonPivotDataRef = React.useRef<{ rows: GridRowModel[]; columns: GridColDef[] } | undefined>(
    undefined,
  );

  const props = React.useMemo(() => {
    if (isPivot) {
      if (apiRef.current.exportState && prevProps.isPivot === false) {
        exportedStateRef.current = apiRef.current.exportState();

        const rowIds = gridDataRowIdsSelector(apiRef);
        const rowsLookup = gridRowsLookupSelector(apiRef);
        const rows = rowIds.map((id) => rowsLookup[id]);
        const columns = gridColumnDefinitionsSelector(apiRef);

        nonPivotDataRef.current = { rows, columns };
      }

      const { rows, columns } = nonPivotDataRef.current || { rows: [], columns: [] };

      return getPivotedData({
        rows,
        columns,
        pivotModel,
        apiRef,
      });
    }

    return nonPivotDataRef.current;
  }, [isPivot, pivotModel, apiRef, prevProps.isPivot]);

  useEnhancedEffect(() => {
    if (!isPivot) {
      if (nonPivotDataRef.current) {
        const { rows, columns } = nonPivotDataRef.current;
        apiRef.current.setRows(rows);
        apiRef.current.updateColumns(columns);
      }
      if (exportedStateRef.current) {
        apiRef.current.restoreState(exportedStateRef.current);
        exportedStateRef.current = null;
      }
    }
  }, [isPivot, apiRef]);

  return {
    pivotMode,
    onPivotModeChange,
    setIsPivot,
    props,
    pivotModel,
    onPivotModelChange,
    initialColumns: nonPivotDataRef.current?.columns,
    pivotSettingsOpen,
    onPivotSettingsOpenChange: setPivotSettingsOpen,
  };
};
