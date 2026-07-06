'use client';
import * as React from 'react';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-internals/use-event-calendar';
import type { StandaloneCompactDayViewProps } from './CompactDayView.types';
import { EventCalendarProvider } from '../internals/components/EventCalendarProvider';
import { EventDialogProvider } from '../internals/components/event-dialog';
import { ResponsiveTypographyContainer } from '../internals/components/ResponsiveTypographyContainer';
import { CompactDayView } from './CompactDayView';

/**
 * A touch-optimized Day View (1 day) for narrow widths that can be used outside of the
 * Event Calendar.
 *
 * @warning This component is unstable. We are actively improving the Scheduler's mobile experience,
 * so its behavior and API may change in a future release.
 */
const StandaloneCompactDayView = React.forwardRef(function StandaloneCompactDayView<
  TEvent extends object,
  TResource extends object,
>(
  props: StandaloneCompactDayViewProps<TEvent, TResource>,
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
        <EventDialogProvider>
          <CompactDayView ref={forwardedRef} {...forwardedProps} />
        </EventDialogProvider>
      </EventCalendarProvider>
    </ResponsiveTypographyContainer>
  );
}) as StandaloneCompactDayViewComponent;

export { StandaloneCompactDayView };

interface StandaloneCompactDayViewComponent {
  <TEvent extends object, TResource extends object>(
    props: StandaloneCompactDayViewProps<TEvent, TResource> & {
      ref?: React.ForwardedRef<HTMLDivElement>;
    },
  ): React.JSX.Element;
  propTypes?: any;
}
