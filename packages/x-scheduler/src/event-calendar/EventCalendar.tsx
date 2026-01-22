'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { styled, useThemeProps } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { EventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import {
  useEventCalendar,
  useExtractEventCalendarParameters,
} from '@mui/x-scheduler-headless/use-event-calendar';
import {
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { EventCalendarProps } from './EventCalendar.types';
import { WeekView } from '../week-view/WeekView';
import { AgendaView } from '../agenda-view';
import { DayView } from '../day-view/DayView';
import { TranslationsProvider } from '../internals/utils/TranslationsContext';
import { MonthView } from '../month-view';
import { HeaderToolbar } from './header-toolbar';
import { ResourcesLegend } from './resources-legend';
import { DateNavigator } from './date-navigator';
import { schedulerTokens } from '../internals/utils/tokens';
import { EventDraggableDialogProvider } from '../internals/components/event-draggable-dialog';

const EventCalendarRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'Root',
})(({ theme }) => ({
  // CSS variable tokens
  ...schedulerTokens,
  // Layout
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  gridTemplateRows: 'auto 1fr',
  gap: theme.spacing(2),
  height: '100%',
}));

const EventCalendarSidePanel = styled('aside', {
  name: 'MuiEventCalendar',
  slot: 'SidePanel',
})(({ theme }) => ({
  width: '100%',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const EventCalendarMainPanel = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MainPanel',
})(({ theme }) => ({
  gridRow: 2,
  gridColumn: '1 / -1',
  display: 'grid',
  gridTemplateColumns: 'subgrid',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minHeight: 0,
  '&[data-view="month"]': {
    maxHeight: '100%',
    overflow: 'hidden',
  },
}));

const EventCalendarContent = styled('section', {
  name: 'MuiEventCalendar',
  slot: 'Content',
})(() => ({
  display: 'flex',
  flex: 1,
  overflow: 'auto',
  maxHeight: 'fit-content',
  '&[data-view="month"]': {
    maxHeight: 'none',
  },
  '&[data-side-panel-open="false"]': {
    gridColumn: '1 / -1',
  },
}));

const EventCalendarMonthCalendarPlaceholder = styled('section', {
  name: 'MuiEventCalendar',
  slot: 'MonthCalendarPlaceholder',
})(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  height: 220,
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[500],
}));

const EventCalendarErrorContainer = styled(Alert, {
  name: 'MuiEventCalendar',
  slot: 'ErrorContainer',
})({});

export const EventCalendar = React.forwardRef(function EventCalendar<
  TEvent extends object,
  TResource extends object,
>(
  inProps: EventCalendarProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiEventCalendar' });

  const { parameters, forwardedProps } = useExtractEventCalendarParameters<
    TEvent,
    TResource,
    typeof props
  >(props);
  const store = useEventCalendar(parameters);
  const view = useStore(store, eventCalendarViewSelectors.view);
  const isSidePanelOpen = useStore(store, eventCalendarPreferenceSelectors.isSidePanelOpen);
  const errors = useStore(store, schedulerOtherSelectors.errors);

  const {
    // TODO: Move inside useEventCalendar so that standalone view can benefit from it (#19293).
    translations,
    ...other
  } = forwardedProps;

  let content: React.ReactNode;

  switch (view) {
    case 'week':
      content = <WeekView />;
      break;
    case 'day':
      content = <DayView />;
      break;
    case 'month':
      content = <MonthView />;
      break;
    case 'agenda':
      content = <AgendaView />;
      break;
    default:
      content = null;
  }

  const rootRef = React.useRef<HTMLElement | null>(null);
  const handleRootRef = useMergedRefs(forwardedRef, rootRef);

  return (
    <EventCalendarStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        <TranslationsProvider translations={translations}>
          <EventDraggableDialogProvider>
            <EventCalendarRoot {...other} ref={handleRootRef}>
              <DateNavigator />

              <HeaderToolbar />

              <EventCalendarMainPanel data-view={view}>
                {isSidePanelOpen && (
                  <EventCalendarSidePanel>
                    <EventCalendarMonthCalendarPlaceholder
                      // TODO: Add localization
                      aria-label="Month calendar"
                    >
                      Month Calendar
                    </EventCalendarMonthCalendarPlaceholder>
                    <ResourcesLegend />
                  </EventCalendarSidePanel>
                )}

                <EventCalendarContent
                  data-view={view}
                  data-side-panel-open={isSidePanelOpen}
                  // TODO: Add localization
                  aria-label="Calendar content"
                >
                  {content}
                </EventCalendarContent>
                {errors?.length > 0 &&
                  errors.map((error, index) => (
                    <EventCalendarErrorContainer severity="error" key={index}>
                      {error.message}
                    </EventCalendarErrorContainer>
                  ))}
              </EventCalendarMainPanel>
            </EventCalendarRoot>
          </EventDraggableDialogProvider>
        </TranslationsProvider>
      </SchedulerStoreContext.Provider>
    </EventCalendarStoreContext.Provider>
  );
}) as EventCalendarComponent;

type EventCalendarComponent = <TEvent extends object, TResource extends object>(
  props: EventCalendarProps<TEvent, TResource> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.JSX.Element;
