'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { SchedulerValidDate } from '../../utils/adapter/types';
import { getAdapter } from '../../utils/adapter/getAdapter';

const DayGridRoot = React.forwardRef(function DayGridRoot(
  componentProps: DayGridRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const props = React.useMemo(() => ({ role: 'grid' }), []);

  const state: DayGridRoot.State = React.useMemo(() => ({}), []);

  return useRenderElement('table', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace DayGridRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'table', State> {}

  export interface ChildrenParameters {
    /**
     * Returns the weeks in the given month.
     * The returned value is an array where each element is a date object representing the first day of the week.
     * @param {GetWeeksInMonthParameters} parameters The parameters for the function.
     * @returns {SchedulerValidDate[]} The weeks in the given month.
     */
    getWeeksInMonth: (parameters: GetWeeksInMonthParameters) => SchedulerValidDate[];
  }

  export interface GetWeeksInMonthParameters {
    /**
     * The month to calculate the weeks for.
     */
    month: SchedulerValidDate;
    /**
     * The amount of weeks to return.
     * The method will add as many weeks as needed after the end of the month to match this value.
     * Put it to 6 to have a fixed number of weeks across months in Gregorian calendars.
     */
    fixedWeekNumber?: number;
  }
}

export { DayGridRoot };
