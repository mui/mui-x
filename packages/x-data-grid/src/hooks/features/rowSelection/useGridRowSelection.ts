import * as React from 'react';
import { GridEventListener } from '../../../models/events';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import {
  GridRowSelectionApi,
  GridRowMultiSelectionApi,
} from '../../../models/api/gridRowSelectionApi';
import { GridGroupNode, GridRowId } from '../../../models/gridRows';
import { GridSignature, useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridSelector } from '../../utils/useGridSelector';
import {
  gridRowsLookupSelector,
  gridRowMaximumTreeDepthSelector,
  gridRowTreeSelector,
} from '../rows/gridRowsSelector';
import {
  gridRowSelectionStateSelector,
  selectedGridRowsSelector,
  selectedIdsLookupSelector,
} from './gridRowSelectionSelector';
import { gridPaginatedVisibleSortedGridRowIdsSelector } from '../pagination';
import { gridFocusCellSelector } from '../focus/gridFocusStateSelector';
import {
  gridExpandedSortedRowIdsSelector,
  gridFilteredRowsLookupSelector,
} from '../filter/gridFilterSelector';
import { GRID_CHECKBOX_SELECTION_COL_DEF, GRID_ACTIONS_COLUMN_TYPE } from '../../../colDef';
import { GridCellModes } from '../../../models/gridEditRowModel';
import { isKeyboardEvent, isNavigationKey } from '../../../utils/keyboardUtils';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GridRowSelectionModel } from '../../../models';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from '../../../internals/constants';
import { gridClasses } from '../../../constants/gridClasses';
import { isEventTargetInPortal } from '../../../utils/domUtils';
import { isMultipleRowSelectionEnabled, findRowsToSelect, findRowsToDeselect } from './utils';

const getSelectionModelPropValue = (
  selectionModelProp: DataGridProcessedProps['rowSelectionModel'],
  prevSelectionModel?: GridRowSelectionModel,
) => {
  if (selectionModelProp == null) {
    return selectionModelProp;
  }

  if (Array.isArray(selectionModelProp)) {
    return selectionModelProp;
  }

  if (prevSelectionModel && prevSelectionModel[0] === selectionModelProp) {
    return prevSelectionModel;
  }

  return [selectionModelProp];
};

export const rowSelectionStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'rowSelectionModel' | 'rowSelection'>
> = (state, props) => ({
  ...state,
  rowSelection: props.rowSelection
    ? (getSelectionModelPropValue(props.rowSelectionModel) ?? [])
    : [],
});

/**
 * @requires useGridRows (state, method) - can be after
 * @requires useGridParamsApi (method) - can be after
 * @requires useGridFocus (state) - can be after
 * @requires useGridKeyboardNavigation (`cellKeyDown` event must first be consumed by it)
 */
