import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { useUtils } from '../../../../hooks/useUtils';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';

export function useBaseCalendarMonthCell(parameters: useBaseCalendarMonthCell.Parameters) {
  const utils = useUtils();
  const { value, format = utils.formats.month, ctx } = parameters;

  const formattedValue = React.useMemo(
    () => utils.formatByString(value, format),
    [utils, value, format],
  );

  const onClick = useEventCallback(() => {
    ctx.selectMonth(value);
  });

  const getMonthCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        type: 'button' as const,
        role: 'radio',
        'aria-checked': ctx.isSelected,
        'aria-current': ctx.isCurrent ? 'date' : undefined,
        disabled: ctx.isDisabled,
        tabIndex: ctx.isTabbable ? 0 : -1,
        children: formattedValue,
        onClick,
      });
    },
    [formattedValue, ctx.isSelected, ctx.isDisabled, ctx.isTabbable, onClick, ctx.isCurrent],
  );

  return React.useMemo(() => ({ getMonthCellProps }), [getMonthCellProps]);
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
}
