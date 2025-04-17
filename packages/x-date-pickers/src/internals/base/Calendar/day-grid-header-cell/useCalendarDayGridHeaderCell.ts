import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { useUtils } from '../../../hooks/useUtils';

export function useCalendarDayGridHeaderCell(parameters: useCalendarDayGridHeaderCell.Parameters) {
  const utils = useUtils();

  const defaultFormatter = React.useCallback(
    (date: PickerValidDate) => utils.format(date, 'weekdayShort').charAt(0).toUpperCase(),
    [utils],
  );

  const { value, formatter = defaultFormatter } = parameters;

  const formattedValue = React.useMemo(() => formatter(value), [formatter, value]);
  const ariaLabel = React.useMemo(() => utils.format(value, 'weekday'), [utils, value]);

  const getDayGridHeaderCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'columnheader',
        'aria-label': ariaLabel,
        children: formattedValue,
      });
    },
    [formattedValue, ariaLabel],
  );

  return React.useMemo(() => ({ getDayGridHeaderCellProps }), [getDayGridHeaderCellProps]);
}

export namespace useCalendarDayGridHeaderCell {
  export interface Parameters {
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
