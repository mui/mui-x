'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui/utils/store';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
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
import { schedulerTokens } from '../internals/utils/tokens';
import { EventDraggableDialogProvider } from '../internals/components/event-draggable-dialog';
import { EventCalendarClasses, getEventCalendarUtilityClass } from './eventCalendarClasses';
import { EventCalendarClassesContext } from './EventCalendarClassesContext';

const useUtilityClasses = (classes: Partial<EventCalendarClasses> | undefined) => {
  const slots = {
    root: ['root'],
    sidePanel: ['sidePanel'],
    mainPanel: ['mainPanel'],
    content: ['content'],
    monthCalendarPlaceholder: ['monthCalendarPlaceholder'],
    errorContainer: ['errorContainer'],
    dateNavigator: ['dateNavigator'],
    dateNavigatorLabel: ['dateNavigatorLabel'],
    dateNavigatorButtonsContainer: ['dateNavigatorButtonsContainer'],
    headerToolbar: ['headerToolbar'],
    headerToolbarActions: ['headerToolbarActions'],
    headerToolbarPrimaryActionWrapper: ['headerToolbarPrimaryActionWrapper'],
    headerToolbarLeftElement: ['headerToolbarLeftElement'],
    headerToolbarLabel: ['headerToolbarLabel'],
    headerToolbarDateNavigator: ['headerToolbarDateNavigator'],
    viewSwitcher: ['viewSwitcher'],
    preferencesMenu: ['preferencesMenu'],
    resourcesLegend: ['resourcesLegend'],
    resourcesLegendItem: ['resourcesLegendItem'],
    resourcesLegendItemColorDot: ['resourcesLegendItemColorDot'],
    resourcesLegendItemName: ['resourcesLegendItemName'],
    agendaView: ['agendaView'],
    agendaViewRow: ['agendaViewRow'],
    agendaViewDayHeaderCell: ['agendaViewDayHeaderCell'],
    agendaViewDayNumberCell: ['agendaViewDayNumberCell'],
    agendaViewWeekDayCell: ['agendaViewWeekDayCell'],
    agendaViewWeekDayNameLabel: ['agendaViewWeekDayNameLabel'],
    agendaViewYearAndMonthLabel: ['agendaViewYearAndMonthLabel'],
    agendaViewEventsList: ['agendaViewEventsList'],
    agendaViewLoadingOverlay: ['agendaViewLoadingOverlay'],
    monthView: ['monthView'],
    monthViewGrid: ['monthViewGrid'],
    monthViewHeader: ['monthViewHeader'],
    monthViewHeaderCell: ['monthViewHeaderCell'],
    monthViewWeekHeaderCell: ['monthViewWeekHeaderCell'],
    monthViewBody: ['monthViewBody'],
    monthViewLoadingOverlay: ['monthViewLoadingOverlay'],
    monthViewRow: ['monthViewRow'],
    monthViewWeekNumberCell: ['monthViewWeekNumberCell'],
    monthViewCell: ['monthViewCell'],
    monthViewCellNumber: ['monthViewCellNumber'],
    monthViewCellNumberButton: ['monthViewCellNumberButton'],
    monthViewCellEvents: ['monthViewCellEvents'],
    monthViewMoreEvents: ['monthViewMoreEvents'],
    monthViewPlaceholderContainer: ['monthViewPlaceholderContainer'],
    dayTimeGridContainer: ['dayTimeGridContainer'],
    dayTimeGrid: ['dayTimeGrid'],
    dayTimeGridHeader: ['dayTimeGridHeader'],
    dayTimeGridHeaderRow: ['dayTimeGridHeaderRow'],
    dayTimeGridAllDayEventsGrid: ['dayTimeGridAllDayEventsGrid'],
    dayTimeGridAllDayEventsRow: ['dayTimeGridAllDayEventsRow'],
    dayTimeGridAllDayEventsCell: ['dayTimeGridAllDayEventsCell'],
    dayTimeGridAllDayEventsHeaderCell: ['dayTimeGridAllDayEventsHeaderCell'],
    dayTimeGridHeaderContent: ['dayTimeGridHeaderContent'],
    dayTimeGridHeaderButton: ['dayTimeGridHeaderButton'],
    dayTimeGridHeaderDayName: ['dayTimeGridHeaderDayName'],
    dayTimeGridHeaderDayNumber: ['dayTimeGridHeaderDayNumber'],
    dayTimeGridBody: ['dayTimeGridBody'],
    dayTimeGridScrollableContent: ['dayTimeGridScrollableContent'],
    dayTimeGridTimeAxis: ['dayTimeGridTimeAxis'],
    dayTimeGridTimeAxisCell: ['dayTimeGridTimeAxisCell'],
    dayTimeGridTimeAxisText: ['dayTimeGridTimeAxisText'],
    dayTimeGridGrid: ['dayTimeGridGrid'],
    dayTimeGridLoadingOverlay: ['dayTimeGridLoadingOverlay'],
    dayTimeGridColumn: ['dayTimeGridColumn'],
    dayTimeGridColumnInteractiveLayer: ['dayTimeGridColumnInteractiveLayer'],
    dayTimeGridCurrentTimeIndicator: ['dayTimeGridCurrentTimeIndicator'],
    dayTimeGridCurrentTimeIndicatorCircle: ['dayTimeGridCurrentTimeIndicatorCircle'],
    dayTimeGridCurrentTimeLabel: ['dayTimeGridCurrentTimeLabel'],
    dayTimeGridAllDayEventsCellEvents: ['dayTimeGridAllDayEventsCellEvents'],
    dayTimeGridAllDayEventContainer: ['dayTimeGridAllDayEventContainer'],
    dayTimeGridScrollablePlaceholder: ['dayTimeGridScrollablePlaceholder'],
    dayGridEvent: ['dayGridEvent'],
    dayGridEventPlaceholder: ['dayGridEventPlaceholder'],
    dayGridEventTitle: ['dayGridEventTitle'],
    dayGridEventTime: ['dayGridEventTime'],
    dayGridEventRecurringIcon: ['dayGridEventRecurringIcon'],
    dayGridEventResizeHandler: ['dayGridEventResizeHandler'],
    dayGridEventCardWrapper: ['dayGridEventCardWrapper'],
    dayGridEventCardContent: ['dayGridEventCardContent'],
    dayGridEventLinesClamp: ['dayGridEventLinesClamp'],
    eventColorIndicator: ['eventColorIndicator'],
    timeGridEvent: ['timeGridEvent'],
    timeGridEventPlaceholder: ['timeGridEventPlaceholder'],
    timeGridEventTitle: ['timeGridEventTitle'],
    timeGridEventTime: ['timeGridEventTime'],
    timeGridEventRecurringIcon: ['timeGridEventRecurringIcon'],
    timeGridEventResizeHandler: ['timeGridEventResizeHandler'],
    eventItemCard: ['eventItemCard'],
    eventItemCardWrapper: ['eventItemCardWrapper'],
    eventItemTitle: ['eventItemTitle'],
    eventItemTime: ['eventItemTime'],
    eventItemRecurringIcon: ['eventItemRecurringIcon'],
    resourceLegendColor: ['resourceLegendColor'],
    eventItemCardContent: ['eventItemCardContent'],
    eventItemLinesClamp: ['eventItemLinesClamp'],
  };

  return composeClasses(slots, getEventCalendarUtilityClass, classes);
};

const EventCalendarRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'Root',
})(({ theme }) => ({
  // CSS variable tokens
  ...schedulerTokens,
  // Layout
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  height: '100%',
}));

const EventCalendarSidePanel = styled('aside', {
  name: 'MuiEventCalendar',
  slot: 'SidePanel',
})(({ theme }) => ({
  width: '100%',
  minWidth: 250,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const EventCalendarMainPanel = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MainPanel',
})(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
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
})({
  position: 'absolute',
  bottom: 16,
  right: 16,
});

export const EventCalendar = React.forwardRef(function EventCalendar<
  TEvent extends object,
  TResource extends object,
>(
  inProps: EventCalendarProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiEventCalendar' });

  const {
    parameters,
    forwardedProps: { className, classes: classesProp, ...forwardedProps },
  } = useExtractEventCalendarParameters<TEvent, TResource, typeof props>(props);
  const store = useEventCalendar(parameters);
  const classes = useUtilityClasses(classesProp);
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
          <EventCalendarClassesContext.Provider value={classes}>
            <EventDraggableDialogProvider>
              <EventCalendarRoot
                className={clsx(classes.root, className)}
                {...other}
                ref={handleRootRef}
              >
                <HeaderToolbar />
                <EventCalendarMainPanel className={classes.mainPanel} data-view={view}>
                  <Collapse in={isSidePanelOpen} orientation="horizontal">
                    <EventCalendarSidePanel className={classes.sidePanel}>
                      <EventCalendarMonthCalendarPlaceholder
                        className={classes.monthCalendarPlaceholder}
                        // TODO: Add localization
                        aria-label="Month calendar"
                      >
                        Month Calendar
                      </EventCalendarMonthCalendarPlaceholder>
                      <ResourcesLegend />
                    </EventCalendarSidePanel>
                  </Collapse>

                  <EventCalendarContent
                    className={classes.content}
                    data-view={view}
                    data-side-panel-open={isSidePanelOpen}
                    // TODO: Add localization
                    aria-label="Calendar content"
                  >
                    {content}
                  </EventCalendarContent>
                  {errors?.length > 0 &&
                    errors.map((error, index) => (
                      <EventCalendarErrorContainer
                        className={classes.errorContainer}
                        severity="error"
                        key={index}
                      >
                        {error.message}
                      </EventCalendarErrorContainer>
                    ))}
                </EventCalendarMainPanel>
              </EventCalendarRoot>
            </EventDraggableDialogProvider>
          </EventCalendarClassesContext.Provider>
        </TranslationsProvider>
      </SchedulerStoreContext.Provider>
    </EventCalendarStoreContext.Provider>
  );
}) as EventCalendarComponent;

type EventCalendarComponent = <TEvent extends object, TResource extends object>(
  props: EventCalendarProps<TEvent, TResource> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.JSX.Element;
