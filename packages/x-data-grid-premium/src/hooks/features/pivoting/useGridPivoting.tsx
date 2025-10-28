import * as React from 'react';
import {
  GridColDef,
  GridRowId,
  GridRowModel,
  gridDataRowIdsSelector,
  gridRowIdSelector,
  gridRowsLoadingSelector,
  gridRowsLookupSelector,
} from '@mui/x-data-grid-pro';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useOnMount from '@mui/utils/useOnMount';
import { RefObject } from '@mui/x-internals/types';
import {
  GridStateInitializer,
  useGridApiMethod,
  useGridRegisterPipeProcessor,
  useGridSelector,
  GridPipeProcessor,
  gridPivotInitialColumnsSelector,
} from '@mui/x-data-grid-pro/internals';
import type { GridInitialStatePremium } from '../../../models/gridStatePremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { GridPivotPanel } from '../../../components/pivotPanel';
import type {
  GridPivotingApi,
  GridPivotingPrivateApi,
  GridPivotingPropsOverrides,
  GridPivotingStaticPropsOverrides,
  GridPivotingState,
  GridPivotModel,
} from './gridPivotingInterfaces';
import {
  gridPivotModelSelector,
  gridPivotActiveSelector,
  gridPivotPanelOpenSelector,
} from './gridPivotingSelectors';
import { getInitialColumns, getPivotForcedProps, createPivotPropsFromRows } from './utils';
import { getAvailableAggregationFunctions } from '../aggregation/gridAggregationUtils';
import { GridSidebarValue } from '../sidebar';

const emptyPivotModel: GridPivotModel = { rows: [], columns: [], values: [] };

export const pivotingStateInitializer: GridStateInitializer<
  Pick<
    DataGridPremiumProcessedProps,
    | 'pivotActive'
    | 'pivotModel'
    | 'pivotPanelOpen'
    | 'initialState'
    | 'disablePivoting'
    | 'getPivotDerivedColumns'
    | 'columns'
  >,
  GridPrivateApiPremium
> = (state, props, apiRef) => {
  apiRef.current.caches.pivoting = {
    exportedStateRef: {
      current: null,
    },
    nonPivotDataRef: {
      current: undefined,
    },
  };
  if (props.disablePivoting) {
    return {
      ...state,
      pivoting: {
        active: false,
        model: emptyPivotModel,
      } as GridPivotingState,
    };
  }

  const initialColumns = getInitialColumns(
    props.columns ?? [],
    props.getPivotDerivedColumns,
    apiRef.current.getLocaleText,
  );

  const open = props.pivotPanelOpen ?? props.initialState?.pivoting?.panelOpen ?? false;
  const sidebarStateUpdate = open
    ? {
        open,
        value: GridSidebarValue.Pivot,
      }
    : {};

  return {
    ...state,
    pivoting: {
      active: props.pivotActive ?? props.initialState?.pivoting?.enabled ?? false,
      model: props.pivotModel ?? props.initialState?.pivoting?.model ?? emptyPivotModel,
      initialColumns,
    },
    sidebar: {
      ...state.sidebar,
      ...sidebarStateUpdate,
    },
  };
};

