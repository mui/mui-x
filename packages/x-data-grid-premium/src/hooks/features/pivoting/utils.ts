import {
  GridColDef,
  GridColumnGroup,
  GridColumnGroupingModel,
  GridColumnNode,
  GridColumnsState,
  GridRowModel,
  isLeaf,
  GridSingleSelectColDef,
  gridStringOrNumberComparator,
  GridLocaleTextApi,
} from '@mui/x-data-grid-pro';
import type { RefObject } from '@mui/x-internals/types';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridAggregationModel } from '../aggregation';
import type { GridApiPremium } from '../../../models/gridApiPremium';
import { isGroupingColumn } from '../rowGrouping';
import type { GridPivotingPropsOverrides, GridPivotModel } from './gridPivotingInterfaces';
import { unwrapColumnFromAggregation } from '../aggregation/wrapColumnWithAggregation';

const columnGroupIdSeparator = '>->';

export const isPivotingAvailable = (
  props: Pick<DataGridPremiumProcessedProps, 'disablePivoting'>,
) => {
  return !props.disablePivoting;
};

export const defaultGetPivotDerivedColumns: DataGridPremiumProcessedProps['getPivotDerivedColumns'] =
  (column, getLocaleText) => {
    if (column.type === 'date') {
      const field = column.field;
      return [
        {
          // String column type to avoid formatting the value as 2,025 instead of 2025
          field: `${field}-year`,
          headerName: `${column.headerName} ${getLocaleText('pivotYearColumnHeaderName')}`,
          valueGetter: (value, row) => new Date(row[field]).getFullYear(),
        },

        {
          field: `${field}-quarter`,
          headerName: `${column.headerName} ${getLocaleText('pivotQuarterColumnHeaderName')}`,
          valueGetter: (value, row) => `Q${Math.floor(new Date(row[field]).getMonth() / 3) + 1}`,
        },
      ];
    }

    return undefined;
  };

export const getInitialColumns = (
  orderedFields: GridColumnsState['orderedFields'],
  lookup: GridColumnsState['lookup'],
  getPivotDerivedColumns: DataGridPremiumProcessedProps['getPivotDerivedColumns'],
  getLocaleText: GridLocaleTextApi['getLocaleText'],
) => {
  const initialColumns: Map<string, GridColDef> = new Map();
  for (let i = 0; i < orderedFields.length; i += 1) {
    const field = orderedFields[i];
    const column = unwrapColumnFromAggregation(lookup[field]);
    if (!isGroupingColumn(field)) {
      initialColumns.set(field, column);

      const derivedColumns = getPivotDerivedColumns?.(column, getLocaleText);
      if (derivedColumns) {
        derivedColumns.forEach((col) => initialColumns.set(col.field, col));
      }
    }
  }

  return initialColumns;
};

