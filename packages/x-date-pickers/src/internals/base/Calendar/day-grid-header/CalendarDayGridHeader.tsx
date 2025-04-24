'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { useCalendarDayGridHeader } from './useCalendarDayGridHeader';

const CalendarDayGridHeader = React.forwardRef(function CalendarDayGridHeader(
  componentProps: CalendarDayGridHeader.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, ...elementProps } = componentProps;
  const { getDayGridHeaderProps } = useCalendarDayGridHeader({
    children,
  });
  const state = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: [getDayGridHeaderProps, elementProps],
  });

  return renderElement();
});

export namespace CalendarDayGridHeader {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarDayGridHeader.Parameters {}
}

export { CalendarDayGridHeader };
