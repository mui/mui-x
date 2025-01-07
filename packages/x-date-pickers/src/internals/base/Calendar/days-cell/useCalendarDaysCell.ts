import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { useUtils } from '../../../hooks/useUtils';

export function useCalendarDaysCell(parameters: useCalendarDaysCell.Parameters) {
  const utils = useUtils();
  const { value, format = utils.formats.dayOfMonth, ctx } = parameters;

  const formattedValue = React.useMemo(
    () => utils.formatByString(value, format),
    [utils, value, format],
  );

  const isCurrent = React.useMemo(() => utils.isSameDay(value, utils.date()), [utils, value]);

  const onClick = useEventCallback(() => {
    ctx.selectDay(value);
  });

  const getDaysCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'gridcell',
        'aria-selected': ctx.isSelected,
        'aria-current': isCurrent ? 'date' : undefined,
        'aria-colindex': ctx.colIndex + 1,
        children: formattedValue,
        disabled: ctx.isDisabled,
        tabIndex: ctx.isTabbable ? 0 : -1,
        onClick,
      });
    },
    [
      formattedValue,
      ctx.isSelected,
      ctx.isDisabled,
      ctx.isTabbable,
      ctx.colIndex,
      isCurrent,
      onClick,
    ],
  );

  return React.useMemo(() => ({ getDaysCellProps, isCurrent }), [getDaysCellProps, isCurrent]);
}

export namespace useCalendarDaysCell {
  export interface Parameters {
    value: PickerValidDate;
    /**
     * The format used to display the day.
     * @default utils.formats.dayOfMonth
     */
    format?: string;
    ctx: useCalendarDaysCell.Context;
  }

  export interface Context {
    colIndex: number;
    isSelected: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
    isTabbable: boolean;
    isOutsideCurrentMonth: boolean;
    selectDay: (value: PickerValidDate) => void;
  }
}
