import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridSelectionApi } from '../../../models/api/gridSelectionApi';
import { GridRowParams } from '../../../models/params/gridRowParams';
import { GridRowId } from '../../../models/gridRows';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import {
  gridSelectionStateSelector,
  selectedGridRowsSelector,
  selectedIdsLookupSelector,
} from './gridSelectionSelector';
import { gridPaginatedVisibleSortedGridRowIdsSelector } from '../pagination';
import { visibleSortedGridRowIdsSelector } from '../filter';
import { GridHeaderSelectionCheckboxParams } from '../../../models/params/gridHeaderSelectionCheckboxParams';

/**
 * @requires useGridRows (state, method)
 * @requires useGridParamsApi (method)
 * @requires useGridControlState (method)
 */
export const useGridSelection = (apiRef: GridApiRef, props: GridComponentProps): void => {
  const logger = useGridLogger(apiRef, 'useGridSelection');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const rowsLookup = useGridSelector(apiRef, gridRowsLookupSelector);

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
    props;

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

        apiRef.current.setSelectionModel(isSelected ? [id] : []);
      } else {
        logger.debug(`Toggling selection for row ${id}`);

        const selection = gridSelectionStateSelector(apiRef.current.state);
        const newSelection: GridRowId[] = selection.filter((el) => el !== id);

        if (isSelected) {
          newSelection.push(id);
        }

        const isSelectionValid = newSelection.length < 2 || canHaveMultipleSelection;
        if (isSelectionValid) {
          apiRef.current.setSelectionModel(newSelection);
        }
      }
    },
    [apiRef, isRowSelectable, logger, canHaveMultipleSelection],
  );

  const selectRows = React.useCallback<GridSelectionApi['selectRows']>(
    (ids: GridRowId[], isSelected = true, resetSelection = false) => {
      logger.debug(`Setting selection for several rows`);

      const selectableIds = isRowSelectable
        ? ids.filter((id) => isRowSelectable(apiRef.current.getRowParams(id)))
        : ids;

      let newSelection: GridRowId[];
      if (resetSelection) {
        newSelection = isSelected ? selectableIds : [];
      } else {
        // We clone the existing object to avoid mutating the same object returned by the selector to others part of the project
        const selectionLookup = { ...selectedIdsLookupSelector(apiRef.current.state) };

        selectableIds.forEach((id) => {
          if (isSelected) {
            selectionLookup[id] = id;
          } else {
            delete selectionLookup[id];
          }
        });

        newSelection = Object.values(selectionLookup);
      }

      const isSelectionValid = newSelection.length < 2 || canHaveMultipleSelection;
      if (isSelectionValid) {
        apiRef.current.setSelectionModel(newSelection);
      }
    },
    [apiRef, isRowSelectable, logger, canHaveMultipleSelection],
  );

  const setSelectionModel = React.useCallback<GridSelectionApi['setSelectionModel']>(
    (model) => {
      const currentModel = apiRef.current.state.selection;
      if (currentModel !== model) {
        setGridState((state) => ({ ...state, selection: model }));
        forceUpdate();
      }
    },
    [setGridState, apiRef, forceUpdate],
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

      // Without checkboxSelection, multiple selection is only allowed if CTRL is pressed
      const isMultipleSelectionDisabled = !checkboxSelection && !hasCtrlKey;
      const resetSelection = !canHaveMultipleSelection || isMultipleSelectionDisabled;

      if (resetSelection) {
        apiRef.current.selectRow(
          params.id,
          hasCtrlKey || checkboxSelection ? !apiRef.current.isRowSelected(params.id) : true,
          true,
        );
      } else {
        apiRef.current.selectRow(params.id, !apiRef.current.isRowSelected(params.id), false);
      }
    },
    [apiRef, canHaveMultipleSelection, disableSelectionOnClick, checkboxSelection],
  );

  const handleHeaderSelectionCheckboxChange = React.useCallback(
    (params: GridHeaderSelectionCheckboxParams) => {
      const shouldLimitSelectionToCurrentPage =
        props.checkboxSelectionVisibleOnly && props.pagination;

      const rowsToBeSelected = shouldLimitSelectionToCurrentPage
        ? gridPaginatedVisibleSortedGridRowIdsSelector(apiRef.current.state)
        : visibleSortedGridRowIdsSelector(apiRef.current.state);

      apiRef.current.selectRows(rowsToBeSelected, params.value);
    },
    [apiRef, props.checkboxSelectionVisibleOnly, props.pagination],
  );

  useGridApiEventHandler(apiRef, GridEvents.rowClick, handleRowClick);
  useGridApiEventHandler(
    apiRef,
    GridEvents.headerSelectionCheckboxChange,
    handleHeaderSelectionCheckboxChange,
  );

  // TODO handle Cell Click/range selection?
  const selectionApi: GridSelectionApi = {
    selectRow,
    selectRows,
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
    const currentSelection = gridSelectionStateSelector(apiRef.current.state);

    // We clone the existing object to avoid mutating the same object returned by the selector to others part of the project
    const selectionLookup = { ...selectedIdsLookupSelector(apiRef.current.state) };

    let hasChanged = false;
    currentSelection.forEach((id: GridRowId) => {
      if (!rowsLookup[id]) {
        delete selectionLookup[id];
        hasChanged = true;
      }
    });

    if (hasChanged) {
      apiRef.current.setSelectionModel(Object.values(selectionLookup));
    }
  }, [rowsLookup, apiRef]);

  React.useEffect(() => {
    if (propSelectionModel === undefined) {
      return;
    }

    apiRef.current.setSelectionModel(propSelectionModel);
  }, [apiRef, propSelectionModel]);

  React.useEffect(() => {
    // isRowSelectable changed
    const currentSelection = gridSelectionStateSelector(apiRef.current.state);

    if (isRowSelectable) {
      const newSelection = currentSelection.filter((id) =>
        isRowSelectable(apiRef.current.getRowParams(id)),
      );

      if (newSelection.length < currentSelection.length) {
        apiRef.current.setSelectionModel(newSelection);
      }
    }
  }, [apiRef, isRowSelectable]);
};
