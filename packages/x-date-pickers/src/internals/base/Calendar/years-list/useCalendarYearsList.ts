import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { findClosestEnabledDate } from '../../../utils/date-utils';
import { useUtils } from '../../../hooks/useUtils';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { CalendarYearsListContext } from './CalendarYearsListContext';

const SUPPORTED_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];

function getActiveCells(calendarYearsCellRefs: { current: (HTMLElement | null)[] }): HTMLElement[] {
  const { current: cells } = calendarYearsCellRefs;

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

export function useCalendarYearsList(parameters: useCalendarYearsList.Parameters) {
  const { children, loop = true, alwaysVisible = false } = parameters;
  const utils = useUtils();
  const calendarRootContext = useCalendarRootContext();
  const calendarYearsCellRefs = React.useRef<(HTMLElement | null)[]>([]);

  const years = React.useMemo(
    () =>
      utils.getYearRange([
        calendarRootContext.validationProps.minDate,
        calendarRootContext.validationProps.maxDate,
      ]),
    [
      utils,
      calendarRootContext.validationProps.minDate,
      calendarRootContext.validationProps.maxDate,
    ],
  );

  const getYearListProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'radiogroup',
        children: children == null ? null : children({ years }),
        onKeyDown(event: React.KeyboardEvent) {
          if (!SUPPORTED_KEYS.includes(event.key)) {
            return;
          }

          event.preventDefault();

          const triggers = getActiveCells(calendarYearsCellRefs);
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
        },
      });
    },
    [years, children, loop],
  );

  const selectYear = useEventCallback((newValue: PickerValidDate) => {
    if (calendarRootContext.readOnly) {
      return;
    }

    const newCleanValue = utils.setYear(
      calendarRootContext.value ?? calendarRootContext.referenceDate,
      utils.getYear(newValue),
    );

    const startOfYear = utils.startOfYear(newCleanValue);
    const endOfYear = utils.endOfYear(newCleanValue);

    const closestEnabledDate = calendarRootContext.isDateDisabled(newCleanValue)
      ? findClosestEnabledDate({
          utils,
          date: newCleanValue,
          minDate: utils.isBefore(calendarRootContext.validationProps.minDate, startOfYear)
            ? startOfYear
            : calendarRootContext.validationProps.minDate,
          maxDate: utils.isAfter(calendarRootContext.validationProps.maxDate, endOfYear)
            ? endOfYear
            : calendarRootContext.validationProps.maxDate,
          disablePast: calendarRootContext.validationProps.disablePast,
          disableFuture: calendarRootContext.validationProps.disableFuture,
          isDateDisabled: calendarRootContext.isDateDisabled,
          timezone: calendarRootContext.timezone,
        })
      : newCleanValue;

    if (closestEnabledDate) {
      calendarRootContext.setValue(newCleanValue, 'year');
    }
  });

  const context: CalendarYearsListContext = React.useMemo(() => ({ selectYear }), [selectYear]);

  const shouldRender = calendarRootContext.activeSection === 'year' || alwaysVisible;

  return React.useMemo(
    () => ({ getYearListProps, context, calendarYearsCellRefs, shouldRender }),
    [getYearListProps, context, calendarYearsCellRefs, shouldRender],
  );
}

export namespace useCalendarYearsList {
  export interface Parameters {
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loop?: boolean;
    /**
     * If `true`, the year list will always be visible even when the active section is not 'year'.
     * @default false
     */
    alwaysVisible?: boolean;
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    years: PickerValidDate[];
  }
}
