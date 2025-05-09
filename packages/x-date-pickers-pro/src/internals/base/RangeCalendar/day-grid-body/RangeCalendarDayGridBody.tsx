'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useRenderElement } from '@mui/x-date-pickers/internals/base/base-utils/useRenderElement';
// eslint-disable-next-line no-restricted-imports
import { CompositeList } from '@mui/x-date-pickers/internals/base/base-utils/composite/list/CompositeList';
// eslint-disable-next-line no-restricted-imports
import { CalendarDayGridBodyContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-grid-body/CalendarDayGridBodyContext';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDayGridBody } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-grid-body/useBaseCalendarDayGridBody';
import { useRangeCalendarRootContext } from '../root/RangeCalendarRootContext';

const RangeCalendarDayGridBody = React.forwardRef(function CalendarDayGrid(
  componentProps: RangeCalendarDayGridBody.Props,
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
    ...elementProps
  } = componentProps;

  const {
    props: baseProps,
    rowsRefs,
    context,
    ref,
  } = useBaseCalendarDayGridBody({
    children,
    fixedWeekNumber,
    focusOnMount,
    offset,
    freezeMonth,
  });

  const rootContext = useRangeCalendarRootContext();

  // TODO: Add the same for year and month list and year.
  const onMouseLeave = useEventCallback(() => {
    rootContext.setHoveredDate(null, 'day');
  });

  const props = React.useMemo(() => ({ onMouseLeave }), [onMouseLeave]);

  const state = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref],
    props: [baseProps, props, elementProps],
  });

  return (
    <CalendarDayGridBodyContext.Provider value={context}>
      <CompositeList elementsRef={rowsRefs}>{renderElement()}</CompositeList>
    </CalendarDayGridBodyContext.Provider>
  );
});

export namespace RangeCalendarDayGridBody {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarDayGridBody.Parameters {}
}

export { RangeCalendarDayGridBody };
