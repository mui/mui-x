'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysGridHeader } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-grid-header/useBaseCalendarDaysGridHeader';

const RangeCalendarDaysGridHeader = React.forwardRef(function CalendarDaysGridHeader(
  props: RangeCalendarDaysGridHeader.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getDaysGridHeaderProps } = useBaseCalendarDaysGridHeader({
    children,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysGridHeaderProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

export namespace RangeCalendarDaysGridHeader {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarDaysGridHeader.Parameters {}
}

export { RangeCalendarDaysGridHeader };
