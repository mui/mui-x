import * as React from 'react';
import {
  GridColDef,
  GridColumnGroup,
  GridColumnGroupingModel,
  GridColumnNode,
  GridRowModel,
  gridColumnDefinitionsSelector,
  gridDataRowIdsSelector,
  gridRowsLoadingSelector,
  gridRowsLookupSelector,
  gridStringOrNumberComparator,
  isLeaf,
} from '@mui/x-data-grid-pro';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useOnMount from '@mui/utils/useOnMount';
import { useMounted } from '@mui/x-internals/useMounted';
// import { usePreviousProps } from '@mui/utils';
import { RefObject } from '@mui/x-internals/types';
import {
  GridStateInitializer,
  useGridApiMethod,
  useGridSelector,
} from '@mui/x-data-grid-pro/internals';
import { GridInitialStatePremium } from '../../../models/gridStatePremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridAggregationModel } from '../aggregation';
import { GridApiPremium, GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { isGroupingColumn } from '../rowGrouping';
import type {
  GridPivotingApi,
  GridPivotingPropsOverrides,
  GridPivotingState,
  GridPivotModel,
} from './gridPivotingInterfaces';
import {
  gridPivotModelSelector,
  gridPivotEnabledSelector,
  gridPivotPanelOpenSelector,
} from './gridPivotingSelectors';
import { isPivotingEnabled as isPivotingEnabledFn } from './utils';

const emptyPivotModel: GridPivotModel = { rows: [], columns: [], values: [] };

export const pivotingStateInitializer: GridStateInitializer<
  Pick<
    DataGridPremiumProcessedProps,
    | 'pivotEnabled'
    | 'pivotModel'
    | 'pivotPanelOpen'
    | 'initialState'
    | 'experimentalFeatures'
    | 'disablePivoting'
  >
> = (state, props) => {
  if (!isPivotingEnabledFn(props)) {
    return {
      ...state,
      pivoting: {
        enabled: false,
        model: emptyPivotModel,
        panelOpen: false,
      } as GridPivotingState,
    };
  }

  return {
    ...state,
    pivoting: {
      enabled: props.pivotEnabled ?? props.initialState?.pivoting?.enabled ?? false,
      model: props.pivotModel ?? props.initialState?.pivoting?.model ?? emptyPivotModel,
      panelOpen: props.pivotPanelOpen ?? props.initialState?.pivoting?.panelOpen ?? false,
    } as GridPivotingState,
  };
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

const getPivotedData = ({
  rows,
  columns,
  pivotModel,
  apiRef,
}: {
  rows: GridRowModel[];
  columns: GridColDef[];
  pivotModel: GridPivotModel;
  apiRef: RefObject<GridApiPremium>;
}): GridPivotingPropsOverrides => {
  const visibleColumns = pivotModel.columns.filter((column) => !column.hidden);
  const visibleRows = pivotModel.rows.filter((row) => !row.hidden);
  const visibleValues = pivotModel.values.filter((value) => !value.hidden);

  const pivotColumns: GridColDef[] = [];
  const columnVisibilityModel: DataGridPremiumProcessedProps['columnVisibilityModel'] = {};

  const initialColumns = new Map<string, GridColDef>();
  for (let i = 0; i < columns.length; i += 1) {
    const column = columns[i];
    if (!isGroupingColumn(column.field)) {
      initialColumns.set(column.field, column);
      pivotColumns.push(column);
      columnVisibilityModel[column.field] = false;
    }
  }

  const getAttributesFromInitialColumn = (field: string) => {
    const attributes: Partial<GridColDef> = {};
    const initialColumn = initialColumns.get(field);
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

  visibleRows.forEach((pivotRow) => {
    pivotColumns.push({
      field: pivotRow.field,
      groupable: true,
    });
    columnVisibilityModel[pivotRow.field] = false;
  });

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
        const colValue = apiRef.current.getRowValue(row, column!) || '(No value)';
        columnGroupPath.push(String(colValue));
        const groupId = columnGroupPath.join('-');

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
            const parentGroupId = columnGroupPath.slice(0, -1).join('-');
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
            const valueKey = `${columnGroupPath.join('-')}-${valueField}`;
            newRow[valueKey] = newRow[valueField];
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
        visibleValues.forEach((pivotValue) => {
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
    }
  }

  createColumns(columnGroupingModel);

  return {
    rows: newRows,
    columns: pivotColumns,
    rowGroupingModel: visibleRows.map((row) => row.field),
    aggregationModel,
    getAggregationPosition: (groupNode) => (groupNode.depth === -1 ? 'footer' : 'inline'),
    columnVisibilityModel,
    columnGroupingModel,
  };
};

export const useGridPivoting = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'pivotEnabled'
    | 'onPivotEnabledChange'
    | 'pivotModel'
    | 'onPivotModelChange'
    | 'pivotPanelOpen'
    | 'onPivotPanelOpenChange'
    | 'experimentalFeatures'
    | 'disablePivoting'
  >,
) => {
  const isPivot = useGridSelector(apiRef, gridPivotEnabledSelector);
  const exportedStateRef = React.useRef<GridInitialStatePremium | null>(null);
  const nonPivotDataRef = React.useRef<{ rows: GridRowModel[]; columns: GridColDef[] } | undefined>(
    undefined,
  );

  const isPivotingEnabled = isPivotingEnabledFn(props);

  apiRef.current.registerControlState({
    stateId: 'pivotModel',
    propModel: props.pivotModel,
    propOnChange: props.onPivotModelChange,
    stateSelector: gridPivotModelSelector,
    changeEvent: 'pivotModelChange',
  });

  apiRef.current.registerControlState({
    stateId: 'pivotMode',
    propModel: props.pivotEnabled,
    propOnChange: props.onPivotEnabledChange,
    stateSelector: gridPivotEnabledSelector,
    changeEvent: 'pivotModeChange',
  });

  apiRef.current.registerControlState({
    stateId: 'pivotPanelOpen',
    propModel: props.pivotPanelOpen,
    propOnChange: props.onPivotPanelOpenChange,
    stateSelector: gridPivotPanelOpenSelector,
    changeEvent: 'pivotPanelOpenChange',
  });

  const isMounted = useMounted();

  const [isLoading, setIsLoading] = React.useState(true);
  useOnMount(() => {
    return apiRef.current?.store.subscribe(() => {
      const loading = gridRowsLoadingSelector(apiRef);
      if (typeof loading !== 'undefined') {
        setIsLoading(loading);
      }
    });
  });

  // const prevProps = usePreviousProps({ isPivot });

  const getInitialData = React.useCallback(() => {
    exportedStateRef.current = apiRef.current.exportState();

    const rowIds = gridDataRowIdsSelector(apiRef);
    const rowsLookup = gridRowsLookupSelector(apiRef);
    const rows = rowIds.map((id) => rowsLookup[id]);
    const columns = gridColumnDefinitionsSelector(apiRef);

    const initialColumns: GridColDef[] = [];
    for (let i = 0; i < columns.length; i += 1) {
      const column = columns[i];
      const field = column.field;
      if (!isGroupingColumn(field)) {
        initialColumns.push(column);

        if (column.type === 'date') {
          initialColumns.push({
            field: `${field}-year`,
            headerName: `${column.headerName} (Year)`,
            type: 'number',
            valueGetter: (value, row) => new Date(row[field]).getFullYear(),
          });

          initialColumns.push({
            field: `${field}-quarter`,
            headerName: `${column.headerName} (Quarter)`,
            valueGetter: (value, row) => `Q${Math.floor(new Date(row[field]).getMonth() / 3) + 1}`,
          });
        }
      }
    }

    return { rows, columns: initialColumns };

    // nonPivotDataRef.current = { rows, columns: initialColumns };
  }, [apiRef]);

  const computePivotingState = React.useCallback(
    ({ enabled, model: pivotModel }: Pick<GridPivotingState, 'enabled' | 'model'>) => {
      if (isMounted && !isLoading && enabled && pivotModel) {
        // if (apiRef.current && (prevProps.isPivot === false || !nonPivotDataRef.current)) {
        // eslint-disable-next-line no-constant-condition

        const { rows, columns } = nonPivotDataRef.current || { rows: [], columns: [] };

        return {
          initialColumns: columns,
          propsOverrides: getPivotedData({
            rows,
            columns,
            pivotModel,
            apiRef: apiRef as RefObject<GridApiPremium>,
          }),
        };
      }

      // return nonPivotDataRef.current;
      return undefined;
    },
    [isMounted, isLoading, apiRef],
  );

  useEnhancedEffect(() => {
    if (!isPivotingEnabled) {
      return;
    }
    if (isPivot) {
      nonPivotDataRef.current = getInitialData();
      apiRef.current.setState((state) => {
        const pivotingState = {
          ...state.pivoting,
          // initialColumns: nonPivotDataRef.current?.columns.filter(
          //   (column) => !isGroupingColumn(column.field),
          // ),
          ...computePivotingState(state.pivoting),
        };
        return {
          ...state,
          pivoting: pivotingState,
        };
      });
    } else {
      if (nonPivotDataRef.current) {
        // const { rows, columns } = nonPivotDataRef.current;
        // apiRef.current.setRows(rows);
        // apiRef.current.updateColumns(columns);
      }
      if (exportedStateRef.current) {
        apiRef.current.restoreState(exportedStateRef.current);
        exportedStateRef.current = null;
      }
    }
  }, [isPivot, apiRef, isPivotingEnabled, getInitialData, computePivotingState]);

  const setPivotModel = React.useCallback<GridPivotingApi['setPivotModel']>(
    (callback) => {
      if (!isPivotingEnabled) {
        return;
      }
      apiRef.current.setState((state) => {
        const newPivotModel =
          typeof callback === 'function' ? callback(state.pivoting?.model) : callback;
        const newPivotingState: GridPivotingState = {
          ...state.pivoting,
          ...computePivotingState({
            ...state.pivoting,
            model: newPivotModel,
          }),
          model: newPivotModel,
        };
        return {
          ...state,
          pivoting: newPivotingState,
        };
      });
    },
    [apiRef, computePivotingState, isPivotingEnabled],
  );

  const setPivotEnabled = React.useCallback<GridPivotingApi['setPivotEnabled']>(
    (callback) => {
      if (!isPivotingEnabled) {
        return;
      }
      apiRef.current.setState((state) => {
        const newPivotMode =
          typeof callback === 'function' ? callback(state.pivoting?.enabled) : callback;

        if (newPivotMode) {
          nonPivotDataRef.current = getInitialData();
        } else {
          nonPivotDataRef.current = undefined;
        }

        const newPivotingState: GridPivotingState = {
          ...state.pivoting,
          ...computePivotingState({
            ...state.pivoting,
            enabled: newPivotMode,
          }),
          enabled: newPivotMode,
        };

        const newState = {
          ...state,
          pivoting: newPivotingState,
        };
        return newState;
      });
    },
    [apiRef, computePivotingState, getInitialData, isPivotingEnabled],
  );

  const setPivotPanelOpen = React.useCallback<GridPivotingApi['setPivotPanelOpen']>(
    (callback) => {
      if (!isPivotingEnabled) {
        return;
      }
      apiRef.current.setState((state) => ({
        ...state,
        pivoting: {
          ...state.pivoting,
          panelOpen:
            typeof callback === 'function' ? callback(state.pivoting?.panelOpen) : callback,
        },
      }));
    },
    [apiRef, isPivotingEnabled],
  );

  useGridApiMethod(apiRef, { setPivotModel, setPivotEnabled, setPivotPanelOpen }, 'public');

  useEnhancedEffect(() => {
    if (props.pivotModel !== undefined) {
      apiRef.current.setPivotModel(props.pivotModel);
    }
  }, [apiRef, props.pivotModel]);

  useEnhancedEffect(() => {
    if (props.pivotEnabled !== undefined) {
      apiRef.current.setPivotEnabled(props.pivotEnabled);
    }
  }, [apiRef, props.pivotEnabled]);

  useEnhancedEffect(() => {
    if (props.pivotPanelOpen !== undefined) {
      apiRef.current.setPivotPanelOpen(props.pivotPanelOpen);
    }
  }, [apiRef, props.pivotPanelOpen]);
};
