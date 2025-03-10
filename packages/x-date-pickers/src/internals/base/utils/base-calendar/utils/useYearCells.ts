import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { useUtils } from '../../../../hooks/useUtils';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { BaseCalendarYearCollectionContext } from './BaseCalendarYearCollectionContext';
import { useRegisterSection } from './useRegisterSection';
import { useBaseCalendarRootVisibleDateContext } from '../root/BaseCalendarRootVisibleDateContext';
import { useScrollableList } from '../../useScrollableList';

export function useYearCells(parameters: useYearCells.Parameters): useYearCells.ReturnValue {
  const { getItems, focusOnMount, children } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();
  const utils = useUtils();

  const items = React.useMemo(() => {
    const getDefaultItems = () =>
      utils.getYearRange([
        baseRootContext.dateValidationProps.minDate,
        baseRootContext.dateValidationProps.maxDate,
      ]);
    if (getItems) {
      return getItems({
        visibleDate: baseRootVisibleDateContext.visibleDate,
        minDate: baseRootContext.dateValidationProps.minDate,
        maxDate: baseRootContext.dateValidationProps.maxDate,
        getDefaultItems,
      });
    }

    return getDefaultItems();
  }, [
    utils,
    getItems,
    baseRootVisibleDateContext.visibleDate,
    baseRootContext.dateValidationProps.minDate,
    baseRootContext.dateValidationProps.maxDate,
  ]);

  const { scrollerRef } = useScrollableList({ focusOnMount });
  useRegisterSection({
    section: 'year',
    value: baseRootVisibleDateContext.visibleDate,
  });

  const canCellBeTabbed = React.useMemo(() => {
    let tabbableCells: PickerValidDate[];
    const selectedAndVisibleCells = items.filter((day) =>
      baseRootContext.selectedDates.some((selectedDay) => utils.isSameYear(day, selectedDay)),
    );
    if (selectedAndVisibleCells.length > 0) {
      tabbableCells = selectedAndVisibleCells;
    } else {
      const currentYear = items.find((day) => utils.isSameYear(day, baseRootContext.currentDate));
      if (currentYear != null) {
        tabbableCells = [currentYear];
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

  const yearsListOrGridContext = React.useMemo<BaseCalendarYearCollectionContext>(
    () => ({
      canCellBeTabbed,
    }),
    [canCellBeTabbed],
  );

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({ years: items });
    }

    return children;
  }, [children, items]);

  return { resolvedChildren, scrollerRef, yearsListOrGridContext };
}

export namespace useYearCells {
  export interface Parameters extends useScrollableList.Parameters {
    /**
     * Generate the list of items to render.
     * @param {GetItemsParameters} parameters The current parameters of the list.
     * @returns {PickerValidDate[]} The list of items.
     */
    getItems?: (parameters: GetItemsParameters) => PickerValidDate[];
    /**
     * The children of the component.
     * If a function is provided, it will be called with the list of the years to render as its parameter.
     */
    children?: React.ReactNode | ((parameters: ChildrenParameters) => React.ReactNode);
  }

  export interface ChildrenParameters {
    years: PickerValidDate[];
  }

  export interface GetItemsParameters {
    /**
     * The visible date.
     */
    visibleDate: PickerValidDate;
    /**
     * The minimum valid date of the calendar.
     */
    minDate: PickerValidDate;
    /**
     * The maximum valid date of the calendar.
     */
    maxDate: PickerValidDate;
    /**
     * A function that returns the items that would be rendered if getItems is not provided.
     * @returns {PickerValidDate[]} The list of the items to render.
     */
    getDefaultItems: () => PickerValidDate[];
  }

  export interface ReturnValue extends useScrollableList.ReturnValue {
    yearsListOrGridContext: BaseCalendarYearCollectionContext;
    resolvedChildren: React.ReactNode;
  }
}
