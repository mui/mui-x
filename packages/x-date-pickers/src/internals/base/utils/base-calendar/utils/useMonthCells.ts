import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { getMonthsInYear } from '../../../../utils/date-utils';
import { useUtils } from '../../../../hooks/useUtils';
import { getFirstEnabledYear, getLastEnabledYear } from './date';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { BaseCalendarMonthCollectionContext } from './BaseCalendarMonthCollectionContext';
import { useCellList } from './useCellList';
import { useBaseCalendarRootVisibleDateContext } from '../root/BaseCalendarRootVisibleDateContext';

export function useMonthCells(parameters: useMonthCells.Parameters): useMonthCells.ReturnValue {
  const { getItems, focusOnMount, children } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();
  const utils = useUtils();

  const currentYear = React.useMemo(
    () => utils.startOfYear(baseRootVisibleDateContext.visibleDate),
    [utils, baseRootVisibleDateContext.visibleDate],
  );

  const items = React.useMemo(() => {
    const getDefaultItems = () => getMonthsInYear(utils, currentYear);

    if (getItems) {
      return getItems({
        year: currentYear,
        getDefaultItems,
      });
    }

    return getDefaultItems();
  }, [utils, getItems, currentYear]);

  const { scrollerRef } = useCellList({ focusOnMount, section: 'month', value: currentYear });

  const canCellBeTabbed = React.useMemo(() => {
    let tabbableCells: PickerValidDate[];
    const selectedAndVisibleCells = items.filter((day) =>
      baseRootContext.selectedDates.some((selectedDay) => utils.isSameMonth(day, selectedDay)),
    );
    if (selectedAndVisibleCells.length > 0) {
      tabbableCells = selectedAndVisibleCells;
    } else {
      const currentMonth = items.find((day) => utils.isSameMonth(day, baseRootContext.currentDate));
      if (currentMonth != null) {
        tabbableCells = [currentMonth];
      } else {
        tabbableCells = items.slice(0, 1);
      }
    }

    const format = `${utils.formats.year}/${utils.formats.month}`;
    const formattedTabbableCells = new Set(
      tabbableCells.map((day) => utils.formatByString(day, format)),
    );

    return (date: PickerValidDate) =>
      formattedTabbableCells.has(utils.formatByString(date, format));
  }, [baseRootContext.currentDate, baseRootContext.selectedDates, items, utils]);

  const monthsListOrGridContext = React.useMemo<BaseCalendarMonthCollectionContext>(
    () => ({
      canCellBeTabbed,
    }),
    [canCellBeTabbed],
  );

  const changePage = (direction: 'next' | 'previous') => {
    // TODO: Jump over months with no valid date.
    if (direction === 'previous') {
      const targetDate = utils.addYears(
        utils.startOfYear(baseRootVisibleDateContext.visibleDate),
        -baseRootContext.yearPageSize,
      );
      const lastYearInNewPage = utils.addYears(targetDate, baseRootContext.yearPageSize - 1);

      // All the years before the visible ones are fully disabled, we skip the navigation.
      if (
        utils.isAfter(
          getFirstEnabledYear(utils, baseRootContext.dateValidationProps),
          lastYearInNewPage,
        )
      ) {
        return;
      }

      baseRootContext.setVisibleDate(
        utils.addYears(baseRootVisibleDateContext.visibleDate, -baseRootContext.yearPageSize),
        false,
      );
    }
    if (direction === 'next') {
      const targetDate = utils.addYears(
        utils.startOfYear(baseRootVisibleDateContext.visibleDate),
        baseRootContext.yearPageSize,
      );

      // All the years after the visible ones are fully disabled, we skip the navigation.
      if (
        utils.isBefore(getLastEnabledYear(utils, baseRootContext.dateValidationProps), targetDate)
      ) {
        return;
      }
      baseRootContext.setVisibleDate(
        utils.addYears(baseRootVisibleDateContext.visibleDate, baseRootContext.yearPageSize),
        false,
      );
    }
  };

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({ months: items });
    }

    return children;
  }, [children, items]);

  return { resolvedChildren, monthsListOrGridContext, changePage, scrollerRef };
}

export namespace useMonthCells {
  export interface Parameters extends useCellList.PublicParameters {
    /**
     * Generate the list of items to render.
     * @param {GetItemsParameters} parameters The current parameters of the list.
     * @returns {PickerValidDate[]} The list of items.
     */
    getItems?: (parameters: GetItemsParameters) => PickerValidDate[];
    /**
     * The children of the component.
     * If a function is provided, it will be called with the list of the months to render as its parameter.
     */
    children?: React.ReactNode | ((parameters: ChildrenParameters) => React.ReactNode);
  }

  export interface ChildrenParameters {
    /**
     * The list of months to render.
     */
    months: PickerValidDate[];
  }

  export interface GetItemsParameters {
    /**
     * The visible year.
     */
    year: PickerValidDate;
    /**
     * A function that returns the items that would be rendered if getItems is not provided.
     * @returns {PickerValidDate[]} The list of the items to render.
     */
    getDefaultItems: () => PickerValidDate[];
  }

  export interface ReturnValue extends useCellList.ReturnValue {
    monthsListOrGridContext: BaseCalendarMonthCollectionContext;
    changePage: (direction: 'next' | 'previous') => void;
    resolvedChildren: React.ReactNode;
  }
}
