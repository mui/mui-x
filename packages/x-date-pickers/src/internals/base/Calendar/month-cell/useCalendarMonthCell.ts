import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { useUtils } from '../../../hooks/useUtils';

export function useCalendarMonthCell(parameters: useCalendarMonthCell.Parameters) {
  const { value, ctx } = parameters;
  const utils = useUtils();

  const onClick = useEventCallback(() => {
    ctx.selectMonth(value);
  });

  const getMonthCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        type: 'button' as const,
        role: 'radio',
        'aria-checked': ctx.isSelected,
        children: utils.format(value, 'monthShort'),
        onClick,
      });
    },
    [utils, value, ctx.isSelected, onClick],
  );

  return React.useMemo(() => ({ getMonthCellProps }), [getMonthCellProps]);
}

export namespace useCalendarMonthCell {
  export interface Parameters {
    value: PickerValidDate;
    ctx: Context;
  }

  export interface Context {
    isSelected: boolean;
    selectMonth: (value: PickerValidDate) => void;
  }
}
