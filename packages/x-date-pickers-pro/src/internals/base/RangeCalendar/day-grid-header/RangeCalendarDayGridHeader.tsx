'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDayGridHeader } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-grid-header/useBaseCalendarDayGridHeader';

const RangeCalendarDayGridHeader = React.forwardRef(function CalendarDayGridHeader(
  props: RangeCalendarDayGridHeader.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...otherProps } = props;
  const { getDayGridHeaderProps } = useBaseCalendarDayGridHeader({
    children,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDayGridHeaderProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

export namespace RangeCalendarDayGridHeader {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarDayGridHeader.Parameters {}
}

export { RangeCalendarDayGridHeader };
