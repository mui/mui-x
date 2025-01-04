import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { findClosestEnabledDate, getMonthsInYear } from '../../../utils/date-utils';
import { useUtils } from '../../../hooks/useUtils';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { CalendarMonthsListContext } from './CalendarMonthsListContext';

const SUPPORTED_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];

function getActiveCells(calendarMonthsCellRefs: {
  current: (HTMLElement | null)[];
}): HTMLElement[] {
  const { current: cells } = calendarMonthsCellRefs;

  const output: HTMLElement[] = [];

  for (let i = 0; i < cells.length; i += 1) {
    const cell = cells[i];
    if (isNavigable(cell)) {
      output.push(cell);
    }
  }

  return output;
}

function isNavigable(element: HTMLElement | null): element is HTMLElement {
  return (
    element !== null &&
    !element.hasAttribute('disabled') &&
    element.getAttribute('data-disabled') !== 'true'
  );
}

export function useCalendarMonthsList(parameters: useCalendarMonthsList.Parameters) {
  const { children, loop = true, alwaysVisible = false } = parameters;
  const utils = useUtils();
  const calendarRootContext = useCalendarRootContext();
  const calendarMonthsCellRefs = React.useRef<(HTMLElement | null)[]>([]);

  const months = React.useMemo(
    () => getMonthsInYear(utils, calendarRootContext.value ?? calendarRootContext.referenceDate),
    [utils, calendarRootContext.value, calendarRootContext.referenceDate],
  );

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    if (!SUPPORTED_KEYS.includes(event.key)) {
      return;
    }

    event.preventDefault();

    const triggers = getActiveCells(calendarMonthsCellRefs);
    const numOfEnabledTriggers = triggers.length;
    const lastIndex = numOfEnabledTriggers - 1;

    let nextIndex = -1;

    const thisIndex = triggers.indexOf(event.target as HTMLButtonElement);

    switch (event.key) {
      case 'ArrowDown':
        if (loop) {
          nextIndex = thisIndex + 1 > lastIndex ? 0 : thisIndex + 1;
        } else {
          nextIndex = Math.min(thisIndex + 1, lastIndex);
        }
        break;
      case 'ArrowUp':
        if (loop) {
          nextIndex = thisIndex === 0 ? lastIndex : thisIndex - 1;
        } else {
          nextIndex = thisIndex - 1;
        }
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = lastIndex;
        break;
      default:
        break;
    }

    if (nextIndex > -1) {
      triggers[nextIndex].focus();
    }
  });

  const getMonthListProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'radiogroup',
        children: children == null ? null : children({ months }),
        onKeyDown,
      });
    },
    [months, children, onKeyDown],
  );

  const selectMonth = useEventCallback((newValue: PickerValidDate) => {
    if (calendarRootContext.readOnly) {
      return;
    }

    const newCleanValue = utils.setMonth(
      calendarRootContext.value ?? calendarRootContext.referenceDate,
      utils.getMonth(newValue),
    );

    const startOfMonth = utils.startOfMonth(newCleanValue);
    const endOfMonth = utils.endOfMonth(newCleanValue);

    const closestEnabledDate = calendarRootContext.isDateDisabled(newCleanValue)
      ? findClosestEnabledDate({
          utils,
          date: newCleanValue,
          minDate: utils.isBefore(calendarRootContext.validationProps.minDate, startOfMonth)
            ? startOfMonth
            : calendarRootContext.validationProps.minDate,
          maxDate: utils.isAfter(calendarRootContext.validationProps.maxDate, endOfMonth)
            ? endOfMonth
            : calendarRootContext.validationProps.maxDate,
          disablePast: calendarRootContext.validationProps.disablePast,
          disableFuture: calendarRootContext.validationProps.disableFuture,
          isDateDisabled: calendarRootContext.isDateDisabled,
          timezone: calendarRootContext.timezone,
        })
      : newCleanValue;

    if (closestEnabledDate) {
      calendarRootContext.setValue(newCleanValue, 'month');
    }
  });

  const context: CalendarMonthsListContext = React.useMemo(() => ({ selectMonth }), [selectMonth]);

  const shouldRender = calendarRootContext.activeSection === 'month' || alwaysVisible;

  return React.useMemo(
    () => ({ getMonthListProps, context, calendarMonthsCellRefs, shouldRender }),
    [getMonthListProps, context, calendarMonthsCellRefs, shouldRender],
  );
}

export namespace useCalendarMonthsList {
  export interface Parameters {
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loop?: boolean;
    /**
     * If `true`, the month list will always be visible even when the active section is not 'month'.
     * @default false
     */
    alwaysVisible?: boolean;
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    months: PickerValidDate[];
  }
}
