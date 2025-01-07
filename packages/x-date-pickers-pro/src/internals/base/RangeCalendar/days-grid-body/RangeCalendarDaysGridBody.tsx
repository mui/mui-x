'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { CompositeList } from '@mui/x-date-pickers/internals/base/composite/list/CompositeList';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysGridBody } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-grid-body/useBaseCalendarDaysGridBody';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarDaysGridBodyContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-grid-body/BaseCalendarDaysGridBodyContext';

const RangeCalendarDaysGridBody = React.forwardRef(function CalendarDaysGrid(
  props: RangeCalendarDaysGridBody.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getDaysGridBodyProps, context, calendarWeekRowRefs } = useBaseCalendarDaysGridBody({
    children,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysGridBodyProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarDaysGridBodyContext.Provider value={context}>
      <CompositeList elementsRef={calendarWeekRowRefs}>{renderElement()}</CompositeList>
    </BaseCalendarDaysGridBodyContext.Provider>
  );
});

export namespace RangeCalendarDaysGridBody {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarDaysGridBody.Parameters {}
}

export { RangeCalendarDaysGridBody };
