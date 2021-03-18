import * as React from 'react';
import { GRID_CELL_NAVIGATION_KEYDOWN } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridNavigationApi } from '../../../models/api/gridNavigationApi';
import { GridCellIndexCoordinates } from '../../../models/gridCell';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  isArrowKeys,
  isEnterKey,
  isHomeOrEndKeys,
  isPageKeys,
  isSpaceKey,
  isTabKey,
} from '../../../utils/keyboardUtils';
import { gridContainerSizesSelector } from '../../root/gridContainerSizesSelector';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { visibleGridColumnsLengthSelector } from '../columns/gridColumnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { gridPaginationSelector } from '../pagination/gridPaginationSelector';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';

const getNextCellIndexes = (code: string, indexes: GridCellIndexCoordinates) => {
  if (!isArrowKeys(code)) {
    throw new Error('Material-UI: The first argument (code) should be an arrow key code.');
  }

  if (code === 'ArrowLeft') {
    return { ...indexes, colIndex: indexes.colIndex - 1 };
  }
  if (code === 'ArrowRight') {
    return { ...indexes, colIndex: indexes.colIndex + 1 };
  }
  if (code === 'ArrowUp') {
    return { ...indexes, rowIndex: indexes.rowIndex - 1 };
  }
  // Last option code === 'ArrowDown'
  return { ...indexes, rowIndex: indexes.rowIndex + 1 };
};

export const useGridKeyboardNavigation = (
  gridRootRef: React.RefObject<HTMLDivElement>,
  apiRef: GridApiRef,
): void => {
  const logger = useLogger('useGridKeyboardNavigation');
  const options = useGridSelector(apiRef, optionsSelector);
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);
  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const colCount = useGridSelector(apiRef, visibleGridColumnsLengthSelector);
  const containerSizes = useGridSelector(apiRef, gridContainerSizesSelector);

  const mapKey = (event: React.KeyboardEvent) => {
    if (isEnterKey(event.key)) {
      return 'ArrowDown';
    }
    if (isTabKey(event.key)) {
      return event.shiftKey ? 'ArrowLeft' : 'ArrowRight';
    }
    return event.key;
  };

  const navigateCells = React.useCallback(
    (params: GridCellParams, event: React.KeyboardEvent) => {
      event.preventDefault();

      const key = mapKey(event);
      const isCtrlPressed = event.ctrlKey || event.metaKey || event.shiftKey;

      const cellEl = params.element!;
      cellEl.tabIndex = -1;

      const currentColIndex = Number(cellEl.getAttribute('aria-colindex'));
      const currentRowIndex = Number(cellEl.getAttribute('data-rowindex'));
      const rowCount = options.pagination
        ? paginationState.pageSize * (paginationState.page + 1)
        : totalRowCount;

      let nextCellIndexes: GridCellIndexCoordinates;
      if (isArrowKeys(key)) {
        nextCellIndexes = getNextCellIndexes(key, {
          colIndex: currentColIndex,
          rowIndex: currentRowIndex,
        });
      } else if (isHomeOrEndKeys(key)) {
        const colIdx = key === 'Home' ? 0 : colCount - 1;

        if (!isCtrlPressed) {
          // we go to the current row, first col, or last col!
          nextCellIndexes = { colIndex: colIdx, rowIndex: currentRowIndex };
        } else {
          // In that case we go to first row, first col, or last row last col!
          let rowIndex = 0;
          if (colIdx === 0) {
            rowIndex = options.pagination ? rowCount - paginationState.pageSize : 0;
          } else {
            rowIndex = rowCount - 1;
          }
          nextCellIndexes = { colIndex: colIdx, rowIndex };
        }
      } else if (isPageKeys(key) || isSpaceKey(key)) {
        const nextRowIndex =
          currentRowIndex +
          (key.indexOf('Down') > -1 || isSpaceKey(key)
            ? containerSizes!.viewportPageSize
            : -1 * containerSizes!.viewportPageSize);
        nextCellIndexes = { colIndex: currentColIndex, rowIndex: nextRowIndex };
      } else {
        throw new Error('Material-UI. Key not mapped to navigation behavior.');
      }

      nextCellIndexes.rowIndex = nextCellIndexes.rowIndex <= 0 ? 0 : nextCellIndexes.rowIndex;
      nextCellIndexes.rowIndex =
        nextCellIndexes.rowIndex >= rowCount && rowCount > 0
          ? rowCount - 1
          : nextCellIndexes.rowIndex;

      nextCellIndexes.colIndex = nextCellIndexes.colIndex <= 0 ? 0 : nextCellIndexes.colIndex;
      nextCellIndexes.colIndex =
        nextCellIndexes.colIndex >= colCount ? colCount - 1 : nextCellIndexes.colIndex;
      apiRef.current.setCellFocus(nextCellIndexes);
    },
    [
      options.pagination,
      paginationState.pageSize,
      paginationState.page,
      totalRowCount,
      colCount,
      apiRef,
      containerSizes,
    ],
  );

  const setCellFocus = React.useCallback(
    (nextCellIndexes: GridCellIndexCoordinates) => {
      apiRef.current.scrollToIndexes(nextCellIndexes);

      setGridState((state) => {
        logger.debug(
          `Focusing on cell with rowIndex=${nextCellIndexes.rowIndex} and colIndex=${nextCellIndexes.colIndex}`,
        );
        return { ...state, keyboard: { ...state.keyboard, cell: nextCellIndexes } };
      });
      forceUpdate();
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  useGridApiMethod<GridNavigationApi>(
    apiRef,
    {
      setCellFocus,
    },
    'GridNavigationApi',
  );
  useGridApiEventHandler(apiRef, GRID_CELL_NAVIGATION_KEYDOWN, navigateCells);
};
