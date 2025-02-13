import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { useUtils } from '../../../../hooks/useUtils';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { BaseCalendarYearsGridOrListContext } from '../years-grid/BaseCalendarYearsGridOrListContext';
import { useCellList } from './useCellList';
import { useBaseCalendarRootVisibleDateContext } from '../root/BaseCalendarRootVisibleDateContext';

export function useYearsCells(parameters: useYearsCells.Parameters): useYearsCells.ReturnValue {
  const { getItems, focusOnMount } = parameters;
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

  const { scrollerRef } = useCellList({
    focusOnMount,
    section: 'year',
    value: baseRootVisibleDateContext.visibleDate,
  });

  const tabbableYears = React.useMemo(() => {
    let tempTabbableDays: PickerValidDate[] = [];
    tempTabbableDays = items.filter((day) =>
      baseRootContext.selectedDates.some((selectedDay) => utils.isSameYear(day, selectedDay)),
    );

    if (tempTabbableDays.length === 0) {
      tempTabbableDays = items.filter((day) => utils.isSameYear(day, baseRootContext.currentDate));
    }

    return tempTabbableDays;
  }, [baseRootContext.currentDate, baseRootContext.selectedDates, items, utils]);

  const yearsListOrGridContext = React.useMemo<BaseCalendarYearsGridOrListContext>(
    () => ({
      tabbableYears,
    }),
    [tabbableYears],
  );

  return { items, scrollerRef, yearsListOrGridContext };
}

export namespace useYearsCells {
  export interface Parameters extends useCellList.PublicParameters {
    /**
     * Generate the list of items to render the given visible date.
     * @param {GetCellsParameters} parameters The current parameters of the list.
     * @returns {PickerValidDate[]} The list of items.
     */
    getItems?: (parameters: GetCellsParameters) => PickerValidDate[];
  }

  export interface GetCellsParameters {
    visibleDate: PickerValidDate;
    minDate: PickerValidDate;
    maxDate: PickerValidDate;
    getDefaultItems: () => PickerValidDate[];
  }

  export interface ReturnValue extends useCellList.ReturnValue {
    yearsListOrGridContext: BaseCalendarYearsGridOrListContext;
    items: PickerValidDate[];
  }
}
