'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-internals/use-event-calendar';
import { StandaloneCompactDayTimeGridProps } from './CompactDayTimeGrid.types';
import { EventCalendarProvider } from '../internals/components/EventCalendarProvider';
import { EventDialogProvider } from '../internals/components/event-dialog';
import { CompactDayTimeGrid } from './CompactDayTimeGrid';

/**
 * A compact day/time grid optimized for mobile / narrow widths that can be used
 * outside of the Event Calendar.
 */
const StandaloneCompactDayTimeGrid = React.forwardRef(function StandaloneCompactDayTimeGrid<
  TEvent extends object,
  TResource extends object,
>(
  props: StandaloneCompactDayTimeGridProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { parameters, forwardedProps } = useExtractEventCalendarParameters<
    TEvent,
    TResource,
    typeof props
  >(props);

  return (
    <EventCalendarProvider {...parameters}>
      <EventDialogProvider>
        <CompactDayTimeGrid ref={forwardedRef} {...forwardedProps} />
      </EventDialogProvider>
    </EventCalendarProvider>
  );
}) as StandaloneCompactDayTimeGridComponent;

StandaloneCompactDayTimeGrid.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The number of days to display starting from the visible date.
   * - `1`: a single day.
   * - `3`: three consecutive days.
   * - `7`: the full week.
   * @default 3
   */
  dayCount: PropTypes.oneOf([1, 3, 7]),
} as any;

export { StandaloneCompactDayTimeGrid };

interface StandaloneCompactDayTimeGridComponent {
  <TEvent extends object, TResource extends object>(
    props: StandaloneCompactDayTimeGridProps<TEvent, TResource> & {
      ref?: React.ForwardedRef<HTMLDivElement>;
    },
  ): React.JSX.Element;
  propTypes?: any;
}
