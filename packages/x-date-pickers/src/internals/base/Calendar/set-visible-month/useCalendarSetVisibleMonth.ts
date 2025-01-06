import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';

export function useCalendarSetVisibleMonth(parameters: useCalendarSetVisibleMonth.Parameters) {
  const { ctx } = parameters;

  const getSetVisibleMonthProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        type: 'button' as const,
        disabled: ctx.isDisabled,
        onClick: ctx.setTarget,
      });
    },
    [ctx.isDisabled, ctx.setTarget],
  );

  return React.useMemo(() => ({ getSetVisibleMonthProps }), [getSetVisibleMonthProps]);
}

export namespace useCalendarSetVisibleMonth {
  export interface Parameters {
    /**
     * The month to navigate to.
     */
    target: 'previous' | 'next' | PickerValidDate;
    ctx: Context;
  }

  export interface Context {
    setTarget: () => void;
    isDisabled: boolean;
  }
}
