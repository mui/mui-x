'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui/utils/store';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import {
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { WeekView } from '../week-view/WeekView';
import { AgendaView } from '../agenda-view';
import { DayView } from '../day-view/DayView';
import { MonthView } from '../month-view';
import { HeaderToolbar } from './header-toolbar';
import { ResourcesLegend } from './resources-legend';
import { schedulerTokens } from '../internals/utils/tokens';
import { useEventCalendarClasses } from './EventCalendarClassesContext';

export interface EventCalendarRootProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {}

const EventCalendarRootStyled = styled('div', {
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
  fontFamily: theme.typography.fontFamily,
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

/**
 * Internal component that renders the EventCalendar UI.
 * Used by both EventCalendar and EventCalendarPremium.
 * Expects the store to be provided via context.
 */
export const EventCalendarRoot = React.forwardRef<HTMLDivElement, EventCalendarRootProps>(
  function EventCalendarRoot(props, forwardedRef) {
    const { className, ...other } = props;

    const store = useEventCalendarStoreContext();
    const classes = useEventCalendarClasses();

    const view = useStore(store, eventCalendarViewSelectors.view);
    const isSidePanelOpen = useStore(store, eventCalendarPreferenceSelectors.isSidePanelOpen);
    const errors = useStore(store, schedulerOtherSelectors.errors);

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
      <EventCalendarRootStyled
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
      </EventCalendarRootStyled>
    );
  },
);
