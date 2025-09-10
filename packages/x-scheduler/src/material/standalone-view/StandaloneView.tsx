import * as React from 'react';
import { EventCalendarContext } from '../internals/hooks/useEventCalendarContext';
import {
  EventCalendarParameters,
  useEventCalendar,
  useExtractEventCalendarParameters,
} from '../../primitives/use-event-calendar';
import '../index.css';

/**
 * Temporary component to help rendering standalone views in the doc.
 * A clean solution will be implemented later.
 */
export function StandaloneView(props: StandaloneViewProps) {
  const { parameters, forwardedProps } = useExtractEventCalendarParameters(props);
  const contextValue = useEventCalendar(parameters);

  return (
    <EventCalendarContext.Provider value={contextValue}>
      {forwardedProps.children}
    </EventCalendarContext.Provider>
  );
}

export interface StandaloneViewProps extends EventCalendarParameters {
  // eslint-disable-next-line react/no-unused-prop-types
  children?: React.ReactNode;
}
