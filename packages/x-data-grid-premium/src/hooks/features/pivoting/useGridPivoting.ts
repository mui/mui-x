import * as React from 'react';
import {
  GridColDef,
  GridColumnsState,
  GridRowModel,
  gridColumnFieldsSelector,
  gridColumnLookupSelector,
  gridDataRowIdsSelector,
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
import { GridInitialStatePremium } from '../../../models/gridStatePremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

import { GridApiPremium, GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { GridPivotingApi, GridPivotingState, GridPivotModel } from './gridPivotingInterfaces';
import {
  gridPivotModelSelector,
  gridPivotEnabledSelector,
  gridPivotPanelOpenSelector,
} from './gridPivotingSelectors';
import {
  getInitialColumns,
  getPivotedData,
  isPivotingAvailable as isPivotingAvailableFn,
} from './utils';
import { getAvailableAggregationFunctions } from '../aggregation/gridAggregationUtils';

const emptyPivotModel: GridPivotModel = { rows: [], columns: [], values: [] };

export const pivotingStateInitializer: GridStateInitializer<
  Pick<
    DataGridPremiumProcessedProps,
    | 'pivotEnabled'
    | 'pivotModel'
    | 'pivotPanelOpen'
    | 'initialState'
    | 'disablePivoting'
    | 'getPivotDerivedColumns'
  >
> = (state, props) => {
  if (!isPivotingAvailableFn(props)) {
    return {
      ...state,
      pivoting: {
        enabled: false,
        model: emptyPivotModel,
        panelOpen: false,
      } as GridPivotingState,
    };
  }

  const initialColumns = getInitialColumns(
    // Cast to GridColumnsState to reverse the DeepPartial applied to the state by GridStateInitializer
    (state.columns?.orderedFields as GridColumnsState['orderedFields']) ?? [],
    (state.columns?.lookup as GridColumnsState['lookup']) ?? {},
    props.getPivotDerivedColumns,
  );

  return {
    ...state,
    pivoting: {
      enabled: props.pivotEnabled ?? props.initialState?.pivoting?.enabled ?? false,
      model: props.pivotModel ?? props.initialState?.pivoting?.model ?? emptyPivotModel,
      panelOpen: props.pivotPanelOpen ?? props.initialState?.pivoting?.panelOpen ?? false,
      initialColumns,
    } as GridPivotingState,
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
    | 'disablePivoting'
    | 'getPivotDerivedColumns'
    | 'pivotingColDef'
    | 'aggregationFunctions'
  >,
) => {
  const isPivot = useGridSelector(apiRef, gridPivotEnabledSelector);
  const exportedStateRef = React.useRef<GridInitialStatePremium | null>(null);
  const nonPivotDataRef = React.useRef<{ rows: GridRowModel[]; columns: GridColDef[] } | undefined>(
    undefined,
  );

  const isPivotingAvailable = isPivotingAvailableFn(props);

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

  const getInitialData = React.useCallback(() => {
    exportedStateRef.current = apiRef.current.exportState();

    const rowIds = gridDataRowIdsSelector(apiRef);
    const rowsLookup = gridRowsLookupSelector(apiRef);
    const rows = rowIds.map((id) => rowsLookup[id]);

    const columnFields = gridColumnFieldsSelector(apiRef);
    const columnsLookup = gridColumnLookupSelector(apiRef);
    const initialColumns = getInitialColumns(
      columnFields,
      columnsLookup,
      props.getPivotDerivedColumns,
    );

    return { rows, columns: initialColumns };
  }, [apiRef, props.getPivotDerivedColumns]);

  const computePivotingState = React.useCallback(
    ({ enabled, model: pivotModel }: Pick<GridPivotingState, 'enabled' | 'model'>) => {
      if (enabled && pivotModel) {
        const { rows, columns } = nonPivotDataRef.current || { rows: [], columns: [] };

        return {
          initialColumns: columns,
          // TODO: fix getPivotedData called twice in controlled mode
          propsOverrides: getPivotedData({
            rows,
            columns,
            pivotModel,
            apiRef: apiRef as RefObject<GridApiPremium>,
            pivotingColDef: props.pivotingColDef,
          }),
        };
      }

      return undefined;
    },
    [apiRef, props.pivotingColDef],
  );

  useOnMount(() => {
    if (!isPivotingAvailable || !isPivot) {
      return undefined;
    }

    const isLoading = gridRowsLoadingSelector(apiRef) ?? false;

    const runPivoting = () => {
      nonPivotDataRef.current = getInitialData();
      apiRef.current.setState((state) => {
        const pivotingState = {
          ...state.pivoting,
          ...computePivotingState(state.pivoting),
        };
        return {
          ...state,
          pivoting: pivotingState,
        };
      });
    };

    if (!isLoading) {
      runPivoting();
      return undefined;
    }

    const unsubscribe = apiRef.current?.store.subscribe(() => {
      const loading = gridRowsLoadingSelector(apiRef);
      if (loading === false) {
        unsubscribe();
        runPivoting();
      }
    });

    return unsubscribe;
  });

  useEnhancedEffect(() => {
    if (!isPivotingAvailable) {
      return;
    }
    if (!isPivot && exportedStateRef.current) {
      apiRef.current.restoreState(exportedStateRef.current);
      exportedStateRef.current = null;
    }
  }, [isPivot, apiRef, isPivotingAvailable]);

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
    [apiRef, computePivotingState, isPivotingAvailable],
  );

  const updatePivotModel = React.useCallback<GridPivotingApi['updatePivotModel']>(
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
                  colDef: initialColumns.find((column) => column.field === field)!,
                  isDataSource: false,
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
    [apiRef, props.aggregationFunctions],
  );

  const setPivotEnabled = React.useCallback<GridPivotingApi['setPivotEnabled']>(
    (callback) => {
      if (!isPivotingAvailable) {
        return;
      }
      apiRef.current.setState((state) => {
        const newPivotMode =
          typeof callback === 'function' ? callback(state.pivoting?.enabled) : callback;

        if (state.pivoting?.enabled === newPivotMode) {
          return state;
        }

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
    [apiRef, computePivotingState, getInitialData, isPivotingAvailable],
  );

  const setPivotPanelOpen = React.useCallback<GridPivotingApi['setPivotPanelOpen']>(
    (callback) => {
      if (!isPivotingAvailable) {
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
    [apiRef, isPivotingAvailable],
  );

  const addColumnMenuButton = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (menuItems) => {
      if (isPivotingAvailable) {
        return [...menuItems, 'columnMenuPivotItem'];
      }
      return menuItems;
    },
    [isPivotingAvailable],
  );

  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuButton);

  useGridApiMethod(
    apiRef,
    { setPivotModel, updatePivotModel, setPivotEnabled, setPivotPanelOpen },
    'public',
  );

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
