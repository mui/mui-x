import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridSelectionApi } from '../../../models/api/gridSelectionApi';
import { GridRowParams } from '../../../models/params/gridRowParams';
import { GridRowId } from '../../../models/gridRows';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import {
  gridSelectionStateSelector,
  selectedGridRowsSelector,
  selectedIdsLookupSelector,
} from './gridSelectionSelector';
import { sortedGridRowsSelector } from '../sorting';

export const useGridSelection = (apiRef: GridApiRef, props: GridComponentProps): void => {
  const logger = useLogger('useGridSelection');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const rowsLookup = useGridSelector(apiRef, gridRowsLookupSelector);

  const lastRowToggledByClick = React.useRef<GridRowId | null>(null);

  const propSelectionModel = React.useMemo(() => {
    if (props.selectionModel == null) {
      return props.selectionModel;
    }

    if (Array.isArray(props.selectionModel)) {
      return props.selectionModel;
    }

    return [props.selectionModel];
  }, [props.selectionModel]);

  const { checkboxSelection, disableMultipleSelection, disableSelectionOnClick, isRowSelectable } =
    options;

  const canHaveMultipleSelection = !disableMultipleSelection || checkboxSelection;

  const getSelectedRows = React.useCallback<GridSelectionApi['getSelectedRows']>(
    () => selectedGridRowsSelector(apiRef.current.state),
    [apiRef],
  );

  const selectRow = React.useCallback<GridSelectionApi['selectRow']>(
    (id, isSelected = true, resetSelection = false) => {
      if (isRowSelectable && !isRowSelectable(apiRef.current.getRowParams(id))) {
        return;
      }

      if (resetSelection) {
        logger.debug(`Setting selection for row ${id}`);

        setGridState((state) => ({ ...state, selection: isSelected ? [id] : [] }));
      } else {
        logger.debug(`Toggling selection for row ${id}`);

        setGridState((state) => {
          const selection = gridSelectionStateSelector(state);
          const newSelection: GridRowId[] = selection.filter((el) => el !== id);

          if (isSelected) {
            newSelection.push(id);
          }

          if (newSelection.length > 1 && !canHaveMultipleSelection) {
            return state;
          }

          return { ...state, selection: newSelection };
        });
      }

      forceUpdate();
    },
    [apiRef, forceUpdate, setGridState, isRowSelectable, logger, canHaveMultipleSelection],
  );

  const selectRows = React.useCallback<GridSelectionApi['selectRows']>(
    (ids: GridRowId[], isSelected = true, resetSelection = false) => {
      setGridState((state) => {
        const selectableIds = isRowSelectable
          ? ids.filter((id) => isRowSelectable(apiRef.current.getRowParams(id)))
          : ids;

        let newSelection: GridRowId[];
        if (resetSelection) {
          newSelection = isSelected ? selectableIds : [];
        } else {
          // We clone the existing map to avoid mutating the same map returned by the selector to others part of the project
          const selectionLookup = new Map(selectedIdsLookupSelector(state).entries());

          selectableIds.forEach((id) => {
            if (isSelected) {
              selectionLookup.set(id, true);
            } else {
              selectionLookup.delete(id);
            }
          });

          newSelection = [...selectionLookup.keys()];
        }

        if (newSelection.length > 1 && !canHaveMultipleSelection) {
          return state;
        }

        return {
          ...state,
          selection: newSelection,
        };
      });

      forceUpdate();
    },
    [isRowSelectable, canHaveMultipleSelection, setGridState, forceUpdate, apiRef],
  );

  const selectRowRange = React.useCallback<GridSelectionApi['selectRowRange']>(
    (
      {
        startId,
        endId,
      }: {
        startId: GridRowId;
        endId: GridRowId;
      },
      isSelected = true,
      resetSelection,
    ) => {
      if (!apiRef.current.getRow(startId) || !apiRef.current.getRow(endId)) {
        return;
      }

      logger.debug(`Expanding selection from row ${startId} to row ${endId}`);

      const sortedRowsId = [...sortedGridRowsSelector(apiRef.current.state).keys()];
      const startIndex = sortedRowsId.indexOf(startId);
      const endIndex = sortedRowsId.indexOf(endId);
      const [start, end] = startIndex > endIndex ? [endIndex, startIndex] : [startIndex, endIndex];
      const rowsBetweenStartAndEnd = sortedRowsId.slice(start, end + 1);

      apiRef.current.selectRows(rowsBetweenStartAndEnd, isSelected, resetSelection);
    },
    [apiRef, logger],
  );

  const setSelectionModel = React.useCallback<GridSelectionApi['setSelectionModel']>(
    (model) => {
      const currentModel = apiRef.current.state.selection;
      if (currentModel !== model) {
        setGridState((state) => ({ ...state, selection: model }));
      }
    },
    [setGridState, apiRef],
  );

  const isRowSelected = React.useCallback<GridSelectionApi['isRowSelected']>(
    (id) => gridSelectionStateSelector(apiRef.current.state).includes(id),
    [apiRef],
  );

  const handleRowClick = React.useCallback(
    (params: GridRowParams, event: React.MouseEvent) => {
      if (disableSelectionOnClick) {
        return;
      }

      const hasCtrlKey = event.metaKey || event.ctrlKey;

      if (!disableMultipleSelection && event.shiftKey) {
        apiRef.current.selectRowRange(
          {
            startId: lastRowToggledByClick.current ?? params.id,
            endId: params.id,
          },
          !apiRef.current.isRowSelected(params.id),
        );

        event.stopPropagation();
      } else {
        const resetSelection = (disableMultipleSelection || !hasCtrlKey) && !checkboxSelection;
        if (resetSelection) {
          apiRef.current.selectRow(
            params.id,
            hasCtrlKey ? !apiRef.current.isRowSelected(params.id) : true,
            true,
          );
        } else {
          apiRef.current.selectRow(params.id, !apiRef.current.isRowSelected(params.id), false);
        }
      }

      lastRowToggledByClick.current = params.id;
    },
    [apiRef, checkboxSelection, disableMultipleSelection, disableSelectionOnClick],
  );

  useGridApiEventHandler(apiRef, GridEvents.rowClick, handleRowClick);

  const selectionApi: GridSelectionApi = {
    selectRow,
    selectRows,
    selectRowRange,
    setSelectionModel,
    getSelectedRows,
    isRowSelected,
  };
  useGridApiMethod(apiRef, selectionApi, 'GridSelectionApi');

  React.useEffect(() => {
    apiRef.current.updateControlState<GridRowId[]>({
      stateId: 'selection',
      propModel: propSelectionModel,
      propOnChange: props.onSelectionModelChange,
      stateSelector: gridSelectionStateSelector,
      changeEvent: GridEvents.selectionChange,
    });
  }, [apiRef, props.onSelectionModelChange, propSelectionModel]);

  React.useEffect(() => {
    // Rows changed
    setGridState((state) => {
      const newSelectionState = gridSelectionStateSelector(state);
      // We clone the existing map to avoid mutating the same map returned by the selector to others part of the project
      const selectionLookup = new Map(selectedIdsLookupSelector(state).entries());
      let hasChanged = false;
      newSelectionState.forEach((id: GridRowId) => {
        if (!rowsLookup[id]) {
          selectionLookup.delete(id);
          hasChanged = true;
        }
      });
      if (hasChanged) {
        return { ...state, selection: [...selectionLookup.keys()] };
      }
      return state;
    });
    forceUpdate();
  }, [rowsLookup, apiRef, setGridState, forceUpdate]);

  React.useEffect(() => {
    if (propSelectionModel === undefined) {
      return;
    }

    apiRef.current.setSelectionModel(propSelectionModel);
  }, [apiRef, propSelectionModel, setGridState]);

  React.useEffect(() => {
    // isRowSelectable changed
    setGridState((state) => {
      const newSelectionState = state.selection.filter(
        (id) => !isRowSelectable || isRowSelectable(apiRef.current.getRowParams(id)),
      );

      if (newSelectionState.length < state.selection.length) {
        return { ...state, selection: newSelectionState };
      }

      return state;
    });
    forceUpdate();
  }, [apiRef, setGridState, forceUpdate, isRowSelectable]);
};
