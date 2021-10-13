import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridSelectionApi } from '../../../models/api/gridSelectionApi';
import { GridRowParams } from '../../../models/params/gridRowParams';
import { GridRowId } from '../../../models/gridRows';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridState } from '../../utils/useGridState';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import {
  gridSelectionStateSelector,
  selectedGridRowsSelector,
  selectedIdsLookupSelector,
} from './gridSelectionSelector';
import { gridSortedVisibleRowEntriesSelector } from '../filter/gridFilterSelector';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { GridRowSelectionCheckboxParams } from '../../../models/params/gridRowSelectionCheckboxParams';
import { GridColumnsPreProcessing } from '../../core/columnsPreProcessing';
import { GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef } from '../../../models';
import { composeClasses } from '../../../utils/material-ui-utils';
import { getDataGridUtilityClass } from '../../../gridClasses';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { useFirstRender } from '../../utils/useFirstRender';

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  return React.useMemo(() => {
    const slots = {
      cellCheckbox: ['cellCheckbox'],
      columnHeaderCheckbox: ['columnHeaderCheckbox'],
    };

    return composeClasses(slots, getDataGridUtilityClass, classes);
  }, [classes]);
};

/**
 * @requires useGridRows (state, method)
 * @requires useGridParamsApi (method)
 * @requires useGridControlState (method)
 */