export const useGridRowSelection = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'checkboxSelection'
    | 'rowSelectionModel'
    | 'onRowSelectionModelChange'
    | 'disableMultipleRowSelection'
    | 'disableRowSelectionOnClick'
    | 'isRowSelectable'
    | 'checkboxSelectionVisibleOnly'
    | 'pagination'
    | 'paginationMode'
    | 'filterMode'
    | 'classes'
    | 'keepNonExistentRowsSelected'
    | 'rowSelection'
    | 'rowSelectionPropagation'
    | 'signature'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridSelection');

  const runIfRowSelectionIsEnabled = React.useCallback(
    <Args extends any[]>(callback: (...args: Args) => void) =>
      (...args: Args) => {
        if (props.rowSelection) {
          callback(...args);
        }
      },
    [props.rowSelection],
  );

  const applyAutoSelection =
    props.signature !== GridSignature.DataGrid &&
    (props.rowSelectionPropagation?.parents || props.rowSelectionPropagation?.descendants);

  const propRowSelectionModel = React.useMemo(() => {
    return getSelectionModelPropValue(
      props.rowSelectionModel,
      gridRowSelectionStateSelector(apiRef.current.state),
    );
  }, [apiRef, props.rowSelectionModel]);

  const lastRowToggled = React.useRef<GridRowId | null>(null);

  apiRef.current.registerControlState({
    stateId: 'rowSelection',
    propModel: propRowSelectionModel,
    propOnChange: props.onRowSelectionModelChange,
    stateSelector: gridRowSelectionStateSelector,
    changeEvent: 'rowSelectionChange',
  });

  const {
    checkboxSelection,
    disableRowSelectionOnClick,
    isRowSelectable: propIsRowSelectable,
  } = props;

  const canHaveMultipleSelection = isMultipleRowSelectionEnabled(props);
  const visibleRows = useGridVisibleRows(apiRef, props);
  const tree = useGridSelector(apiRef, gridRowTreeSelector);
  const isNestedData = useGridSelector(apiRef, gridRowMaximumTreeDepthSelector) > 1;

  const expandMouseRowRangeSelection = React.useCallback(
    (id: GridRowId) => {
      let endId = id;
      const startId = lastRowToggled.current ?? id;
      const isSelected = apiRef.current.isRowSelected(id);
      if (isSelected) {
        const visibleRowIds = gridExpandedSortedRowIdsSelector(apiRef);
        const startIndex = visibleRowIds.findIndex((rowId) => rowId === startId);
        const endIndex = visibleRowIds.findIndex((rowId) => rowId === endId);
        if (startIndex === endIndex) {
          return;
        }
        if (startIndex > endIndex) {
          endId = visibleRowIds[endIndex + 1];
        } else {
          endId = visibleRowIds[endIndex - 1];
        }
      }

      lastRowToggled.current = id;

      apiRef.current.selectRowRange({ startId, endId }, !isSelected);
    },
    [apiRef],
  );

  /*
   * API METHODS
   */
  const setRowSelectionModel = React.useCallback<GridRowSelectionApi['setRowSelectionModel']>(
    (model) => {
      if (
        props.signature === GridSignature.DataGrid &&
        !canHaveMultipleSelection &&
        Array.isArray(model) &&
        model.length > 1
      ) {
        throw new Error(
          [
            'MUI X: `rowSelectionModel` can only contain 1 item in DataGrid.',
            'You need to upgrade to DataGridPro or DataGridPremium component to unlock multiple selection.',
          ].join('\n'),
        );
      }
      const currentModel = gridRowSelectionStateSelector(apiRef.current.state);
      if (currentModel !== model) {
        logger.debug(`Setting selection model`);
        apiRef.current.setState((state) => ({
          ...state,
          rowSelection: props.rowSelection ? model : [],
        }));
        apiRef.current.forceUpdate();
      }
    },
    [apiRef, logger, props.rowSelection, props.signature, canHaveMultipleSelection],
  );

  const isRowSelected = React.useCallback<GridRowSelectionApi['isRowSelected']>(
    (id) => gridRowSelectionStateSelector(apiRef.current.state).includes(id),
    [apiRef],
  );

  const isRowSelectable = React.useCallback<GridRowSelectionApi['isRowSelectable']>(
    (id) => {
      if (props.rowSelection === false) {
        return false;
      }

      if (propIsRowSelectable && !propIsRowSelectable(apiRef.current.getRowParams(id))) {
        return false;
      }

      const rowNode = apiRef.current.getRowNode(id);
      if (rowNode?.type === 'footer' || rowNode?.type === 'pinnedRow') {
        return false;
      }

      return true;
    },
    [apiRef, props.rowSelection, propIsRowSelectable],
  );

  const getSelectedRows = React.useCallback<GridRowSelectionApi['getSelectedRows']>(
    () => selectedGridRowsSelector(apiRef),
    [apiRef],
  );

  const selectRow = React.useCallback<GridRowSelectionApi['selectRow']>(
    (id, isSelected = true, resetSelection = false) => {
      if (!apiRef.current.isRowSelectable(id)) {
        return;
      }

      lastRowToggled.current = id;

      if (resetSelection) {
        logger.debug(`Setting selection for row ${id}`);

        const newSelection: GridRowId[] = [];
        const addRow = (rowId: GridRowId) => {
          newSelection.push(rowId);
        };
        if (isSelected) {
          addRow(id);
          if (applyAutoSelection) {
            findRowsToSelect(
              apiRef,
              tree,
              id,
              props.rowSelectionPropagation?.descendants ?? false,
              props.rowSelectionPropagation?.parents ?? false,
              addRow,
            );
          }
        }

        apiRef.current.setRowSelectionModel(newSelection);
      } else {
        logger.debug(`Toggling selection for row ${id}`);

        const selection = gridRowSelectionStateSelector(apiRef.current.state);

        const newSelection: Set<GridRowId> = new Set(selection);
        newSelection.delete(id);

        const addRow = (rowId: GridRowId) => {
          newSelection.add(rowId);
        };
        const removeRow = (rowId: GridRowId) => {
          newSelection.delete(rowId);
        };

        if (isSelected) {
          addRow(id);
          if (applyAutoSelection) {
            findRowsToSelect(
              apiRef,
              tree,
              id,
              props.rowSelectionPropagation?.descendants ?? false,
              props.rowSelectionPropagation?.parents ?? false,
              addRow,
            );
          }
        } else if (applyAutoSelection) {
          findRowsToDeselect(
            apiRef,
            tree,
            id,
            props.rowSelectionPropagation?.descendants ?? false,
            props.rowSelectionPropagation?.parents ?? false,
            removeRow,
          );
        }

        const isSelectionValid = newSelection.size < 2 || canHaveMultipleSelection;
        if (isSelectionValid) {
          apiRef.current.setRowSelectionModel(Array.from(newSelection));
        }
      }
    },
    [
      apiRef,
      logger,
      applyAutoSelection,
      tree,
      props.rowSelectionPropagation?.descendants,
      props.rowSelectionPropagation?.parents,
      canHaveMultipleSelection,
    ],
  );

  const selectRows = React.useCallback<GridRowMultiSelectionApi['selectRows']>(
    (ids: GridRowId[], isSelected = true, resetSelection = false) => {
      logger.debug(`Setting selection for several rows`);

      const selectableIds = ids.filter((id) => apiRef.current.isRowSelectable(id));

      let newSelection: Set<GridRowId>;
      if (resetSelection) {
        if (isSelected) {
          newSelection = new Set(selectableIds);
          if (applyAutoSelection) {
            const addRow = (rowId: GridRowId) => {
              newSelection.add(rowId);
            };
            selectableIds.forEach((id) => {
              findRowsToSelect(
                apiRef,
                tree,
                id,
                props.rowSelectionPropagation?.descendants ?? false,
                props.rowSelectionPropagation?.parents ?? false,
                addRow,
              );
            });
          }
        } else {
          newSelection = new Set();
        }
        const currentLookup = selectedIdsLookupSelector(apiRef);
        if (
          newSelection.size === Object.keys(currentLookup).length &&
          Array.from(newSelection).every((id) => currentLookup[id] === id)
        ) {
          return;
        }
      } else {
        newSelection = new Set(Object.values(selectedIdsLookupSelector(apiRef)));
        const addRow = (rowId: GridRowId) => {
          newSelection.add(rowId);
        };
        const removeRow = (rowId: GridRowId) => {
          newSelection.delete(rowId);
        };

        selectableIds.forEach((id) => {
          if (isSelected) {
            newSelection.add(id);
            if (applyAutoSelection) {
              findRowsToSelect(
                apiRef,
                tree,
                id,
                props.rowSelectionPropagation?.descendants ?? false,
                props.rowSelectionPropagation?.parents ?? false,
                addRow,
              );
            }
          } else {
            removeRow(id);
            if (applyAutoSelection) {
              findRowsToDeselect(
                apiRef,
                tree,
                id,
                props.rowSelectionPropagation?.descendants ?? false,
                props.rowSelectionPropagation?.parents ?? false,
                removeRow,
              );
            }
          }
        });
      }

      const isSelectionValid = newSelection.size < 2 || canHaveMultipleSelection;
      if (isSelectionValid) {
        apiRef.current.setRowSelectionModel(Array.from(newSelection));
      }
    },
    [
      logger,
      applyAutoSelection,
      canHaveMultipleSelection,
      apiRef,
      tree,
      props.rowSelectionPropagation?.descendants,
      props.rowSelectionPropagation?.parents,
    ],
  );

  const selectRowRange = React.useCallback<GridRowMultiSelectionApi['selectRowRange']>(
    (
      {
        startId,
        endId,
      }: {
        startId: GridRowId;
        endId: GridRowId;
      },
      isSelected = true,
      resetSelection = false,
    ) => {
      if (!apiRef.current.getRow(startId) || !apiRef.current.getRow(endId)) {
        return;
      }

      logger.debug(`Expanding selection from row ${startId} to row ${endId}`);

      // Using rows from all pages allow to select a range across several pages
      const allPagesRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const startIndex = allPagesRowIds.indexOf(startId);
      const endIndex = allPagesRowIds.indexOf(endId);
      const [start, end] = startIndex > endIndex ? [endIndex, startIndex] : [startIndex, endIndex];
      const rowsBetweenStartAndEnd = allPagesRowIds.slice(start, end + 1);
      apiRef.current.selectRows(rowsBetweenStartAndEnd, isSelected, resetSelection);
    },
    [apiRef, logger],
  );

  const selectionPublicApi: GridRowSelectionApi = {
    selectRow,
    setRowSelectionModel,
    getSelectedRows,
    isRowSelected,
    isRowSelectable,
  };

  const selectionPrivateApi: GridRowMultiSelectionApi = {
    selectRows,
    selectRowRange,
  };

  useGridApiMethod(apiRef, selectionPublicApi, 'public');
  useGridApiMethod(
    apiRef,
    selectionPrivateApi,
    props.signature === GridSignature.DataGrid ? 'private' : 'public',
  );

  /*
   * EVENTS
   */
  const removeOutdatedSelection = React.useCallback(
    (sortModelUpdated = false) => {
      const currentSelection = gridRowSelectionStateSelector(apiRef.current.state);
      const rowsLookup = gridRowsLookupSelector(apiRef);
      const filteredRowsLookup = gridFilteredRowsLookupSelector(apiRef);

      // We clone the existing object to avoid mutating the same object returned by the selector to others part of the project
      const selectionLookup = { ...selectedIdsLookupSelector(apiRef) };

      const isNonExistent = (id: GridRowId) => {
        if (props.filterMode === 'server') {
          return !rowsLookup[id];
        }
        return filteredRowsLookup[id] !== true;
      };

      let hasChanged = false;
      currentSelection.forEach((id: GridRowId) => {
        if (isNonExistent(id)) {
          if (props.keepNonExistentRowsSelected) {
            return;
          }
          delete selectionLookup[id];
          hasChanged = true;
          return;
        }
        if (!props.rowSelectionPropagation?.parents) {
          return;
        }
        const node = tree[id];
        if (node.type === 'group') {
          const isAutoGenerated = (node as GridGroupNode).isAutoGenerated;
          if (isAutoGenerated) {
            delete selectionLookup[id];
            hasChanged = true;
            return;
          }
          // Keep previously selected tree data parents selected if all their children are filtered out
          if (!node.children.every((childId) => filteredRowsLookup[childId] === false)) {
            delete selectionLookup[id];
            hasChanged = true;
          }
        }
      });

      // For nested data, on row tree updation (filtering, adding rows, etc.) when the selection is
      // not empty, we need to re-run scanning of the tree to propagate the selection changes
      // Example: A parent whose de-selected children are filtered out should now be selected
      const shouldReapplyPropagation =
        isNestedData &&
        props.rowSelectionPropagation?.parents &&
        Object.keys(selectionLookup).length > 0;

      if (hasChanged || (shouldReapplyPropagation && !sortModelUpdated)) {
        const newSelection = Object.values(selectionLookup);
        if (shouldReapplyPropagation) {
          apiRef.current.selectRows(newSelection, true, true);
        } else {
          apiRef.current.setRowSelectionModel(newSelection);
        }
      }
    },
    [
      apiRef,
      isNestedData,
      props.rowSelectionPropagation?.parents,
      props.keepNonExistentRowsSelected,
      props.filterMode,
      tree,
    ],
  );

  const handleSingleRowSelection = React.useCallback(
    (id: GridRowId, event: React.MouseEvent | React.KeyboardEvent) => {
      const hasCtrlKey = event.metaKey || event.ctrlKey;

      // multiple selection is only allowed if:
      // - it is a checkboxSelection
      // - it is a keyboard selection
      // - Ctrl is pressed

      const isMultipleSelectionDisabled =
        !checkboxSelection && !hasCtrlKey && !isKeyboardEvent(event);
      const resetSelection = !canHaveMultipleSelection || isMultipleSelectionDisabled;
      const selectedRowsCount = apiRef.current.getSelectedRows().size;

      if (canHaveMultipleSelection && selectedRowsCount > 1 && !hasCtrlKey) {
        apiRef.current.selectRow(id, true, resetSelection);
      } else {
        const isSelected = apiRef.current.isRowSelected(id);
        apiRef.current.selectRow(id, !isSelected, resetSelection);
      }
    },
    [apiRef, canHaveMultipleSelection, checkboxSelection],
  );

  const handleRowClick = React.useCallback<GridEventListener<'rowClick'>>(
    (params, event) => {
      if (disableRowSelectionOnClick) {
        return;
      }

      const field = (event.target as HTMLDivElement)
        .closest(`.${gridClasses.cell}`)
        ?.getAttribute('data-field');

      if (field === GRID_CHECKBOX_SELECTION_COL_DEF.field) {
        // click on checkbox should not trigger row selection
        return;
      }

      if (field === GRID_DETAIL_PANEL_TOGGLE_FIELD) {
        // click to open the detail panel should not select the row
        return;
      }

      if (field) {
        const column = apiRef.current.getColumn(field);

        if (column?.type === GRID_ACTIONS_COLUMN_TYPE) {
          return;
        }
      }

      const rowNode = apiRef.current.getRowNode(params.id);
      if (rowNode!.type === 'pinnedRow') {
        return;
      }

      if (event.shiftKey && canHaveMultipleSelection) {
        expandMouseRowRangeSelection(params.id);
      } else {
        handleSingleRowSelection(params.id, event);
      }
    },
    [
      disableRowSelectionOnClick,
      canHaveMultipleSelection,
      apiRef,
      expandMouseRowRangeSelection,
      handleSingleRowSelection,
    ],
  );

  const preventSelectionOnShift = React.useCallback<GridEventListener<'cellMouseDown'>>(
    (params, event) => {
      if (canHaveMultipleSelection && event.shiftKey) {
        window.getSelection()?.removeAllRanges();
      }
    },
    [canHaveMultipleSelection],
  );

  const handleRowSelectionCheckboxChange = React.useCallback<
    GridEventListener<'rowSelectionCheckboxChange'>
  >(
    (params, event) => {
      if (canHaveMultipleSelection && (event.nativeEvent as any).shiftKey) {
        expandMouseRowRangeSelection(params.id);
      } else {
        apiRef.current.selectRow(params.id, params.value, !canHaveMultipleSelection);
      }
    },
    [apiRef, expandMouseRowRangeSelection, canHaveMultipleSelection],
  );

  const handleHeaderSelectionCheckboxChange = React.useCallback<
    GridEventListener<'headerSelectionCheckboxChange'>
  >(
    (params) => {
      const rowsToBeSelected =
        props.pagination && props.checkboxSelectionVisibleOnly && props.paginationMode === 'client'
          ? gridPaginatedVisibleSortedGridRowIdsSelector(apiRef)
          : gridExpandedSortedRowIdsSelector(apiRef);

      apiRef.current.selectRows(rowsToBeSelected, params.value);
    },
    [apiRef, props.checkboxSelectionVisibleOnly, props.pagination, props.paginationMode],
  );

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      // Get the most recent cell mode because it may have been changed by another listener
      if (apiRef.current.getCellMode(params.id, params.field) === GridCellModes.Edit) {
        return;
      }

      // Ignore portal
      // Do not apply shortcuts if the focus is not on the cell root component
      if (isEventTargetInPortal(event)) {
        return;
      }

      if (isNavigationKey(event.key) && event.shiftKey) {
        // The cell that has focus after the keyboard navigation
        const focusCell = gridFocusCellSelector(apiRef);
        if (focusCell && focusCell.id !== params.id) {
          event.preventDefault();

          const isNextRowSelected = apiRef.current.isRowSelected(focusCell.id);
          if (!canHaveMultipleSelection) {
            apiRef.current.selectRow(focusCell.id, !isNextRowSelected, true);
            return;
          }

          const newRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(focusCell.id);
          const previousRowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(params.id);

          let start: number;
          let end: number;

          if (newRowIndex > previousRowIndex) {
            if (isNextRowSelected) {
              // We are navigating to the bottom of the page and adding selected rows
              start = previousRowIndex;
              end = newRowIndex - 1;
            } else {
              // We are navigating to the bottom of the page and removing selected rows
              start = previousRowIndex;
              end = newRowIndex;
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (isNextRowSelected) {
              // We are navigating to the top of the page and removing selected rows
              start = newRowIndex + 1;
              end = previousRowIndex;
            } else {
              // We are navigating to the top of the page and adding selected rows
              start = newRowIndex;
              end = previousRowIndex;
            }
          }

          const rowsBetweenStartAndEnd = visibleRows.rows
            .slice(start, end + 1)
            .map((row) => row.id);
          apiRef.current.selectRows(rowsBetweenStartAndEnd, !isNextRowSelected);
          return;
        }
      }

      if (event.key === ' ' && event.shiftKey) {
        event.preventDefault();
        handleSingleRowSelection(params.id, event);
        return;
      }

      if (String.fromCharCode(event.keyCode) === 'A' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        selectRows(apiRef.current.getAllRowIds(), true);
      }
    },
    [apiRef, handleSingleRowSelection, selectRows, visibleRows.rows, canHaveMultipleSelection],
  );

  useGridApiEventHandler(
    apiRef,
    'sortedRowsSet',
    runIfRowSelectionIsEnabled(() => removeOutdatedSelection(true)),
  );
  useGridApiEventHandler(
    apiRef,
    'filteredRowsSet',
    runIfRowSelectionIsEnabled(removeOutdatedSelection),
  );
  useGridApiEventHandler(apiRef, 'rowClick', runIfRowSelectionIsEnabled(handleRowClick));
  useGridApiEventHandler(
    apiRef,
    'rowSelectionCheckboxChange',
    runIfRowSelectionIsEnabled(handleRowSelectionCheckboxChange),
  );
  useGridApiEventHandler(
    apiRef,
    'headerSelectionCheckboxChange',
    handleHeaderSelectionCheckboxChange,
  );
  useGridApiEventHandler(
    apiRef,
    'cellMouseDown',
    runIfRowSelectionIsEnabled(preventSelectionOnShift),
  );
  useGridApiEventHandler(apiRef, 'cellKeyDown', runIfRowSelectionIsEnabled(handleCellKeyDown));

  /*
   * EFFECTS
   */
  React.useEffect(() => {
    if (propRowSelectionModel !== undefined) {
      apiRef.current.setRowSelectionModel(propRowSelectionModel);
    }
  }, [apiRef, propRowSelectionModel, props.rowSelection]);

  React.useEffect(() => {
    if (!props.rowSelection) {
      apiRef.current.setRowSelectionModel([]);
    }
  }, [apiRef, props.rowSelection]);

  const isStateControlled = propRowSelectionModel != null;
  React.useEffect(() => {
    if (isStateControlled || !props.rowSelection) {
      return;
    }

    // props.isRowSelectable changed
    const currentSelection = gridRowSelectionStateSelector(apiRef.current.state);

    if (isRowSelectable) {
      const newSelection = currentSelection.filter((id) => isRowSelectable(id));

      if (newSelection.length < currentSelection.length) {
        apiRef.current.setRowSelectionModel(newSelection);
      }
    }
  }, [apiRef, isRowSelectable, isStateControlled, props.rowSelection]);

  React.useEffect(() => {
    if (!props.rowSelection || isStateControlled) {
      return;
    }

    const currentSelection = gridRowSelectionStateSelector(apiRef.current.state);
    if (!canHaveMultipleSelection && currentSelection.length > 1) {
      // See https://github.com/mui/mui-x/issues/8455
      apiRef.current.setRowSelectionModel([]);
    }
  }, [apiRef, canHaveMultipleSelection, checkboxSelection, isStateControlled, props.rowSelection]);

  React.useEffect(() => {
    runIfRowSelectionIsEnabled(removeOutdatedSelection);
  }, [removeOutdatedSelection, runIfRowSelectionIsEnabled]);
};
