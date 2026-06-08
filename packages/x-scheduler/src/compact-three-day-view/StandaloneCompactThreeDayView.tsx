'use client';
import * as React from 'react';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-internals/use-event-calendar';
import { StandaloneCompactThreeDayViewProps } from './CompactThreeDayView.types';
import { EventCalendarProvider } from '../internals/components/EventCalendarProvider';
import { ResponsiveTypographyContainer } from '../internals/components/ResponsiveTypographyContainer';
import { CompactThreeDayView } from './CompactThreeDayView';

/**
 * A touch-optimized 3-Day View (3 days) for narrow widths that can be used outside of the
 * Event Calendar.
 */
const StandaloneCompactThreeDayView = React.forwardRef(function StandaloneCompactThreeDayView<
  TEvent extends object,
  TResource extends object,
>(
  props: StandaloneCompactThreeDayViewProps<TEvent, TResource>,
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
        <CompactThreeDayView ref={forwardedRef} {...forwardedProps} />
      </EventCalendarProvider>
    </ResponsiveTypographyContainer>
  );
}) as StandaloneCompactThreeDayViewComponent;

export { StandaloneCompactThreeDayView };

interface StandaloneCompactThreeDayViewComponent {
  <TEvent extends object, TResource extends object>(
    props: StandaloneCompactThreeDayViewProps<TEvent, TResource> & {
      ref?: React.ForwardedRef<HTMLDivElement>;
    },
  ): React.JSX.Element;
  propTypes?: any;
}
