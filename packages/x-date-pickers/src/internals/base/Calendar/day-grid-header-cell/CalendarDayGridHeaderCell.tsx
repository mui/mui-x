'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { PickerValidDate } from '../../../../models';
import { useUtils } from '../../../hooks/useUtils';

const CalendarDayGridHeaderCell = React.forwardRef(function CalendarDayGridHeaderCell(
  componentProps: CalendarDayGridHeaderCell.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const utils = useUtils();
  const defaultFormatter = React.useCallback(
    (date: PickerValidDate) => utils.format(date, 'weekdayShort').charAt(0).toUpperCase(),
    [utils],
  );

  const { className, render, value, formatter = defaultFormatter, ...otherProps } = componentProps;

  const formattedValue = React.useMemo(() => formatter(value), [formatter, value]);
  const ariaLabel = React.useMemo(() => utils.format(value, 'weekday'), [utils, value]);

  const props = React.useMemo(
    () => ({
      role: 'columnheader',
      'aria-label': ariaLabel,
      children: formattedValue,
    }),
    [formattedValue, ariaLabel],
  );

  const state: CalendarDayGridHeaderCell.State = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('span', componentProps, {
    state,
    ref: forwardedRef,
    props: [props, otherProps],
  });

  return renderElement();
});

export namespace CalendarDayGridHeaderCell {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'span', State> {
    value: PickerValidDate;
    /**
     * The formatter function used to display the day of the week.
     * @param {PickerValidDate} date The date to format.
     * @returns {string} The formatted date.
     * @default (date) => utils.format(date, 'weekdayShort').charAt(0).toUpperCase()
     */
    formatter?: (date: PickerValidDate) => string;
  }
}

const MemoizedCalendarDayGridHeaderCell = React.memo(CalendarDayGridHeaderCell);

export { MemoizedCalendarDayGridHeaderCell as CalendarDayGridHeaderCell };