export const useGridPivoting = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'pivotActive'
    | 'onPivotActiveChange'
    | 'pivotModel'
    | 'onPivotModelChange'
    | 'pivotPanelOpen'
    | 'onPivotPanelOpenChange'
    | 'disablePivoting'
    | 'getPivotDerivedColumns'
    | 'pivotingColDef'
    | 'groupingColDef'
    | 'aggregationFunctions'
    | 'loading'
    | 'dataSource'
  >,
  originalColumnsProp: readonly GridColDef[],
  originalRowsProp: readonly GridRowModel[],
) => {
  const isPivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
  const isLoading = props.loading ?? gridRowsLoadingSelector(apiRef);
  const { exportedStateRef, nonPivotDataRef } = apiRef.current.caches.pivoting;

  const isPivotingAvailable = !props.disablePivoting;

  apiRef.current.registerControlState({
    stateId: 'pivotModel',
    propModel: props.pivotModel,
    propOnChange: props.onPivotModelChange,
    stateSelector: gridPivotModelSelector,
    changeEvent: 'pivotModelChange',
  });

  apiRef.current.registerControlState({
    stateId: 'pivotMode',
    propModel: props.pivotActive,
    propOnChange: props.onPivotActiveChange,
    stateSelector: gridPivotActiveSelector,
    changeEvent: 'pivotModeChange',
  });

  apiRef.current.registerControlState({
    stateId: 'pivotPanelOpen',
    propModel: props.pivotPanelOpen,
    propOnChange: props.onPivotPanelOpenChange,
    stateSelector: gridPivotPanelOpenSelector,
    changeEvent: 'pivotPanelOpenChange',
  });

  const getInitialData = React.useCallback(() => {
    if (!exportedStateRef.current) {
      exportedStateRef.current = apiRef.current.exportState();
    }

    let rows: GridRowModel[] = [];
    if (!props.dataSource) {
      const rowIds = gridDataRowIdsSelector(apiRef);
      const rowsLookup = gridRowsLookupSelector(apiRef);
      rows = rowIds.map((id) => rowsLookup[id]);
    }

    const initialColumns = getInitialColumns(
      originalColumnsProp,
      props.getPivotDerivedColumns,
      apiRef.current.getLocaleText,
    );

    return { rows, columns: initialColumns, originalRowsProp };
  }, [
    apiRef,
    props.getPivotDerivedColumns,
    originalColumnsProp,
    originalRowsProp,
    exportedStateRef,
    props.dataSource,
  ]);

  const computePivotingState = React.useCallback(
    ({ active, model: pivotModel }: Pick<GridPivotingState, 'active' | 'model'>) => {
      if (active && pivotModel) {
        const { rows, columns } = nonPivotDataRef.current || { rows: [], columns: new Map() };

        let propsOverrides: GridPivotingPropsOverrides | GridPivotingStaticPropsOverrides =
          getPivotForcedProps(pivotModel, columns, props.groupingColDef);

        // without data source, add more props overrides based on the data
        if (!isLoading && !props.dataSource) {
          propsOverrides = {
            ...propsOverrides,
            // TODO: fix createPivotPropsFromRows called twice in controlled mode
            ...createPivotPropsFromRows({
              rows,
              columns,
              pivotModel,
              pivotingColDef: props.pivotingColDef,
              apiRef,
            }),
          };
        }

        return {
          initialColumns: columns,
          propsOverrides,
        };
      }

      return {};
    },
    [
      apiRef,
      isLoading,
      props.dataSource,
      props.pivotingColDef,
      props.groupingColDef,
      nonPivotDataRef,
    ],
  );

  useOnMount(() => {
    if (!isPivotingAvailable || !isPivotActive) {
      return undefined;
    }

    nonPivotDataRef.current = getInitialData();

    apiRef.current.setState((state) => {
      const { initialColumns, propsOverrides } = computePivotingState(state.pivoting);
      const pivotingState = {
        ...state.pivoting,
        initialColumns: initialColumns || state.pivoting.initialColumns,
        propsOverrides: {
          ...state.pivoting.propsOverrides,
          ...propsOverrides,
        },
      };
      return {
        ...state,
        pivoting: pivotingState,
      };
    });

    return undefined;
  });

  useEnhancedEffect(() => {
    if (!isPivotingAvailable || !isPivotActive) {
      if (nonPivotDataRef.current) {
        // Prevent rows from being resynced from the original rows prop
        apiRef.current.caches.rows.rowsBeforePartialUpdates =
          nonPivotDataRef.current.originalRowsProp;
        apiRef.current.setRows(nonPivotDataRef.current!.rows);
        nonPivotDataRef.current = undefined;
      }
      if (exportedStateRef.current) {
        apiRef.current.restoreState(exportedStateRef.current);
        exportedStateRef.current = null;
      }
    }
  }, [isPivotActive, apiRef, isPivotingAvailable, nonPivotDataRef, exportedStateRef]);

  const setPivotModel = React.useCallback<GridPivotingApi['setPivotModel']>(
    (callback) => {
      if (!isPivotingAvailable) {
        return;
      }
      apiRef.current.setState((state) => {
        const newPivotModel =
          typeof callback === 'function' ? callback(state.pivoting?.model) : callback;
        if (state.pivoting?.model === newPivotModel) {
          return state;
        }
        const { initialColumns, propsOverrides } = computePivotingState({
          ...state.pivoting,
          model: newPivotModel,
        });
        const newPivotingState: GridPivotingState = {
          ...state.pivoting,
          initialColumns: initialColumns || state.pivoting.initialColumns,
          propsOverrides: {
            ...state.pivoting.propsOverrides,
            ...propsOverrides,
          },
          model: newPivotModel,
        };
        return {
          ...state,
          pivoting: newPivotingState,
        };
      });
    },
    [apiRef, computePivotingState, isPivotingAvailable],
  );

  const updatePivotModel = React.useCallback<GridPivotingPrivateApi['updatePivotModel']>(
    ({ field, targetSection, originSection, targetField, targetFieldPosition }) => {
      if (field === targetField) {
        return;
      }

      apiRef.current.setPivotModel((prev) => {
        const newModel = { ...prev };
        const isSameSection = targetSection === originSection;

        const hidden =
          originSection === null
            ? false
            : (prev[originSection].find((item) => item.field === field)?.hidden ?? false);

        if (targetSection) {
          const newSectionArray = [...prev[targetSection]];
          let toIndex = newSectionArray.length;
          if (targetField) {
            const fromIndex = newSectionArray.findIndex((item) => item.field === field);
            if (fromIndex > -1) {
              newSectionArray.splice(fromIndex, 1);
            }
            toIndex = newSectionArray.findIndex((item) => item.field === targetField);
            if (targetFieldPosition === 'bottom') {
              toIndex += 1;
            }
          }

          if (targetSection === 'values') {
            const initialColumns = gridPivotInitialColumnsSelector(apiRef);
            const aggFunc = isSameSection
              ? prev.values.find((item) => item.field === field)?.aggFunc
              : getAvailableAggregationFunctions({
                  aggregationFunctions: props.aggregationFunctions,
                  colDef: initialColumns.get(field)!,
                  isDataSource: !!props.dataSource,
                })[0];
            newSectionArray.splice(toIndex, 0, {
              field,
              aggFunc,
              hidden,
            });
            newModel.values = newSectionArray as GridPivotModel['values'];
          } else if (targetSection === 'columns') {
            const sort = isSameSection
              ? prev.columns.find((item) => item.field === field)?.sort
              : undefined;
            newSectionArray.splice(toIndex, 0, { field, sort, hidden });
            newModel.columns = newSectionArray as GridPivotModel['columns'];
          } else if (targetSection === 'rows') {
            newSectionArray.splice(toIndex, 0, { field, hidden });
            newModel.rows = newSectionArray as GridPivotModel['rows'];
          }
        }
        if (!isSameSection && originSection) {
          (newModel[originSection] as (typeof prev)[typeof originSection]) = prev[
            originSection
          ].filter((f) => f.field !== field);
        }
        return newModel;
      });
    },
    [apiRef, props.aggregationFunctions, props.dataSource],
  );

  const setPivotActive = React.useCallback<GridPivotingApi['setPivotActive']>(
    (callback) => {
      if (!isPivotingAvailable) {
        return;
      }
      apiRef.current.setState((state) => {
        const newPivotMode =
          typeof callback === 'function' ? callback(state.pivoting?.active) : callback;

        if (state.pivoting?.active === newPivotMode) {
          return state;
        }

        if (newPivotMode) {
          nonPivotDataRef.current = getInitialData();
        }

        const { initialColumns, propsOverrides } = computePivotingState({
          ...state.pivoting,
          active: newPivotMode,
        });
        const newPivotingState: GridPivotingState = {
          ...state.pivoting,
          initialColumns: initialColumns || state.pivoting.initialColumns,
          propsOverrides: {
            ...state.pivoting.propsOverrides,
            ...propsOverrides,
          },
          active: newPivotMode,
        };

        const newState = {
          ...state,
          pivoting: newPivotingState,
        };

        return newState;
      });
      apiRef.current.selectRows([], false, true);
    },
    [apiRef, computePivotingState, getInitialData, isPivotingAvailable, nonPivotDataRef],
  );

  const setPivotPanelOpen = React.useCallback<GridPivotingApi['setPivotPanelOpen']>(
    (callback) => {
      if (!isPivotingAvailable) {
        return;
      }

      const panelOpen = gridPivotPanelOpenSelector(apiRef);
      const newPanelOpen = typeof callback === 'function' ? callback(panelOpen) : callback;

      if (panelOpen === newPanelOpen) {
        return;
      }

      if (newPanelOpen) {
        apiRef.current.showSidebar(GridSidebarValue.Pivot);
      } else {
        apiRef.current.hideSidebar();
      }
    },
    [apiRef, isPivotingAvailable],
  );

  const addColumnMenuButton = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (menuItems) => {
      if (isPivotingAvailable) {
        return [...menuItems, 'columnMenuManagePanelItem'];
      }
      return menuItems;
    },
    [isPivotingAvailable],
  );

  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuButton);

  const updateNonPivotColumns = React.useCallback<GridPivotingPrivateApi['updateNonPivotColumns']>(
    (columns, keepPreviousColumns = true) => {
      if (!nonPivotDataRef.current || !isPivotingAvailable) {
        return;
      }

      if (keepPreviousColumns) {
        getInitialColumns(
          columns,
          props.getPivotDerivedColumns,
          apiRef.current.getLocaleText,
        ).forEach((col) => {
          nonPivotDataRef.current!.columns.set(col.field, col);
        });
      } else {
        nonPivotDataRef.current.columns = getInitialColumns(
          columns,
          props.getPivotDerivedColumns,
          apiRef.current.getLocaleText,
        );
      }

      apiRef.current.setState((state) => {
        const { propsOverrides } = computePivotingState(state.pivoting);
        return {
          ...state,
          pivoting: {
            ...state.pivoting,
            initialColumns: nonPivotDataRef.current?.columns,
            propsOverrides: {
              ...state.pivoting.propsOverrides,
              ...propsOverrides,
            },
          },
        };
      });
    },
    [
      isPivotingAvailable,
      apiRef,
      props.getPivotDerivedColumns,
      computePivotingState,
      nonPivotDataRef,
    ],
  );

  const updateNonPivotRows = React.useCallback<GridPivotingPrivateApi['updateNonPivotRows']>(
    (rows, keepPreviousRows = true) => {
      if (
        !nonPivotDataRef.current ||
        props.dataSource ||
        !isPivotingAvailable ||
        !rows ||
        rows.length === 0
      ) {
        return;
      }

      if (keepPreviousRows) {
        const rowsMap = new Map<GridRowId, GridRowModel>();
        nonPivotDataRef.current.rows.forEach((row) => {
          rowsMap.set(gridRowIdSelector(apiRef, row), row);
        });
        rows.forEach((row) => {
          const rowId = gridRowIdSelector(apiRef, row);
          // eslint-disable-next-line no-underscore-dangle
          if (row._action === 'delete') {
            rowsMap.delete(rowId);
          } else {
            rowsMap.set(rowId, row);
          }
        });

        nonPivotDataRef.current.rows = Array.from(rowsMap.values());
      } else {
        nonPivotDataRef.current.rows = rows as GridRowModel[];
      }

      apiRef.current.setState((state) => {
        const { initialColumns, propsOverrides } = computePivotingState(state.pivoting);
        return {
          ...state,
          pivoting: {
            ...state.pivoting,
            initialColumns: initialColumns || state.pivoting.initialColumns,
            propsOverrides: {
              ...state.pivoting.propsOverrides,
              ...propsOverrides,
            },
          },
        };
      });
    },
    [apiRef, computePivotingState, isPivotingAvailable, nonPivotDataRef, props.dataSource],
  );

  const addPivotingPanel = React.useCallback<GridPipeProcessor<'sidebar'>>(
    (initialValue, value) => {
      if (isPivotingAvailable && value === GridSidebarValue.Pivot) {
        return <GridPivotPanel />;
      }

      return initialValue;
    },
    [isPivotingAvailable],
  );

  const addGetRowsParams = React.useCallback<GridPipeProcessor<'getRowsParams'>>(
    (params) => {
      if (!isPivotingAvailable || !isPivotActive) {
        return params;
      }

      const pivotModel = gridPivotModelSelector(apiRef);
      const visibleColumns = pivotModel.columns.filter((column) => !column.hidden);
      const visibleRows = pivotModel.rows.filter((row) => !row.hidden);
      const visibleValues = pivotModel.values.filter((value) => !value.hidden);

      return {
        ...params,
        pivotModel: {
          columns: visibleColumns,
          rows: visibleRows,
          values: visibleValues,
        },
      };
    },
    [apiRef, isPivotingAvailable, isPivotActive],
  );

  useGridRegisterPipeProcessor(apiRef, 'sidebar', addPivotingPanel);
  useGridRegisterPipeProcessor(apiRef, 'getRowsParams', addGetRowsParams);

  useGridApiMethod(apiRef, { setPivotModel, setPivotActive, setPivotPanelOpen }, 'public');
  useGridApiMethod(
    apiRef,
    { updatePivotModel, updateNonPivotColumns, updateNonPivotRows },
    'private',
  );

  useEnhancedEffect(() => {
    apiRef.current.updateNonPivotColumns(originalColumnsProp, false);
  }, [originalColumnsProp, apiRef]);

  useEnhancedEffect(() => {
    apiRef.current.updateNonPivotRows(originalRowsProp, false);
    if (nonPivotDataRef.current) {
      nonPivotDataRef.current.originalRowsProp = originalRowsProp;
    }
  }, [originalRowsProp, apiRef, nonPivotDataRef]);

  useEnhancedEffect(() => {
    if (props.pivotModel !== undefined) {
      apiRef.current.setPivotModel(props.pivotModel);
    }
  }, [apiRef, props.pivotModel]);

  useEnhancedEffect(() => {
    if (props.pivotActive !== undefined) {
      apiRef.current.setPivotActive(props.pivotActive);
    }
  }, [apiRef, props.pivotActive]);

  useEnhancedEffect(() => {
    if (props.pivotPanelOpen !== undefined) {
      apiRef.current.setPivotPanelOpen(props.pivotPanelOpen);
    }
  }, [apiRef, props.pivotPanelOpen]);
};

export const useGridPivotingExportState = (apiRef: RefObject<GridPrivateApiPremium>) => {
  const stateExportPreProcessing: GridPipeProcessor<'exportState'> = React.useCallback(
    (state: GridInitialStatePremium) => {
      const isPivotActive = gridPivotActiveSelector(apiRef);
      if (!isPivotActive) {
        return state;
      }

      // To-do: implement context.exportOnlyDirtyModels
      const newState = {
        ...state,
        ...apiRef.current.caches.pivoting.exportedStateRef.current,
        sorting: state.sorting,
      };

      return newState;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
};
