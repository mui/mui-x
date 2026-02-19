'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui/utils/store';
import { SxProps } from '@mui/system/styleFunctionSx';
import { styled, Theme } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import {
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-headless/event-calendar-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { ErrorContainer } from '../internals/components/error-container';
import { WeekView } from '../week-view/WeekView';
import { AgendaView } from '../agenda-view';
import { DayView } from '../day-view/DayView';
import { MonthView } from '../month-view';
import { HeaderToolbar } from './header-toolbar';
import { ResourcesLegend } from './resources-legend';
import { MiniCalendar } from './mini-calendar';
import { schedulerTokens } from '../internals/utils/tokens';
import { useEventCalendarStyledContext } from './EventCalendarStyledContext';

export interface EventCalendarRootProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

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
  minWidth: 250,
  width: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  maxHeight: '100%',
  overflowY: 'hidden',
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
  height: 'fit-content',
  maxHeight: '100%',
  '&[data-view="month"]': {
    height: '100%',
    maxHeight: '100%',
  },
  '&[data-side-panel-open="false"]': {
    gridColumn: '1 / -1',
  },
}));

/**
 * Internal component that renders the EventCalendar UI.
 * Used by both EventCalendar and EventCalendarPremium.
 * Expects the store to be provided via context.
 */
export const EventCalendarRoot = React.forwardRef<HTMLDivElement, EventCalendarRootProps>(
  function EventCalendarRoot(props, forwardedRef) {
    const { className, ...other } = props;

    const store = useEventCalendarStoreContext();
    const { classes } = useEventCalendarStyledContext();

    const view = useStore(store, eventCalendarViewSelectors.view);
    const isSidePanelOpen = useStore(store, eventCalendarPreferenceSelectors.isSidePanelOpen);
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
              <MiniCalendar />
              <Divider />
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
        </EventCalendarMainPanel>
        <ErrorContainer />
      </EventCalendarRootStyled>
    );
  },
);
