import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import {
  GRID_TREE_DATA_GROUPING_FIELD,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
} from '../../../internals/constants';
import { isGroupingColumn } from '../../../internals/utils/gridRowGroupingUtils';
import { GridEventListener } from '../../../models/events';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  gridVisibleColumnDefinitionsSelector,
  gridVisibleColumnFieldsSelector,
} from '../columns/gridColumnsSelector';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { gridExpandedSortedRowEntriesSelector } from '../filter/gridFilterSelector';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '../../../colDef/gridCheckboxSelectionColDef';
import { gridClasses } from '../../../constants/gridClasses';
import { GridCellModes } from '../../../models/gridEditRowModel';
import { isNavigationKey } from '../../../utils/keyboardUtils';
import { GridRowId } from '../../../models';
import { gridFocusColumnGroupHeaderSelector } from '../focus';
import { gridColumnGroupsHeaderMaxDepthSelector } from '../columnGrouping/gridColumnGroupsSelector';
import {
  gridHeaderFilteringEditFieldSelector,
  gridHeaderFilteringMenuSelector,
} from '../headerFiltering/gridHeaderFilteringSelectors';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { isEventTargetInPortal } from '../../../utils/domUtils';
import {
  enrichPageRowsWithPinnedRows,
  getLeftColumnIndex,
  getRightColumnIndex,
  findNonRowSpannedCell,
} from './utils';
import { gridListColumnSelector } from '../listView/gridListViewSelectors';

/**
 * @requires useGridSorting (method) - can be after
 * @requires useGridFilter (state) - can be after
 * @requires useGridColumns (state, method) - can be after
 * @requires useGridDimensions (method) - can be after
 * @requires useGridFocus (method) - can be after
 * @requires useGridScroll (method) - can be after
 * @requires useGridColumnSpanning (method) - can be after
 */
