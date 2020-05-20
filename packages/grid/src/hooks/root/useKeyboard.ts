import {useEffect, useRef} from 'react';
import { useLogger } from '../utils/useLogger';
import { KEYDOWN_EVENT, KEYUP_EVENT, MULTIPLE_KEY_PRESS_CHANGED } from '../../constants/eventsConstants';

import { GridApiRef } from '../../grid';
import {
  findGridRootFromCurrent,
  findParentElementFromClassName,
  getCellElementFromIndexes,
  getDataFromElem,
  getIdFromRowElem,
  isCell,
} from '../../utils';
import { CELL_CSS_CLASS, ROW_CSS_CLASS } from '../../constants/cssClassesConstants';
import { CellIndexCoordinates } from '../../models';

const MULTIPLE_SELECTION_KEYS = ['Meta', 'Control'];
const isMultipleKey = (key: string): boolean => MULTIPLE_SELECTION_KEYS.indexOf(key) > -1;
const isTabKey = (key: string): boolean => key === 'Tab';
const isSpaceKey = (key: string): boolean => key === 'Space';
const isArrowKeys = (key: string): boolean => key.indexOf('Arrow') === 0;

const getNextCellIndexes = (code: string, indexes: CellIndexCoordinates) => {
  if (!isArrowKeys(code)) {
    throw new Error('first argument code should be an Arrow Key code');
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

export const useKeyboard = (initialised: boolean, apiRef: GridApiRef): void => {
  const logger = useLogger('useKeyboard');
  const isMultipleKeyPressed = useRef(false);

  const onMultipleKeyChange = (isPressed: boolean) => {
    isMultipleKeyPressed.current = isPressed;
    if (apiRef.current) {
      apiRef.current.emit(MULTIPLE_KEY_PRESS_CHANGED, isPressed);
    }
  };

  const navigateCells = (code: string)=> {
    const cellEl = findParentElementFromClassName(
      document.activeElement as HTMLDivElement,
      CELL_CSS_CLASS,
    )! as HTMLElement;
    cellEl.tabIndex = -1;
    const root = findGridRootFromCurrent(cellEl)!;

    let nextCellIndexes: CellIndexCoordinates;
    if(isArrowKeys(code)) {
      const colIndex = Number(getDataFromElem(cellEl, 'colIndex'));
      const rowIndex = Number(getDataFromElem(cellEl, 'rowIndex'));
      nextCellIndexes = getNextCellIndexes(code, { colIndex, rowIndex });
    } else {
      const colIdx = code === 'Home' ? 0 : apiRef.current!.getVisibleColumns().length - 1;

      if(!isMultipleKeyPressed.current) {
        //we go to the current row, first col, or last col!
        const rowIndex = Number(getDataFromElem(cellEl, 'rowIndex'));
        nextCellIndexes = {colIndex: colIdx, rowIndex};
      } else {
        //In that case we go to first row, first col, or last row last col!
        const rowIndex = colIdx === 0 ? 0 : apiRef.current!.getRowsCount() - 1;
        nextCellIndexes = {colIndex: colIdx, rowIndex};
      }
    }

    apiRef.current!.scrollToIndexes(nextCellIndexes);
    setTimeout(() => {
      const nextCell = getCellElementFromIndexes(root, nextCellIndexes);

      if (nextCell) {
        nextCell.tabIndex = 0;
        (nextCell as HTMLDivElement).focus();
      }
    }, 100);
  };

  const onKeyDownHandler = (e: KeyboardEvent) => {
    if (!e.target || !findGridRootFromCurrent(e.target as Element)) {
      logger.info('Outside the grid', e);
      return;
    }

    if (isMultipleKey(e.key)) {
      logger.debug('Multiple Select key pressed');
      onMultipleKeyChange(true);
    } else if (isTabKey(e.code)) {
      logger.debug('tab key pressed!');
      //TODO move to next section previous - headers-rows - next
    } else if ((e.code === 'End' || e.code === 'Home' || isArrowKeys(e.code)) && isCell(document.activeElement)) {
      navigateCells(e.code);

      logger.debug('Arrow and space keys need default behavior prevented');
      e.preventDefault();
      e.stopPropagation();

    } else if (isSpaceKey(e.code) && isCell(document.activeElement)) {
      logger.debug('Space pressed!');

      const rowEl = findParentElementFromClassName(
        document.activeElement as HTMLDivElement,
        ROW_CSS_CLASS,
      )! as HTMLElement;

      const rowId = getIdFromRowElem(rowEl);
      if (apiRef.current) {
        apiRef.current.selectRow(rowId);
      }

      logger.debug('Arrow and space keys need default behavior prevented');
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onKeyUpHandler = (e: KeyboardEvent) => {
    if (!e.target || !findGridRootFromCurrent(e.target as Element)) {
      logger.info('Outside the grid', e);
      return;
    }

    if (isMultipleKey(e.key)) {
      logger.debug('Multiple Select key released');
      onMultipleKeyChange(false);
    }
    // logger.info('Key up, stopping event ', e);
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (apiRef && apiRef.current && initialised) {
      logger.debug('Binding keyboard events');
      apiRef.current.on(KEYDOWN_EVENT, onKeyDownHandler);
      apiRef.current.on(KEYUP_EVENT, onKeyUpHandler);

      return () => {
        apiRef.current!.removeListener(KEYDOWN_EVENT, onKeyDownHandler);
        apiRef.current!.removeListener(KEYUP_EVENT, onKeyUpHandler);
        apiRef.current!.removeAllListeners(MULTIPLE_KEY_PRESS_CHANGED);
      };
    }
  }, [initialised]);
};
