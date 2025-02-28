'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { CompositeList } from '@mui/x-date-pickers/internals/base/composite/list/CompositeList';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarDayGridBodyContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-grid-body/BaseCalendarDayGridBodyContext';
import { useRangeCalendarDayGridBody } from './useRangeCalendarDayGridBody';

const RangeCalendarDayGridBody = React.forwardRef(function CalendarDayGrid(
  props: RangeCalendarDayGridBody.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    fixedWeekNumber,
    focusOnMount,
    offset,
    freezeMonth,
    ...otherProps
  } = props;
  const { getDayGridBodyProps, rowsRefs, context, scrollerRef } = useRangeCalendarDayGridBody({
    children,
    fixedWeekNumber,
    focusOnMount,
    offset,
    freezeMonth,
  });
  const ref = useForkRef(scrollerRef, forwardedRef);
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDayGridBodyProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarDayGridBodyContext.Provider value={context}>
      <CompositeList elementsRef={rowsRefs}>{renderElement()}</CompositeList>
    </BaseCalendarDayGridBodyContext.Provider>
  );
});

export namespace RangeCalendarDayGridBody {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useRangeCalendarDayGridBody.Parameters {}
}

export { RangeCalendarDayGridBody };
