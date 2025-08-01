import * as React from 'react';
import { EventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import { useEventCalendar } from '../../primitives/use-event-calendar';

/**
 * Temporary component to help rendering standalone views in the doc.
 * A clean solution will be implemented later.
 */
export function StandaloneView(props: StandaloneViewProps) {
  const { children, ...other } = props;

  const contextValue = useEventCalendar(other);

  return (
    <EventCalendarContext.Provider value={contextValue}>{children}</EventCalendarContext.Provider>
  );
}

export interface StandaloneViewProps extends useEventCalendar.Parameters {
  children?: React.ReactNode;
}
