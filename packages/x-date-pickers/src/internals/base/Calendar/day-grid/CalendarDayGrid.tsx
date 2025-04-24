'use client';
import * as React from 'react';
import { useCalendarDayGrid } from './useCalendarDayGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';

const CalendarDayGrid = React.forwardRef(function CalendarDayGrid(
  componentProps: CalendarDayGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, ...elementProps } = componentProps;
  const { getDayGridProps } = useCalendarDayGrid();
  const state = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: [getDayGridProps, elementProps],
  });

  return renderElement();
});

export namespace CalendarDayGrid {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}

export { CalendarDayGrid };
