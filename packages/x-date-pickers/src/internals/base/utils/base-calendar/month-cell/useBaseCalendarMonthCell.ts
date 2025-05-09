import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { useUtils } from '../../../../hooks/useUtils';
import { HTMLProps } from '../../../base-utils/types';

export function useBaseCalendarMonthCell(
  parameters: useBaseCalendarMonthCell.Parameters,
): useBaseCalendarMonthCell.ReturnValue {
  const utils = useUtils();
  const { value, format = utils.formats.month, ctx } = parameters;

  const formattedValue = React.useMemo(
    () => utils.formatByString(value, format),
    [utils, value, format],
  );

  const onClick = useEventCallback(() => {
    ctx.selectMonth(value);
  });

  const props = React.useMemo<HTMLProps>(
    () => ({
      type: 'button' as const,
      role: 'radio',
      'aria-checked': ctx.isSelected,
      'aria-current': ctx.isCurrent ? 'date' : undefined,
      disabled: ctx.isDisabled,
      tabIndex: ctx.isTabbable ? 0 : -1,
      children: formattedValue,
      onClick,
    }),
    [formattedValue, ctx.isSelected, ctx.isDisabled, ctx.isTabbable, onClick, ctx.isCurrent],
  );

  return React.useMemo(() => ({ props }), [props]);
}

export namespace useBaseCalendarMonthCell {
  export interface Parameters {
    /**
     * The value to select when this cell is clicked.
     */
    value: PickerValidDate;
    /**
     * The format used to display the month.
     * @default utils.formats.month
     */
    format?: string;
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
  }

  export interface Context {
    isSelected: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
    isTabbable: boolean;
    isCurrent: boolean;
    selectMonth: (date: PickerValidDate) => void;
  }

  export interface ReturnValue {
    /**
     * The props to apply to the element.
     */
    props: HTMLProps;
  }
}