export const useGridKeyboardNavigation = (
  apiRef: React.RefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'pagination'
    | 'paginationMode'
    | 'getRowId'
    | 'experimentalFeatures'
    | 'signature'
    | 'headerFilters'
    | 'unstable_listView'
  >,
): void => {
  const logger = useGridLogger(apiRef, 'useGridKeyboardNavigation');
  const initialCurrentPageRows = useGridVisibleRows(apiRef, props).rows;
  const isRtl = useRtl();
  const listView = props.unstable_listView;

  const currentPageRows = React.useMemo(
    () => enrichPageRowsWithPinnedRows(apiRef, initialCurrentPageRows),
    [apiRef, initialCurrentPageRows],
  );

  const headerFilteringEnabled = props.signature !== 'DataGrid' && props.headerFilters;

  /**
   * @param {number} colIndex Index of the column to focus
   * @param {GridRowId} rowId index of the row to focus
   * @param {string} closestColumnToUse Which closest column cell to use when the cell is spanned by `colSpan`.
   * @param {string} rowSpanScanDirection Which direction to search to find the next cell not hidden by `rowSpan`.
   * TODO replace with apiRef.current.moveFocusToRelativeCell()
   */
  const goToCell = React.useCallback(
    (
      colIndex: number,
      rowId: GridRowId,
      closestColumnToUse: 'left' | 'right' = 'left',
      rowSpanScanDirection: 'up' | 'down' = 'up',
    ) => {
      const visibleSortedRows = gridExpandedSortedRowEntriesSelector(apiRef);
      const nextCellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(rowId, colIndex);
      if (nextCellColSpanInfo && nextCellColSpanInfo.spannedByColSpan) {
        if (closestColumnToUse === 'left') {
          colIndex = nextCellColSpanInfo.leftVisibleCellIndex;
        } else if (closestColumnToUse === 'right') {
          colIndex = nextCellColSpanInfo.rightVisibleCellIndex;
        }
      }
      const field = listView
        ? gridListColumnSelector(apiRef.current.state)!.field
        : gridVisibleColumnFieldsSelector(apiRef)[colIndex];
      const nonRowSpannedRowId = findNonRowSpannedCell(apiRef, rowId, field, rowSpanScanDirection);
      // `scrollToIndexes` requires a rowIndex relative to all visible rows.
      // Those rows do not include pinned rows, but pinned rows do not need scroll anyway.
      const rowIndexRelativeToAllRows = visibleSortedRows.findIndex(
        (row) => row.id === nonRowSpannedRowId,
      );
      logger.debug(`Navigating to cell row ${rowIndexRelativeToAllRows}, col ${colIndex}`);
      apiRef.current.scrollToIndexes({
        colIndex,
        rowIndex: rowIndexRelativeToAllRows,
      });
      apiRef.current.setCellFocus(nonRowSpannedRowId, field);
    },
    [apiRef, logger, listView],
  );

  const goToHeader = React.useCallback(
    (colIndex: number, event: React.SyntheticEvent<Element>) => {
      logger.debug(`Navigating to header col ${colIndex}`);
      apiRef.current.scrollToIndexes({ colIndex });
      const field = apiRef.current.getVisibleColumns()[colIndex].field;
      apiRef.current.setColumnHeaderFocus(field, event);
    },
    [apiRef, logger],
  );

  const goToHeaderFilter = React.useCallback(
    (colIndex: number, event: React.SyntheticEvent<Element>) => {
      logger.debug(`Navigating to header filter col ${colIndex}`);
      apiRef.current.scrollToIndexes({ colIndex });
      const field = apiRef.current.getVisibleColumns()[colIndex].field;
      apiRef.current.setColumnHeaderFilterFocus(field, event);
    },
    [apiRef, logger],
  );

  const goToGroupHeader = React.useCallback(
    (colIndex: number, depth: number, event: React.SyntheticEvent<Element>) => {
      logger.debug(`Navigating to header col ${colIndex}`);
      apiRef.current.scrollToIndexes({ colIndex });
      const { field } = apiRef.current.getVisibleColumns()[colIndex];
      apiRef.current.setColumnGroupHeaderFocus(field, depth, event);
    },
    [apiRef, logger],
  );

  const getRowIdFromIndex = React.useCallback(
    (rowIndex: number) => {
      return currentPageRows[rowIndex]?.id;
    },
    [currentPageRows],
  );

  const handleColumnHeaderKeyDown = React.useCallback<GridEventListener<'columnHeaderKeyDown'>>(
    (params, event) => {
      const headerTitleNode = event.currentTarget.querySelector(
        `.${gridClasses.columnHeaderTitleContainerContent}`,
      );
      const isFromInsideContent =
        !!headerTitleNode && headerTitleNode.contains(event.target as Node | null);

      if (isFromInsideContent && params.field !== GRID_CHECKBOX_SELECTION_COL_DEF.field) {
        // When focus is on a nested input, keyboard events have no effect to avoid conflicts with native events.
        // There is one exception for the checkBoxHeader
        return;
      }

      const viewportPageSize = apiRef.current.getViewportPageSize();
      const colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
      const firstRowIndexInPage = currentPageRows.length > 0 ? 0 : null;
      const lastRowIndexInPage = currentPageRows.length - 1;
      const firstColIndex = 0;
      const lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
      const columnGroupMaxDepth = gridColumnGroupsHeaderMaxDepthSelector(apiRef);
      let shouldPreventDefault = true;

      switch (event.key) {
        case 'ArrowDown': {
          if (firstRowIndexInPage !== null) {
            if (headerFilteringEnabled) {
              goToHeaderFilter(colIndexBefore, event);
            } else {
              goToCell(colIndexBefore, getRowIdFromIndex(firstRowIndexInPage));
            }
          }
          break;
        }

        case 'ArrowRight': {
          const rightColIndex = getRightColumnIndex({
            currentColIndex: colIndexBefore,
            firstColIndex,
            lastColIndex,
            isRtl,
          });

          if (rightColIndex !== null) {
            goToHeader(rightColIndex, event);
          }

          break;
        }

        case 'ArrowLeft': {
          const leftColIndex = getLeftColumnIndex({
            currentColIndex: colIndexBefore,
            firstColIndex,
            lastColIndex,
            isRtl,
          });
          if (leftColIndex !== null) {
            goToHeader(leftColIndex, event);
          }
          break;
        }

        case 'ArrowUp': {
          if (columnGroupMaxDepth > 0) {
            goToGroupHeader(colIndexBefore, columnGroupMaxDepth - 1, event);
          }
          break;
        }

        case 'PageDown': {
          if (firstRowIndexInPage !== null && lastRowIndexInPage !== null) {
            goToCell(
              colIndexBefore,
              getRowIdFromIndex(
                Math.min(firstRowIndexInPage + viewportPageSize, lastRowIndexInPage),
              ),
            );
          }
          break;
        }

        case 'Home': {
          goToHeader(firstColIndex, event);
          break;
        }

        case 'End': {
          goToHeader(lastColIndex, event);
          break;
        }

        case 'Enter': {
          if (event.ctrlKey || event.metaKey) {
            apiRef.current.toggleColumnMenu(params.field);
          }
          break;
        }

        case ' ': {
          // prevent Space event from scrolling
          break;
        }

        default: {
          shouldPreventDefault = false;
        }
      }

      if (shouldPreventDefault) {
        event.preventDefault();
      }
    },
    [
      apiRef,
      currentPageRows.length,
      headerFilteringEnabled,
      goToHeaderFilter,
      goToCell,
      getRowIdFromIndex,
      isRtl,
      goToHeader,
      goToGroupHeader,
    ],
  );

  const handleHeaderFilterKeyDown = React.useCallback<GridEventListener<'headerFilterKeyDown'>>(
    (params, event) => {
      const isEditing = gridHeaderFilteringEditFieldSelector(apiRef) === params.field;
      const isHeaderMenuOpen = gridHeaderFilteringMenuSelector(apiRef) === params.field;

      if (isEditing || isHeaderMenuOpen || !isNavigationKey(event.key)) {
        return;
      }

      const viewportPageSize = apiRef.current.getViewportPageSize();
      const colIndexBefore = params.field ? apiRef.current.getColumnIndex(params.field) : 0;
      const firstRowIndexInPage = 0;
      const lastRowIndexInPage = currentPageRows.length - 1;
      const firstColIndex = 0;
      const lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;
      let shouldPreventDefault = true;

      switch (event.key) {
        case 'ArrowDown': {
          const rowId = getRowIdFromIndex(firstRowIndexInPage);
          if (firstRowIndexInPage !== null && rowId != null) {
            goToCell(colIndexBefore, rowId);
          }
          break;
        }

        case 'ArrowRight': {
          const rightColIndex = getRightColumnIndex({
            currentColIndex: colIndexBefore,
            firstColIndex,
            lastColIndex,
            isRtl,
          });

          if (rightColIndex !== null) {
            goToHeaderFilter(rightColIndex, event);
          }

          break;
        }

        case 'ArrowLeft': {
          const leftColIndex = getLeftColumnIndex({
            currentColIndex: colIndexBefore,
            firstColIndex,
            lastColIndex,
            isRtl,
          });
          if (leftColIndex !== null) {
            goToHeaderFilter(leftColIndex, event);
          } else {
            apiRef.current.setColumnHeaderFilterFocus(params.field, event);
          }
          break;
        }

        case 'ArrowUp': {
          goToHeader(colIndexBefore, event);
          break;
        }

        case 'PageDown': {
          if (firstRowIndexInPage !== null && lastRowIndexInPage !== null) {
            goToCell(
              colIndexBefore,
              getRowIdFromIndex(
                Math.min(firstRowIndexInPage + viewportPageSize, lastRowIndexInPage),
              ),
            );
          }
          break;
        }

        case 'Home': {
          goToHeaderFilter(firstColIndex, event);
          break;
        }

        case 'End': {
          goToHeaderFilter(lastColIndex, event);
          break;
        }

        case ' ': {
          // prevent Space event from scrolling
          break;
        }

        default: {
          shouldPreventDefault = false;
        }
      }

      if (shouldPreventDefault) {
        event.preventDefault();
      }
    },
    [
      apiRef,
      currentPageRows.length,
      goToHeaderFilter,
      isRtl,
      goToHeader,
      goToCell,
      getRowIdFromIndex,
    ],
  );

  const handleColumnGroupHeaderKeyDown = React.useCallback<
    GridEventListener<'columnGroupHeaderKeyDown'>
  >(
    (params, event) => {
      const focusedColumnGroup = gridFocusColumnGroupHeaderSelector(apiRef);
      if (focusedColumnGroup === null) {
        return;
      }
      const { field: currentField, depth: currentDepth } = focusedColumnGroup;

      const { fields, depth, maxDepth } = params;

      const viewportPageSize = apiRef.current.getViewportPageSize();
      const currentColIndex = apiRef.current.getColumnIndex(currentField);
      const colIndexBefore = currentField ? apiRef.current.getColumnIndex(currentField) : 0;
      const firstRowIndexInPage = 0;
      const lastRowIndexInPage = currentPageRows.length - 1;
      const firstColIndex = 0;
      const lastColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;

      let shouldPreventDefault = true;

      switch (event.key) {
        case 'ArrowDown': {
          if (depth === maxDepth - 1) {
            goToHeader(currentColIndex, event);
          } else {
            goToGroupHeader(currentColIndex, currentDepth + 1, event);
          }
          break;
        }

        case 'ArrowUp': {
          if (depth > 0) {
            goToGroupHeader(currentColIndex, currentDepth - 1, event);
          }
          break;
        }

        case 'ArrowRight': {
          const remainingRightColumns = fields.length - fields.indexOf(currentField) - 1;
          if (currentColIndex + remainingRightColumns + 1 <= lastColIndex) {
            goToGroupHeader(currentColIndex + remainingRightColumns + 1, currentDepth, event);
          }
          break;
        }

        case 'ArrowLeft': {
          const remainingLeftColumns = fields.indexOf(currentField);
          if (currentColIndex - remainingLeftColumns - 1 >= firstColIndex) {
            goToGroupHeader(currentColIndex - remainingLeftColumns - 1, currentDepth, event);
          }
          break;
        }

        case 'PageDown': {
          if (firstRowIndexInPage !== null && lastRowIndexInPage !== null) {
            goToCell(
              colIndexBefore,
              getRowIdFromIndex(
                Math.min(firstRowIndexInPage + viewportPageSize, lastRowIndexInPage),
              ),
            );
          }
          break;
        }

        case 'Home': {
          goToGroupHeader(firstColIndex, currentDepth, event);
          break;
        }

        case 'End': {
          goToGroupHeader(lastColIndex, currentDepth, event);
          break;
        }

        case ' ': {
          // prevent Space event from scrolling
          break;
        }

        default: {
          shouldPreventDefault = false;
        }
      }

      if (shouldPreventDefault) {
        event.preventDefault();
      }
    },
    [apiRef, currentPageRows.length, goToHeader, goToGroupHeader, goToCell, getRowIdFromIndex],
  );

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      // Ignore portal
      if (isEventTargetInPortal(event)) {
        return;
      }

      // Get the most recent params because the cell mode may have changed by another listener
      const cellParams = apiRef.current.getCellParams(params.id, params.field);

      if (cellParams.cellMode === GridCellModes.Edit || !isNavigationKey(event.key)) {
        return;
      }

      const canUpdateFocus = apiRef.current.unstable_applyPipeProcessors('canUpdateFocus', true, {
        event,
        cell: cellParams,
      });

      if (!canUpdateFocus) {
        return;
      }

      if (currentPageRows.length === 0) {
        return;
      }

      const viewportPageSize = apiRef.current.getViewportPageSize();

      const getColumnIndexFn = listView ? () => 0 : apiRef.current.getColumnIndex;
      const colIndexBefore = (params as GridCellParams).field
        ? getColumnIndexFn((params as GridCellParams).field)
        : 0;
      const rowIndexBefore = currentPageRows.findIndex((row) => row.id === params.id);
      const firstRowIndexInPage = 0;
      const lastRowIndexInPage = currentPageRows.length - 1;
      const firstColIndex = 0;
      const visibleColumns = listView
        ? [gridListColumnSelector(apiRef.current.state)]
        : gridVisibleColumnDefinitionsSelector(apiRef);
      const lastColIndex = visibleColumns.length - 1;
      let shouldPreventDefault = true;

      switch (event.key) {
        case 'ArrowDown': {
          // "Enter" is only triggered by the row / cell editing feature
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(
              colIndexBefore,
              getRowIdFromIndex(rowIndexBefore + 1),
              isRtl ? 'right' : 'left',
              'down',
            );
          }
          break;
        }

        case 'ArrowUp': {
          if (rowIndexBefore > firstRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(rowIndexBefore - 1));
          } else if (headerFilteringEnabled) {
            goToHeaderFilter(colIndexBefore, event);
          } else {
            goToHeader(colIndexBefore, event);
          }
          break;
        }

        case 'ArrowRight': {
          const rightColIndex = getRightColumnIndex({
            currentColIndex: colIndexBefore,
            firstColIndex,
            lastColIndex,
            isRtl,
          });
          if (rightColIndex !== null) {
            goToCell(rightColIndex, getRowIdFromIndex(rowIndexBefore), isRtl ? 'left' : 'right');
          }
          break;
        }

        case 'ArrowLeft': {
          const leftColIndex = getLeftColumnIndex({
            currentColIndex: colIndexBefore,
            firstColIndex,
            lastColIndex,
            isRtl,
          });
          if (leftColIndex !== null) {
            goToCell(leftColIndex, getRowIdFromIndex(rowIndexBefore), isRtl ? 'right' : 'left');
          }
          break;
        }

        case 'Tab': {
          // "Tab" is only triggered by the row / cell editing feature
          if (event.shiftKey && colIndexBefore > firstColIndex) {
            goToCell(colIndexBefore - 1, getRowIdFromIndex(rowIndexBefore), 'left');
          } else if (!event.shiftKey && colIndexBefore < lastColIndex) {
            goToCell(colIndexBefore + 1, getRowIdFromIndex(rowIndexBefore), 'right');
          }
          break;
        }

        case ' ': {
          const field = (params as GridCellParams).field;
          if (field === GRID_DETAIL_PANEL_TOGGLE_FIELD) {
            break;
          }
          const colDef = (params as GridCellParams).colDef;
          if (
            colDef &&
            (colDef.field === GRID_TREE_DATA_GROUPING_FIELD || isGroupingColumn(colDef.field))
          ) {
            break;
          }
          if (!event.shiftKey && rowIndexBefore < lastRowIndexInPage) {
            goToCell(
              colIndexBefore,
              getRowIdFromIndex(Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage)),
            );
          }
          break;
        }

        case 'PageDown': {
          if (rowIndexBefore < lastRowIndexInPage) {
            goToCell(
              colIndexBefore,
              getRowIdFromIndex(Math.min(rowIndexBefore + viewportPageSize, lastRowIndexInPage)),
            );
          }
          break;
        }

        case 'PageUp': {
          // Go to the first row before going to header
          const nextRowIndex = Math.max(rowIndexBefore - viewportPageSize, firstRowIndexInPage);
          if (nextRowIndex !== rowIndexBefore && nextRowIndex >= firstRowIndexInPage) {
            goToCell(colIndexBefore, getRowIdFromIndex(nextRowIndex));
          } else {
            goToHeader(colIndexBefore, event);
          }
          break;
        }

        case 'Home': {
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            goToCell(firstColIndex, getRowIdFromIndex(firstRowIndexInPage));
          } else {
            goToCell(firstColIndex, getRowIdFromIndex(rowIndexBefore));
          }
          break;
        }

        case 'End': {
          if (event.ctrlKey || event.metaKey || event.shiftKey) {
            goToCell(lastColIndex, getRowIdFromIndex(lastRowIndexInPage));
          } else {
            goToCell(lastColIndex, getRowIdFromIndex(rowIndexBefore));
          }
          break;
        }

        default: {
          shouldPreventDefault = false;
        }
      }

      if (shouldPreventDefault) {
        event.preventDefault();
      }
    },
    [
      apiRef,
      currentPageRows,
      isRtl,
      goToCell,
      getRowIdFromIndex,
      headerFilteringEnabled,
      goToHeaderFilter,
      goToHeader,
      listView,
    ],
  );

  const checkIfCanStartEditing = React.useCallback<GridPipeProcessor<'canStartEditing'>>(
    (initialValue, { event }) => {
      if (event.key === ' ') {
        // Space scrolls to the last row
        return false;
      }
      return initialValue;
    },
    [],
  );

  useGridRegisterPipeProcessor(apiRef, 'canStartEditing', checkIfCanStartEditing);

  useGridApiEventHandler(apiRef, 'columnHeaderKeyDown', handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, 'headerFilterKeyDown', handleHeaderFilterKeyDown);
  useGridApiEventHandler(apiRef, 'columnGroupHeaderKeyDown', handleColumnGroupHeaderKeyDown);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
};
