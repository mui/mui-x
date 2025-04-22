import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeProps } from '../../base-utils/mergeProps';

export function useCalendarSetVisibleYear(parameters: useCalendarSetVisibleYear.Parameters) {
  const { ctx } = parameters;

  const getSetVisibleYearProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeProps(externalProps, {
        type: 'button' as const,
        disabled: ctx.isDisabled,
        onClick: ctx.setTarget,
        tabIndex: ctx.isTabbable ? 0 : -1,
      });
    },
    [ctx.isDisabled, ctx.setTarget, ctx.isTabbable],
  );

  return React.useMemo(() => ({ getSetVisibleYearProps }), [getSetVisibleYearProps]);
}

export namespace useCalendarSetVisibleYear {
  export interface Parameters {
    /**
     * The year to navigate to.
     */
    target: 'previous' | 'next' | PickerValidDate;
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
  }

  export interface Context {
    setTarget: () => void;
    isDisabled: boolean;
    isTabbable: boolean;
    direction: 'before' | 'after';
  }
}
