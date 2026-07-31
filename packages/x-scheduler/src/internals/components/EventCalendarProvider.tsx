'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useId } from '@base-ui/utils/useId';
import { EventCalendarProvider as UnstyledEventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import type { EventCalendarLocaleText } from '../../models/translations';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';
import { EventCalendarStyledContext } from '../../event-calendar/EventCalendarStyledContext';
import { EventDialogStyledContext } from './event-dialog/EventDialogStyledContext';
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

export interface EventCalendarProviderProps<
  TEvent extends object,
  TResource extends object,
> extends UnstyledEventCalendarProvider.Props<TEvent, TResource> {
  /**
   * Set the locale text of the view.
   * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-scheduler/src/models/translations.ts)
   * in the GitHub repository.
   */
  localeText?: Partial<EventCalendarLocaleText>;
}

export function EventCalendarProvider<TEvent extends object, TResource extends object>(
  props: EventCalendarProviderProps<TEvent, TResource>,
) {
  const { children, localeText, ...other } = props;
  const schedulerId = useId();

  const mergedLocaleText = React.useMemo(
    () => ({ ...EVENT_CALENDAR_DEFAULT_LOCALE_TEXT, ...localeText }),
    [localeText],
  );

  const calendarStyledValue = React.useMemo(
    () => ({
      schedulerId,
      classes: eventCalendarClasses,
      localeText: mergedLocaleText,
    }),
    [schedulerId, mergedLocaleText],
  );
  const dialogStyledValue = React.useMemo(
    () => ({
      schedulerId,
      classes: eventCalendarClasses,
      localeText: mergedLocaleText,
    }),
    [schedulerId, mergedLocaleText],
  );
  const sharedComponentsStyledValue = React.useMemo(() => ({ classes: eventCalendarClasses }), []);

  return (
    <UnstyledEventCalendarProvider {...other}>
      <EventCalendarStyledContext.Provider value={calendarStyledValue}>
        <EventDialogStyledContext.Provider value={dialogStyledValue}>
          <SharedComponentsStyledContext.Provider value={sharedComponentsStyledValue}>
            <StandaloneViewRoot>{children}</StandaloneViewRoot>
          </SharedComponentsStyledContext.Provider>
        </EventDialogStyledContext.Provider>
      </EventCalendarStyledContext.Provider>
    </UnstyledEventCalendarProvider>
  );
}
