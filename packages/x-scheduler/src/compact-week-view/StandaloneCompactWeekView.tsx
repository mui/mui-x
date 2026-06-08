'use client';
import * as React from 'react';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-internals/use-event-calendar';
import { StandaloneCompactWeekViewProps } from './CompactWeekView.types';
import { EventCalendarProvider } from '../internals/components/EventCalendarProvider';
import { ResponsiveTypographyContainer } from '../internals/components/ResponsiveTypographyContainer';
import { CompactWeekView } from './CompactWeekView';

/**
 * A touch-optimized Week View (7 days) for narrow widths that can be used outside of the
 * Event Calendar.
 */
const StandaloneCompactWeekView = React.forwardRef(function StandaloneCompactWeekView<
  TEvent extends object,
  TResource extends object,
>(
  props: StandaloneCompactWeekViewProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { parameters, forwardedProps } = useExtractEventCalendarParameters<
    TEvent,
    TResource,
    typeof props
  >(props);

  return (
    <ResponsiveTypographyContainer>
      <EventCalendarProvider {...parameters}>
        <CompactWeekView ref={forwardedRef} {...forwardedProps} />
      </EventCalendarProvider>
    </ResponsiveTypographyContainer>
  );
}) as StandaloneCompactWeekViewComponent;

export { StandaloneCompactWeekView };

interface StandaloneCompactWeekViewComponent {
  <TEvent extends object, TResource extends object>(
    props: StandaloneCompactWeekViewProps<TEvent, TResource> & {
      ref?: React.ForwardedRef<HTMLDivElement>;
    },
  ): React.JSX.Element;
  propTypes?: any;
}