export const useGridSelection = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    | 'checkboxSelection'
    | 'selectionModel'
    | 'onSelectionModelChange'
    | 'disableMultipleSelection'
    | 'disableSelectionOnClick'
    | 'isRowSelectable'
    | 'checkboxSelectionVisibleOnly'
    | 'pagination'
    | 'classes'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridSelection');

  const propSelectionModel = React.useMemo(() => {
    if (props.selectionModel == null) {
      return props.selectionModel;
    }

    if (Array.isArray(props.selectionModel)) {
      return props.selectionModel;
    }

    return [props.selectionModel];
  }, [props.selectionModel]);

  useGridStateInit(apiRef, (state) => ({ ...state, selection: propSelectionModel ?? [] }));

  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const ownerState = { classes: props.classes };
  const classes = useUtilityClasses(ownerState);
  const lastRowToggled = React.useRef<GridRowId | null>(null);

  apiRef.current.updateControlState({
    stateId: 'selection',
    propModel: propSelectionModel,
    propOnChange: props.onSelectionModelChange,
    stateSelector: gridSelectionStateSelector,
    changeEvent: GridEvents.selectionChange,
  });

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

      lastRowToggled.current = id;

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

      const visibleRowIds = gridSortedVisibleRowEntriesSelector(apiRef.current.state);
      const startIndex = visibleRowIds.findIndex((el) => el.id === startId);
      const endIndex = visibleRowIds.findIndex((el) => el.id === endId);
      const [start, end] = startIndex > endIndex ? [endIndex, startIndex] : [startIndex, endIndex];
      const rowsBetweenStartAndEnd = visibleRowIds.slice(start, end + 1).map((el) => el.id);

      apiRef.current.selectRows(rowsBetweenStartAndEnd, isSelected, resetSelection);
    },
    [apiRef, logger],
  );

  const expandRowRangeSelection = React.useCallback(
    (id: GridRowId) => {
      let endId = id;
      const startId = lastRowToggled.current ?? id;
      const isSelected = apiRef.current.isRowSelected(id);
      if (isSelected) {
        const visibleRowIds = gridSortedVisibleRowEntriesSelector(apiRef.current.state);
        const startIndex = visibleRowIds.findIndex((row) => row.id === startId);
        const endIndex = visibleRowIds.findIndex((row) => row.id === endId);
        if (startIndex > endIndex) {
          endId = visibleRowIds[endIndex + 1].id;
        } else {
          endId = visibleRowIds[endIndex - 1].id;
        }
      }

      lastRowToggled.current = id;

      apiRef.current.selectRowRange({ startId, endId }, !isSelected);
    },
    [apiRef],
  );

  const setSelectionModel = React.useCallback<GridSelectionApi['setSelectionModel']>(
    (model) => {
      const currentModel = gridSelectionStateSelector(apiRef.current.state);
      if (currentModel !== model) {
        logger.debug(`Setting selection model`);
        setGridState((state) => ({ ...state, selection: model }));
        forceUpdate();
      }
    },
    [apiRef, setGridState, forceUpdate, logger],
  );

  const isRowSelected = React.useCallback<GridSelectionApi['isRowSelected']>(
    (id) => gridSelectionStateSelector(apiRef.current.state).includes(id),
    [apiRef],
  );

  const removeOutdatedSelection = React.useCallback(() => {
    const currentSelection = gridSelectionStateSelector(apiRef.current.state);
    const rowsLookup = gridRowsLookupSelector(apiRef.current.state);

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
  }, [apiRef]);

  const handleRowClick = React.useCallback(
    (params: GridRowParams, event: React.MouseEvent) => {
      if (disableSelectionOnClick) {
        return;
      }

      const hasCtrlKey = event.metaKey || event.ctrlKey;

      if (event.shiftKey && (canHaveMultipleSelection || checkboxSelection)) {
        expandRowRangeSelection(params.id);
      } else {
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
      }
    },
    [
      apiRef,
      expandRowRangeSelection,
      canHaveMultipleSelection,
      disableSelectionOnClick,
      checkboxSelection,
    ],
  );

  const preventSelectionOnShift = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (canHaveMultipleSelection && event.shiftKey) {
        window.getSelection()?.removeAllRanges();
      }
    },
    [canHaveMultipleSelection],
  );

  const handleRowSelectionCheckboxChange = React.useCallback(
    (params: GridRowSelectionCheckboxParams, event: React.ChangeEvent) => {
      if ((event.nativeEvent as any).shiftKey) {
        expandRowRangeSelection(params.id);
      } else {
        apiRef.current.selectRow(params.id, params.value);
      }
    },
    [apiRef, expandRowRangeSelection],
  );

  useGridApiEventHandler(apiRef, GridEvents.visibleRowsSet, removeOutdatedSelection);
  useGridApiEventHandler(apiRef, GridEvents.rowClick, handleRowClick);
  useGridApiEventHandler(
    apiRef,
    GridEvents.rowSelectionCheckboxChange,
    handleRowSelectionCheckboxChange,
  );
  useGridApiEventHandler(apiRef, GridEvents.cellMouseDown, preventSelectionOnShift);

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
    if (propSelectionModel !== undefined) {
      apiRef.current.setSelectionModel(propSelectionModel);
    }
  }, [apiRef, propSelectionModel]);

  const isStateControlled = propSelectionModel != null;
  React.useEffect(() => {
    if (isStateControlled) {
      return;
    }

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
  }, [apiRef, isRowSelectable, isStateControlled]);

  const updateColumnsPreProcessing = React.useCallback(() => {
    if (!props.checkboxSelection) {
      apiRef.current.UNSTABLE_registerColumnPreProcessing('selection', null);
    } else {
      const addCheckboxColumn: GridColumnsPreProcessing = (columns) => {
        const groupingColumn: GridColDef = {
          ...GRID_CHECKBOX_SELECTION_COL_DEF,
          cellClassName: classes.cellCheckbox,
          headerClassName: classes.columnHeaderCheckbox,
          headerName: apiRef.current.getLocaleText('checkboxSelectionHeaderName'),
        };

        return [groupingColumn, ...columns];
      };

      apiRef.current.UNSTABLE_registerColumnPreProcessing('selection', addCheckboxColumn);
    }
  }, [apiRef, props.checkboxSelection, classes]);

  useFirstRender(() => {
    updateColumnsPreProcessing();
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    updateColumnsPreProcessing();
  }, [updateColumnsPreProcessing]);
};
