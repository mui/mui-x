'use client';
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useLicenseVerifier, Watermark } from '@mui/x-license/internals';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useInitializeApiRef } from '@mui/x-scheduler-headless/internals';
import { useEventCalendarPremium } from '@mui/x-scheduler-headless-premium/use-event-calendar-premium';
import {
  useEventCalendarUtilityClasses,
  EventCalendarStyledContext,
} from '@mui/x-scheduler/event-calendar';
import {
  EventDialogStyledContext,
  EventDialogProvider,
  EventCalendarRoot,
  EVENT_CALENDAR_DEFAULT_LOCALE_TEXT,
} from '@mui/x-scheduler/internals';
import { EventCalendarPremiumProps } from './EventCalendarPremium.types';

const packageInfo = {
  releaseDate: '__RELEASE_INFO__',
  version: process.env.MUI_VERSION!,
  name: 'x-scheduler-premium' as const,
};
const watermark = <Watermark packageInfo={packageInfo} />;

/**
 * Premium version of EventCalendar with lazy loading support.
 * Uses EventCalendarPremiumStore which extends EventCalendarStore with lazy loading plugin.
 */
export const EventCalendarPremium = React.forwardRef(function EventCalendarPremium<
  TEvent extends object,
  TResource extends object,
>(
  inProps: EventCalendarPremiumProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // Use the same theme name to share theme customizations with base EventCalendar
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiEventCalendar' });
  useLicenseVerifier(packageInfo);

  const {
    parameters,
    forwardedProps: { className, classes: classesProp, ...forwardedProps },
  } = useExtractEventCalendarParameters<TEvent, TResource, typeof props>(props);

  // Use premium store with lazy loading
  const store = useEventCalendarPremium(parameters);
  const classes = useEventCalendarUtilityClasses(classesProp);

  const { localeText, apiRef, ...other } = forwardedProps;
  useInitializeApiRef(store, apiRef);

  const mergedLocaleText = React.useMemo(
    () => ({ ...EVENT_CALENDAR_DEFAULT_LOCALE_TEXT, ...localeText }),
    [localeText],
  );

  const calendarStyledContextValue = React.useMemo(
    () => ({ classes, localeText: mergedLocaleText }),
    [classes, mergedLocaleText],
  );

  const dialogStyledContextValue = React.useMemo(
    () => ({ classes, localeText: mergedLocaleText }),
    [classes, mergedLocaleText],
  );

  return (
    <SchedulerStoreContext.Provider value={store as any}>
      <EventCalendarStyledContext.Provider value={calendarStyledContextValue}>
        <EventDialogStyledContext.Provider value={dialogStyledContextValue}>
          <EventDialogProvider>
            <EventCalendarRoot className={className} {...other} ref={forwardedRef}>
              {watermark}
            </EventCalendarRoot>
          </EventDialogProvider>
        </EventDialogStyledContext.Provider>
      </EventCalendarStyledContext.Provider>
    </SchedulerStoreContext.Provider>
  );
}) as EventCalendarPremiumComponent;

type EventCalendarPremiumComponent = <TEvent extends object, TResource extends object>(
  props: EventCalendarPremiumProps<TEvent, TResource> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.JSX.Element;
