import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { PickerValidDate } from '../../../../../models';
import { ValidateDateProps } from '../../../../../validation';
import { useUtils } from '../../../../hooks/useUtils';
import type { useBaseCalendarDaysGridBody } from '../days-grid-body/useBaseCalendarDaysGridBody';
import {
  applyInitialFocusInGrid,
  navigateInGrid,
  NavigateInGridChangePage,
  PageGridNavigationTarget,
} from '../../../Calendar/utils/keyboardNavigation';
import { getFirstEnabledMonth, getLastEnabledMonth } from '../utils/date';
import { BaseCalendarRootContext } from './BaseCalendarRootContext';

/**
 * This logic needs to be in Calendar.Root to support multiple Calendar.DaysGrid.
 * We could introduce a Calendar.MultipleDaysGrid component that would handle this logic if we want to avoid having it in Calendar.Root.
 */
export function useBaseCalendarDaysGridNavigation(
  parameters: useBaseCalendarDaysGridNavigation.Parameters,
) {
  const { visibleDate, setVisibleDate, monthPageSize, dateValidationProps } = parameters;
  const utils = useUtils();
  const gridsRef = React.useRef<
    { cells: useBaseCalendarDaysGridBody.CellsRef; rows: useBaseCalendarDaysGridBody.RowsRef }[]
  >([]);
  const pageNavigationTargetRef = React.useRef<PageGridNavigationTarget | null>(null);

  const timeout = useTimeout();
  React.useEffect(() => {
    if (pageNavigationTargetRef.current) {
      const target = pageNavigationTargetRef.current;
      timeout.start(0, () => {
        const cells = getCellsInCalendar(gridsRef.current);
        applyInitialFocusInGrid({ cells, target });
      });
    }
  }, [visibleDate, timeout]);

  const applyDayGridKeyboardNavigation = useEventCallback((event: React.KeyboardEvent) => {
    const changePage: NavigateInGridChangePage = (params) => {
      // TODO: Jump over months with no valid date.
      if (params.direction === 'previous') {
        const targetDate = utils.addMonths(utils.startOfMonth(visibleDate), -monthPageSize);
        const lastMonthInNewPage = utils.addMonths(targetDate, monthPageSize - 1);

        // All the months before the visible ones are fully disabled, we skip the navigation.
        if (utils.isAfter(getFirstEnabledMonth(utils, dateValidationProps), lastMonthInNewPage)) {
          return;
        }

        setVisibleDate(utils.addMonths(visibleDate, -monthPageSize));
      }
      if (params.direction === 'next') {
        const targetDate = utils.addMonths(utils.startOfMonth(visibleDate), monthPageSize);

        // All the months after the visible ones are fully disabled, we skip the navigation.
        if (utils.isBefore(getLastEnabledMonth(utils, dateValidationProps), targetDate)) {
          return;
        }
        setVisibleDate(utils.addMonths(visibleDate, monthPageSize));
      }

      pageNavigationTargetRef.current = params.target;
    };

    const cells = getCellsInCalendar(gridsRef.current);
    navigateInGrid({ cells, event, changePage });
  });

  const registerDaysGridCells = useEventCallback(
    (
      gridCellsRef: useBaseCalendarDaysGridBody.CellsRef,
      gridRowsRef: useBaseCalendarDaysGridBody.RowsRef,
    ) => {
      gridsRef.current.push({ cells: gridCellsRef, rows: gridRowsRef });

      return () => {
        gridsRef.current = gridsRef.current.filter((entry) => entry.cells !== gridCellsRef);
      };
    },
  );

  return {
    registerDaysGridCells,
    applyDayGridKeyboardNavigation,
  };
}

export namespace useBaseCalendarDaysGridNavigation {
  export interface Parameters {
    visibleDate: PickerValidDate;
    setVisibleDate: (visibleDate: PickerValidDate) => void;
    monthPageSize: number;
    dateValidationProps: ValidateDateProps;
  }

  export interface ReturnValue
    extends Pick<
      BaseCalendarRootContext,
      'registerDaysGridCells' | 'applyDayGridKeyboardNavigation'
    > {}
}

/* eslint-disable no-bitwise */
function sortGridByDocumentPosition(a: HTMLElement[][], b: HTMLElement[][]) {
  const position = a[0][0].compareDocumentPosition(b[0][0]);

  if (
    position & Node.DOCUMENT_POSITION_FOLLOWING ||
    position & Node.DOCUMENT_POSITION_CONTAINED_BY
  ) {
    return -1;
  }

  if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
    return 1;
  }

  return 0;
}
/* eslint-enable no-bitwise */

function getCellsInCalendar(
  grids: {
    cells: useBaseCalendarDaysGridBody.CellsRef;
    rows: useBaseCalendarDaysGridBody.RowsRef;
  }[],
) {
  const cells: HTMLElement[][][] = [];

  for (let i = 0; i < grids.length; i += 1) {
    const grid = grids[i];
    const gridCells: HTMLElement[][] = [];
    for (let j = 0; j < grid.rows.current.length; j += 1) {
      const row = grid.rows.current[j];
      const rowCells = grid.cells.current
        .find((entry) => entry.rowRef.current === row)
        ?.cellsRef.current?.filter((cell) => cell !== null);
      if (rowCells && rowCells.length > 0) {
        gridCells.push(rowCells);
      }
    }

    if (gridCells.length > 0) {
      cells.push(gridCells);
    }
  }

  return cells.sort(sortGridByDocumentPosition);
}
