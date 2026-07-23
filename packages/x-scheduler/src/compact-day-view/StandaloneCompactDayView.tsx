'use client';
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-internals/use-event-calendar';
import type { StandaloneCompactDayViewProps } from './CompactDayView.types';
import { EventCalendarProvider } from '../internals/components/EventCalendarProvider';
import { EventDialogProvider } from '../internals/components/event-dialog';
import { ResponsiveTypographyContainer } from '../internals/components/ResponsiveTypographyContainer';
import { CompactDayView } from './CompactDayView';

/**
 * A touch-optimized Day View (1 day) for narrow widths that can be used outside of the
 * Event Calendar.
 */
const StandaloneCompactDayView = React.forwardRef(function StandaloneCompactDayView<
  TEvent extends object,
  TResource extends object,
>(
  inProps: StandaloneCompactDayViewProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiEventCalendar' });

  const { parameters, forwardedProps } = useExtractEventCalendarParameters<
    TEvent,
    TResource,
    typeof props
  >(props);

  const { localeText, ...other } = forwardedProps;

  return (
    <ResponsiveTypographyContainer>
      <EventCalendarProvider {...parameters} localeText={localeText}>
        <EventDialogProvider>
          <CompactDayView ref={forwardedRef} {...other} />
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
