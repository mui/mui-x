'use client';
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useInitializeApiRef } from '@mui/x-scheduler-headless/internals';
import { useEventCalendarPremium } from '@mui/x-scheduler-headless-premium/use-event-calendar-premium';
import {
  useEventCalendarUtilityClasses,
  EventCalendarClassesContext,
} from '@mui/x-scheduler/event-calendar';
import {
  TranslationsProvider,
  EventDialogProvider,
  EventDialogClassesContext,
  EventCalendarRoot,
} from '@mui/x-scheduler/internals';
import { EventCalendarPremiumProps } from './EventCalendarPremium.types';

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

  const {
    parameters,
    forwardedProps: { className, classes: classesProp, ...forwardedProps },
  } = useExtractEventCalendarParameters<TEvent, TResource, typeof props>(props);

  // Use premium store with lazy loading
  const store = useEventCalendarPremium(parameters);
  const classes = useEventCalendarUtilityClasses(classesProp);

  const { translations, apiRef, ...other } = forwardedProps;
  useInitializeApiRef(store, apiRef);

  return (
    <SchedulerStoreContext.Provider value={store as any}>
      <TranslationsProvider translations={translations}>
        <EventCalendarClassesContext.Provider value={classes}>
          <EventDialogClassesContext.Provider value={classes}>
            <EventDialogProvider>
              <EventCalendarRoot className={className} {...other} ref={forwardedRef} />
            </EventDialogProvider>
          </EventDialogClassesContext.Provider>
        </EventCalendarClassesContext.Provider>
      </TranslationsProvider>
    </SchedulerStoreContext.Provider>
  );
}) as EventCalendarPremiumComponent;

type EventCalendarPremiumComponent = <TEvent extends object, TResource extends object>(
  props: EventCalendarPremiumProps<TEvent, TResource> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.JSX.Element;
