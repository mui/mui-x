'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { CompositeList } from '../../base-utils/composite/list/CompositeList';
import { BaseCalendarYearCollectionContext } from '../../utils/base-calendar/utils/BaseCalendarYearCollectionContext';
import { CalendarYearGridCssVars } from './CalendarYearGridCssVars';
import { CustomStyleHookMapping } from '../../base-utils/getStyleHookProps';
import { CalendarYearGridDataAttributes } from './CalendarYearGridDataAttributes';
import { PickerValidDate } from '../../../../models';
import { navigateInGrid } from '../../utils/base-calendar/utils/keyboardNavigation';
import { useYearCells } from '../utils/useYearCells';

const customStyleHookMapping: CustomStyleHookMapping<CalendarYearGrid.State> = {
  cellsPerRow(value) {
    return value ? { [CalendarYearGridDataAttributes.cellsPerRow]: value.toString() } : null;
  },
};

const CalendarYearGrid = React.forwardRef(function CalendarYearList(
  componentProps: CalendarYearGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, getItems, focusOnMount, ...elementProps } =
    componentProps;

  const yearsCellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { resolvedChildren, ref, yearsListOrGridContext } = useYearCells({
    getItems,
    focusOnMount,
    children,
  });

  const getCellsInCalendar = useEventCallback(() => {
    const grid: HTMLElement[][] = Array.from(
      {
        length: Math.ceil(yearsCellRefs.current.length / cellsPerRow),
      },
      () => [],
    );
    yearsCellRefs.current.forEach((cell, index) => {
      const rowIndex = Math.floor(index / cellsPerRow);
      if (cell != null) {
        grid[rowIndex].push(cell);
      }
    });

    return [grid];
  });

  // TODO: Add support for multiple years grids.
  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    navigateInGrid({
      cells: getCellsInCalendar(),
      event,
      changePage: undefined,
    });
  });

  const props = React.useMemo(
    () => ({
      role: 'radiogroup',
      children: resolvedChildren,
      onKeyDown,
      style: {
        [CalendarYearGridCssVars.calendarYearGridCellsPerRow]: cellsPerRow,
      } as React.CSSProperties,
    }),
    [resolvedChildren, onKeyDown, cellsPerRow],
  );

  const state = React.useMemo<CalendarYearGrid.State>(() => ({ cellsPerRow }), [cellsPerRow]);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref],
    props: [props, elementProps],
    customStyleHookMapping,
  });

  return (
    <BaseCalendarYearCollectionContext.Provider value={yearsListOrGridContext}>
      <CompositeList elementsRef={yearsCellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarYearCollectionContext.Provider>
  );
});

export namespace CalendarYearGrid {
  export interface State {
    /**
     * The number of cells per row.
     */
    cellsPerRow: number;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useYearCells.Parameters {
    /**
     * Cells rendered per row.
     * This is used to make sure the keyboard navigation works correctly.
     */
    cellsPerRow: number;
  }

  export interface ChildrenParameters {
    /**
     * The list of years to render.
     */
    years: PickerValidDate[];
  }
}

export { CalendarYearGrid };
