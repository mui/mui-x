'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { BaseUIComponentProps, HTMLProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { CompositeList } from '../../base-utils/composite/list/CompositeList';
import { CalendarMonthGridCssVars } from './CalendarMonthGridCssVars';
import { BaseCalendarMonthCollectionContext } from '../../utils/base-calendar/utils/BaseCalendarMonthCollectionContext';
import { CustomStyleHookMapping } from '../../base-utils/getStyleHookProps';
import { CalendarMonthGridDataAttributes } from './CalendarMonthGridDataAttributes';
import {
  applyInitialFocusInGrid,
  navigateInGrid,
  NavigateInGridChangePage,
  PageGridNavigationTarget,
} from '../../utils/base-calendar/utils/keyboardNavigation';
import { useMonthCells } from '../utils/useMonthCells';
import { useBaseCalendarRootVisibleDateContext } from '../../utils/base-calendar/root/BaseCalendarRootVisibleDateContext';

const customStyleHookMapping: CustomStyleHookMapping<CalendarMonthGrid.State> = {
  cellsPerRow(value) {
    return value ? { [CalendarMonthGridDataAttributes.cellsPerRow]: value.toString() } : null;
  },
};

const CalendarMonthGrid = React.forwardRef(function CalendarMonthList(
  componentProps: CalendarMonthGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    getItems,
    focusOnMount,
    cellsPerRow,
    canChangeYear,
    ...elementProps
  } = componentProps;

  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();
  const cellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { resolvedChildren, monthsListOrGridContext, changePage, ref } = useMonthCells({
    getItems,
    focusOnMount,
    children,
  });
  const pageNavigationTargetRef = React.useRef<PageGridNavigationTarget | null>(null);

  const getCellsInCalendar = useEventCallback(() => {
    const grid: HTMLElement[][] = Array.from(
      {
        length: Math.ceil(cellRefs.current.length / cellsPerRow),
      },
      () => [],
    );
    cellRefs.current.forEach((cell, index) => {
      const rowIndex = Math.floor(index / cellsPerRow);
      if (cell != null) {
        grid[rowIndex].push(cell);
      }
    });

    return [grid];
  });

  const timeout = useTimeout();
  React.useEffect(() => {
    if (pageNavigationTargetRef.current) {
      const target = pageNavigationTargetRef.current;
      timeout.start(0, () => {
        const cells = getCellsInCalendar();
        applyInitialFocusInGrid({ cells, target });
      });
    }
  }, [baseRootVisibleDateContext.visibleDate, timeout, getCellsInCalendar]);

  // TODO: Add support for multiple months grids.
  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    const changeGridPage: NavigateInGridChangePage = (params) => {
      changePage(params.direction);

      pageNavigationTargetRef.current = params.target;
    };

    navigateInGrid({
      cells: getCellsInCalendar(),
      event,
      changePage: canChangeYear ? changeGridPage : undefined,
    });
  });

  const props = React.useMemo<HTMLProps>(
    () => ({
      role: 'radiogroup',
      children: resolvedChildren,
      onKeyDown,
      style: {
        [CalendarMonthGridCssVars.calendarMonthGridCellsPerRow]: cellsPerRow,
      } as React.CSSProperties,
    }),
    [resolvedChildren, onKeyDown, cellsPerRow],
  );

  const state = React.useMemo<CalendarMonthGrid.State>(() => ({ cellsPerRow }), [cellsPerRow]);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref],
    props: [props, elementProps],
    customStyleHookMapping,
  });

  return (
    <BaseCalendarMonthCollectionContext.Provider value={monthsListOrGridContext}>
      <CompositeList elementsRef={cellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarMonthCollectionContext.Provider>
  );
});

export namespace CalendarMonthGrid {
  export interface State {
    /**
     * The number of cells per row.
     */
    cellsPerRow: number;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useMonthCells.Parameters {
    /**
     * The number of cells per row.
     * This is used to make sure the keyboard navigation works correctly.
     */
    cellsPerRow: number;
    /**
     * Whether to go to the previous / next year
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    canChangeYear?: boolean;
  }
}

export { CalendarMonthGrid };
