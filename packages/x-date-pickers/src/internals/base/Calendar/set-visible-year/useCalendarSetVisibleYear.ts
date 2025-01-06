import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';

export function useCalendarSetVisibleYear(parameters: useCalendarSetVisibleYear.Parameters) {
  const { ctx } = parameters;

  const getSetVisibleYearProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        type: 'button' as const,
        disabled: ctx.isDisabled,
        onClick: ctx.setTarget,
      });
    },
    [ctx.isDisabled, ctx.setTarget],
  );

  return React.useMemo(() => ({ getSetVisibleYearProps }), [getSetVisibleYearProps]);
}

export namespace useCalendarSetVisibleYear {
  export interface Parameters {
    /**
     * The year to navigate to.
     */
    target: 'previous' | 'next' | PickerValidDate;
    ctx: Context;
  }

  export interface Context {
    setTarget: () => void;
    isDisabled: boolean;
  }
}
