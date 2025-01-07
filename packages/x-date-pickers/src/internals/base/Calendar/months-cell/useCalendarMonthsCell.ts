import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { useUtils } from '../../../hooks/useUtils';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';

export function useCalendarMonthsCell(parameters: useCalendarMonthsCell.Parameters) {
  const utils = useUtils();
  const { value, format = utils.formats.month, ctx } = parameters;

  const formattedValue = React.useMemo(
    () => utils.formatByString(value, format),
    [utils, value, format],
  );

  const isCurrent = React.useMemo(() => utils.isSameMonth(value, utils.date()), [utils, value]);

  const onClick = useEventCallback(() => {
    ctx.selectMonth(value);
  });

  const getMonthsCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        type: 'button' as const,
        role: 'radio',
        'aria-checked': ctx.isSelected,
        'aria-current': isCurrent ? 'date' : undefined,
        disabled: ctx.isDisabled,
        tabIndex: ctx.isTabbable ? 0 : -1,
        children: formattedValue,
        onClick,
      });
    },
    [formattedValue, ctx.isSelected, ctx.isDisabled, ctx.isTabbable, onClick, isCurrent],
  );

  return React.useMemo(() => ({ getMonthsCellProps, isCurrent }), [getMonthsCellProps, isCurrent]);
}

export namespace useCalendarMonthsCell {
  export interface Parameters {
    value: PickerValidDate;
    /**
     * The format used to display the month.
     * @default utils.formats.month
     */
    format?: string;
    ctx: Context;
  }

  export interface Context {
    isSelected: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
    isTabbable: boolean;
    selectMonth: (value: PickerValidDate) => void;
  }
}
