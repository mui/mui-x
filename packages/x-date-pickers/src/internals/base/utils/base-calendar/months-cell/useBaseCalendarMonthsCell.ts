import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { useUtils } from '../../../../hooks/useUtils';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';

export function useBaseCalendarMonthsCell(parameters: useBaseCalendarMonthsCell.Parameters) {
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

export namespace useBaseCalendarMonthsCell {
  export interface Parameters {
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
    selectMonth: (value: PickerValidDate) => void;
  }
}
