import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { useUtils } from '../../../hooks/useUtils';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';

export function useCalendarMonthsCell(parameters: useCalendarMonthsCell.Parameters) {
  const utils = useUtils();
  const { value, format = utils.formats.monthShort, ctx } = parameters;

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
        children: formattedValue,
        onClick,
      });
    },
    [formattedValue, ctx.isSelected, onClick],
  );

  return React.useMemo(() => ({ getMonthCellProps }), [getMonthCellProps]);
}

export namespace useCalendarMonthsCell {
  export interface Parameters {
    value: PickerValidDate;
    /**
     * The format to use to display the month.
     * @default utils.formats.monthShort
     */
    format?: string;
    ctx: Context;
  }

  export interface Context {
    isSelected: boolean;
    selectMonth: (value: PickerValidDate) => void;
  }
}
