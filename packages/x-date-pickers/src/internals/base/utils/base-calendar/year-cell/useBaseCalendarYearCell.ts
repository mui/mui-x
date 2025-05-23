import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { useUtils } from '../../../../hooks/useUtils';
import { HTMLProps } from '../../../base-utils/types';

export function useBaseCalendarYearCell(
  parameters: useBaseCalendarYearCell.Parameters,
): useBaseCalendarYearCell.ReturnValue {
  const utils = useUtils();
  const { value, format = utils.formats.year, ctx } = parameters;

  const formattedValue = React.useMemo(
    () => utils.formatByString(value, format),
    [utils, value, format],
  );

  const onClick = useEventCallback(() => {
    ctx.selectYear(value);
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
    [ctx.isSelected, ctx.isCurrent, ctx.isDisabled, ctx.isTabbable, formattedValue, onClick],
  );

  return React.useMemo(() => ({ props }), [props]);
}

export namespace useBaseCalendarYearCell {
  export interface PublicParameters {
    /**
     * The value to select when this cell is clicked.
     */
    value: PickerValidDate;
    /**
     * The format used to display the year.
     * @default utils.formats.year
     */
    format?: string;
  }

  export interface Parameters extends PublicParameters {
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
  }

  export interface ReturnValue {
    /**
     * The props to apply to the element.
     */
    props: HTMLProps;
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
