import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { useUtils } from '../../../../hooks/useUtils';
import { mergeProps } from '../../../base-utils/mergeProps';

export function useBaseCalendarYearCell(parameters: useBaseCalendarYearCell.Parameters) {
  const utils = useUtils();
  const { value, format = utils.formats.year, ctx } = parameters;

  const formattedValue = React.useMemo(
    () => utils.formatByString(value, format),
    [utils, value, format],
  );

  const onClick = useEventCallback(() => {
    ctx.selectYear(value);
  });

  const getYearCellProps = React.useCallback(
    (externalProps = {}): React.ComponentPropsWithRef<'button'> => {
      return mergeProps(
        {
          type: 'button' as const,
          role: 'radio',
          'aria-checked': ctx.isSelected,
          'aria-current': ctx.isCurrent ? 'date' : undefined,
          disabled: ctx.isDisabled,
          tabIndex: ctx.isTabbable ? 0 : -1,
          children: formattedValue,
          onClick,
        },
        externalProps,
      );
    },
    [formattedValue, ctx.isSelected, ctx.isDisabled, ctx.isTabbable, onClick, ctx.isCurrent],
  );

  return React.useMemo(() => ({ getYearCellProps }), [getYearCellProps]);
}

export namespace useBaseCalendarYearCell {
  export interface Parameters {
    /**
     * The value to select when this cell is clicked.
     */
    value: PickerValidDate;
    /**
     * The format used to display the year.
     * @default utils.formats.year
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
    selectYear: (date: PickerValidDate) => void;
  }
}
