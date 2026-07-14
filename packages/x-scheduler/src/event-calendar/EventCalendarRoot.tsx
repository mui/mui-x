'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui/utils/store';
import type { SxProps } from '@mui/system/styleFunctionSx';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';
import {
  eventCalendarPreferenceSelectors,
  eventCalendarViewSelectors,
} from '@mui/x-scheduler-internals/event-calendar-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import {
  EVENT_CALENDAR_ROOT_CONTAINER_NAME,
  RESPONSIVE_TYPOGRAPHY_BREAKPOINT_SM,
  eventCalendarRootExpandedQuery,
  eventCalendarRootCompactQuery,
  responsiveTypographyContainerQueries,
} from '../internals/constants/responsiveTypography';
import { ResponsiveTypographyContainer } from '../internals/components/ResponsiveTypographyContainer';
import { ErrorContainer } from '../internals/components/error-container';
import { WeekView } from '../week-view/WeekView';
import { AgendaView } from '../agenda-view';
import { DayView } from '../day-view/DayView';
import { MonthView } from '../month-view';
import { HeaderToolbar } from './header-toolbar';
import { ResourcesTree } from './resources-tree';
import { MiniCalendar } from './mini-calendar';
import { SidePanelDrawer } from './side-panel-drawer';
import { useEventCalendarStyledContext } from './EventCalendarStyledContext';

export interface EventCalendarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

const EventCalendarRootStyled = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'Root',
})(({ theme }) => ({
  // Layout
  boxSizing: 'border-box',
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  height: '100%',
  minHeight: 0,
  overflow: 'hidden',
  fontFamily: theme.typography.fontFamily,

  // Root container so the toolbar and drawer react to the overall calendar width
  // with CSS (distinct from the content-scoped typography container one level down).
  containerType: 'inline-size',
  containerName: EVENT_CALENDAR_ROOT_CONTAINER_NAME,

  // Compact/expanded toggle via the root container query (both layouts always
  // rendered, SSR-safe): hide `data-expanded-only` in the compact layout,
  // `data-compact-only` in the expanded layout.
  [eventCalendarRootCompactQuery]: {
    '& [data-expanded-only]': {
      display: 'none',
    },
  },
  [eventCalendarRootExpandedQuery]: {
    '& [data-compact-only]': {
      display: 'none',
    },
  },
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
  borderColor: (theme.vars || theme).palette.divider,
  borderRadius: theme.shape.borderRadius,
  maxHeight: '100%',
  overflowY: 'hidden',
}));

const EventCalendarSidePanelCollapse = styled(Collapse, {
  name: 'MuiEventCalendar',
  slot: 'SidePanelCollapse',
})({
  // The inline side panel is expanded-only; in the compact layout the drawer overlay
  // takes its place.
  [eventCalendarRootCompactQuery]: {
    display: 'none',
  },
});

const EventCalendarMainPanel = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'MainPanel',
})(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  gap: theme.spacing(1),
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
  height: '100%',
  maxHeight: '100%',

  // The container lives on ResponsiveTypographyContainer one level up; these rules
  // fire against it and retarget the effective vars on this slot for descendants.
  ...responsiveTypographyContainerQueries,

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
    const { children, className, ...other } = props;

    const store = useEventCalendarStoreContext();
    const { classes, localeText } = useEventCalendarStyledContext();

    const view = useStore(store, eventCalendarViewSelectors.view);
    const isSidePanelOpen = useStore(store, eventCalendarPreferenceSelectors.isSidePanelOpen);

    // The compact drawer keeps its own state (default closed) rather than reusing
    // `isSidePanelOpen` (default open), so it never covers the calendar on load.
    const [isCompactDrawerOpen, setIsCompactDrawerOpen] = React.useState(false);

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

    // The container query only hides the drawer in the expanded layout; the modal
    // underneath would stay open (aria-hiding the calendar, trapping focus). Close it
    // when the root grows past the breakpoint so the drawer fully unmounts instead of
    // just disappearing. Only active while the drawer is open.
    useResizeObserver(
      rootRef,
      (entries) => {
        const width = entries[0].contentRect.width;
        if (width >= RESPONSIVE_TYPOGRAPHY_BREAKPOINT_SM) {
          setIsCompactDrawerOpen(false);
        }
      },
      isCompactDrawerOpen,
    );

    return (
      <EventCalendarRootStyled
        className={clsx(classes.root, className)}
        {...other}
        ref={handleRootRef}
      >
        <HeaderToolbar onCompactMenuClick={() => setIsCompactDrawerOpen(true)} />

        <EventCalendarMainPanel className={classes.mainPanel} data-view={view}>
          <EventCalendarSidePanelCollapse
            in={isSidePanelOpen}
            orientation="horizontal"
            className={classes.sidePanelCollapse}
          >
            <EventCalendarSidePanel className={classes.sidePanel}>
              <MiniCalendar />
              <Divider className={classes.sidePanelDivider} />
              <ResourcesTree />
            </EventCalendarSidePanel>
          </EventCalendarSidePanelCollapse>

          <ResponsiveTypographyContainer>
            <EventCalendarContent
              className={classes.content}
              data-view={view}
              data-side-panel-open={isSidePanelOpen}
              aria-label={localeText.calendarContentAriaLabel}
            >
              {content}
            </EventCalendarContent>
          </ResponsiveTypographyContainer>
        </EventCalendarMainPanel>
        <SidePanelDrawer
          open={isCompactDrawerOpen}
          onClose={() => setIsCompactDrawerOpen(false)}
          container={rootRef}
        />
        <ErrorContainer />
        {children}
      </EventCalendarRootStyled>
    );
  },
);
