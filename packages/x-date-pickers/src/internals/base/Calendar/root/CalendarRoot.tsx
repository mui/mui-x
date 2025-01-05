'use client';
import * as React from 'react';
import { CalendarRootContext } from './CalendarRootContext';
import { useCalendarRoot } from './useCalendarRoot';

const CalendarRoot: React.FC<CalendarRoot.Props> = function CalendarRoot(props) {
  const { children } = props;
  const { context } = useCalendarRoot(props);

  return <CalendarRootContext.Provider value={context}>{children}</CalendarRootContext.Provider>;
};

export namespace CalendarRoot {
  export interface State {}

  export interface Props extends useCalendarRoot.Parameters {
    children: React.ReactNode;
  }

  export interface ValueChangeHandlerContext extends useCalendarRoot.ValueChangeHandlerContext {}
}

export { CalendarRoot };