function sortColumnGroups(
  columnGroups: GridColumnNode[],
  pivotModelColumns: GridPivotModel['columns'],
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

export const getPivotedData = ({
  rows,
  columns,
  pivotModel,
  apiRef,
  pivotingColDef,
}: {
  rows: GridRowModel[];
  columns: Map<string, GridColDef>;
  pivotModel: GridPivotModel;
  apiRef: RefObject<GridApiPremium>;
  pivotingColDef: DataGridPremiumProcessedProps['pivotingColDef'];
}): GridPivotingPropsOverrides => {
  const visibleColumns = pivotModel.columns.filter((column) => !column.hidden);
  const visibleRows = pivotModel.rows.filter((row) => !row.hidden);
  const visibleValues = pivotModel.values.filter((value) => !value.hidden);

  let pivotColumns: GridColDef[] = [];
  const columnVisibilityModel: DataGridPremiumProcessedProps['columnVisibilityModel'] = {};
  const pivotColumnsIncludedInPivotValues: GridColDef[] = [];

  const initialColumns = new Map<string, GridColDef>();
  for (const column of columns.values()) {
    if (!isGroupingColumn(column.field)) {
      initialColumns.set(column.field, column);

      const pivotValueIndex = visibleValues.findIndex(({ field }) => field === column.field);
      const isVisiblePivotValueField = pivotValueIndex !== -1;

      const columnToAdd = {
        ...column,
        aggregable: false,
        groupable: false,
        hideable: false,
        editable: false,
        disableReorder: true,
      };

      if (isVisiblePivotValueField) {
        // Store columns that are used as pivot values in a temporary array to keep them in the same order as in pivotModel.values, not in the order of the initial columns.
        // `pivotColumnsIncludedInPivotValues` is concatenated to pivotColumns later.
        pivotColumnsIncludedInPivotValues[pivotValueIndex] = columnToAdd;
      } else {
        pivotColumns.push(columnToAdd);
      }
      columnVisibilityModel[column.field] = false;
    }
  }

  pivotColumns = pivotColumns.concat(pivotColumnsIncludedInPivotValues);

  const getAttributesFromInitialColumn = (field: string) => {
    const initialColumn = initialColumns.get(field);
    if (!initialColumn) {
      return undefined;
    }

    const attributes: Partial<GridColDef> = {
      width: initialColumn.width,
      minWidth: initialColumn.minWidth,
      maxWidth: initialColumn.maxWidth,
      valueFormatter: initialColumn.valueFormatter,
      headerName: initialColumn.headerName,
      renderCell: initialColumn.renderCell,
    };

    return attributes;
  };

  const aggregationModel: GridAggregationModel = {};

  const columnGroupingModel: GridColumnGroupingModel = [];
  const columnGroupingModelLookup = new Map<string, GridColumnGroup>();

  let newRows: GridRowModel[] = [];

  if (visibleColumns.length === 0) {
    newRows = rows;

    visibleValues.forEach((pivotValue) => {
      aggregationModel[pivotValue.field] = pivotValue.aggFunc;
      delete columnVisibilityModel[pivotValue.field];
    });
  } else {
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const newRow = { ...row };
      const columnGroupPath: string[] = [];

      visibleColumns.forEach(({ field: colGroupField }, depth) => {
        const column = initialColumns.get(colGroupField);
        if (!column) {
          return;
        }
        let colValue = apiRef.current.getRowValue(row, column) ?? '(No value)';
        if (column.type === 'singleSelect') {
          const singleSelectColumn = column as GridSingleSelectColDef;
          if (singleSelectColumn.getOptionLabel) {
            colValue = singleSelectColumn.getOptionLabel(colValue);
          }
        }
        columnGroupPath.push(String(colValue));
        const groupId = columnGroupPath.join(columnGroupIdSeparator);

        if (!columnGroupingModelLookup.has(groupId)) {
          const columnGroup: GridColumnGroupingModel[number] = {
            groupId,
            headerName: String(colValue),
            children: [],
          };
          columnGroupingModelLookup.set(groupId, columnGroup);
          if (depth === 0) {
            columnGroupingModel.push(columnGroup);
          } else {
            const parentGroupId = columnGroupPath.slice(0, -1).join(columnGroupIdSeparator);
            const parentGroup = columnGroupingModelLookup.get(parentGroupId);
            if (parentGroup) {
              parentGroup.children.push(columnGroup);
            }
          }
        }

        const isLastColumnGroupLevel = depth === visibleColumns.length - 1;

        if (isLastColumnGroupLevel) {
          visibleValues.forEach((pivotValue) => {
            const valueField = pivotValue.field;
            const originalColumn = initialColumns.get(valueField);
            if (!originalColumn) {
              return;
            }
            const valueKey = `${columnGroupPath.join(columnGroupIdSeparator)}${columnGroupIdSeparator}${valueField}`;
            newRow[valueKey] = apiRef.current.getRowValue(row, originalColumn);
            delete newRow[valueField];
          });
        }
      });

      newRows.push(newRow);
    }

    sortColumnGroups(columnGroupingModel, visibleColumns);
  }

  function createColumns(columnGroups: GridColumnNode[], depth = 0) {
    for (let i = 0; i < columnGroups.length; i += 1) {
      const columnGroup = columnGroups[i];
      if (isLeaf(columnGroup)) {
        continue;
      }
      const isLastColumnGroupLevel = depth === visibleColumns.length - 1;
      if (isLastColumnGroupLevel) {
        if (visibleValues.length === 0) {
          // If there are no visible values, there are no actual columns added to the data grid, which leads to column groups not being visible.
          // Adding an empty column to each column group ensures that the column groups are visible.
          const emptyColumnField = `${columnGroup.groupId}${columnGroupIdSeparator}empty`;
          const emptyColumn: GridColDef = {
            field: emptyColumnField,
            headerName: '',
            sortable: false,
            filterable: false,
            groupable: false,
            aggregable: false,
            hideable: false,
            disableColumnMenu: true,
          };
          pivotColumns.push(emptyColumn);
          if (columnGroup) {
            columnGroup.children.push({ field: emptyColumnField });
          }
        } else {
          visibleValues.forEach((pivotValue) => {
            const valueField = pivotValue.field;
            const mapValueKey = `${columnGroup.groupId}${columnGroupIdSeparator}${valueField}`;
            const overrides =
              typeof pivotingColDef === 'function'
                ? pivotingColDef(valueField, columnGroup.groupId.split(columnGroupIdSeparator))
                : pivotingColDef;
            const column: GridColDef = {
              headerName: String(valueField),
              ...getAttributesFromInitialColumn(pivotValue.field),
              ...overrides,
              field: mapValueKey,
              aggregable: false,
              groupable: false,
              filterable: false,
              hideable: false,
              editable: false,
              disableReorder: true,
              availableAggregationFunctions: [pivotValue.aggFunc],
            };
            pivotColumns.push(column);
            aggregationModel[mapValueKey] = pivotValue.aggFunc;
            if (columnGroup) {
              columnGroup.children.push({ field: mapValueKey });
            }
          });
        }
      } else {
        createColumns(columnGroup.children, depth + 1);
      }
    }
  }

  createColumns(columnGroupingModel);

  return {
    rows: visibleRows.length > 0 ? newRows : [],
    columns: pivotColumns,
    rowGroupingModel: visibleRows.map((row) => row.field),
    aggregationModel,
    getAggregationPosition: (groupNode) => (groupNode.depth === -1 ? 'footer' : 'inline'),
    columnVisibilityModel,
    columnGroupingModel,
    groupingColDef: {
      filterable: false,
      aggregable: false,
      hideable: false,
    },
  };
};
