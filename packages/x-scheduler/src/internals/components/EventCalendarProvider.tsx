'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useId } from '@base-ui/utils/useId';
import { EventCalendarProvider as UnstyledEventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';
import { EventCalendarStyledContext } from '../../event-calendar/EventCalendarStyledContext';
import { EventEditingStyledContext } from './event-editing/EventEditingStyledContext';
import { SharedComponentsStyledContext } from './SharedComponentsStyledContext';
import { EVENT_CALENDAR_DEFAULT_LOCALE_TEXT } from '../constants/defaultLocaleText';
import { responsiveTypographyContainerQueries } from '../constants/responsiveTypography';

/**
 * Root wrapper for standalone views that provides CSS variable tokens.
 * This ensures event colors work correctly outside of EventCalendar.
 *
 * The @container queries spread below redefine the effective typography
 * vars on this slot when the surrounding ResponsiveTypographyContainer
 * (which Standalone*View components wrap their tree in) crosses a tier
 * threshold. display:contents doesn't block custom-property inheritance,
 * so descendants pick up the retargeted values.
 */
const StandaloneViewRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'StandaloneViewRoot',
})(({ theme }) => ({
  display: 'contents',
  fontFamily: theme.typography.fontFamily,
  boxSizing: 'border-box',
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
  ...responsiveTypographyContainerQueries,
}));

export function EventCalendarProvider<TEvent extends object, TResource extends object>(
  props: UnstyledEventCalendarProvider.Props<TEvent, TResource>,
) {
  const { children, ...other } = props;
  const schedulerId = useId();

  const calendarStyledValue = React.useMemo(
    () => ({
      schedulerId,
      classes: eventCalendarClasses,
      localeText: EVENT_CALENDAR_DEFAULT_LOCALE_TEXT,
    }),
    [schedulerId],
  );
  const editingStyledValue = React.useMemo(
    () => ({
      schedulerId,
      classes: eventCalendarClasses,
      localeText: EVENT_CALENDAR_DEFAULT_LOCALE_TEXT,
    }),
    [schedulerId],
  );
  const sharedComponentsStyledValue = React.useMemo(() => ({ classes: eventCalendarClasses }), []);

  return (
    <UnstyledEventCalendarProvider {...other}>
      <EventCalendarStyledContext.Provider value={calendarStyledValue}>
        <EventEditingStyledContext.Provider value={editingStyledValue}>
          <SharedComponentsStyledContext.Provider value={sharedComponentsStyledValue}>
            <StandaloneViewRoot>{children}</StandaloneViewRoot>
          </SharedComponentsStyledContext.Provider>
        </EventEditingStyledContext.Provider>
      </EventCalendarStyledContext.Provider>
    </UnstyledEventCalendarProvider>
  );
}
