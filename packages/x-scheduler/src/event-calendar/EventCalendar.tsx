'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import {
  useEventCalendar,
  useExtractEventCalendarParameters,
} from '@mui/x-scheduler-internals/use-event-calendar';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useInitializeApiRef } from '@mui/x-scheduler-internals/internals';
import { useId } from '@base-ui/utils/useId';
import { EventCalendarProps } from './EventCalendar.types';
import { EventDialogProvider } from '../internals/components/event-dialog';
import { useEventCalendarUtilityClasses } from './eventCalendarClasses';
import { EventCalendarStyledContext } from './EventCalendarStyledContext';
import { EventDialogStyledContext } from '../internals/components/event-dialog/EventDialogStyledContext';
import { EVENT_CALENDAR_DEFAULT_LOCALE_TEXT } from '../internals/constants/defaultLocaleText';
import { EventCalendarRoot } from './EventCalendarRoot';

const EventCalendar = React.forwardRef(function EventCalendar<
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
  const classes = useEventCalendarUtilityClasses(classesProp);

  const { localeText, apiRef, ...other } = forwardedProps;
  useInitializeApiRef(store, apiRef);

  const schedulerId = useId();

  const mergedLocaleText = React.useMemo(
    () => ({ ...EVENT_CALENDAR_DEFAULT_LOCALE_TEXT, ...localeText }),
    [localeText],
  );

  const calendarStyledContextValue = React.useMemo(
    () => ({ schedulerId, classes, localeText: mergedLocaleText }),
    [schedulerId, classes, mergedLocaleText],
  );

  const dialogStyledContextValue = React.useMemo(
    () => ({ schedulerId, classes, localeText: mergedLocaleText }),
    [schedulerId, classes, mergedLocaleText],
  );

  return (
    <SchedulerStoreContext.Provider value={store as any}>
      <EventCalendarStyledContext.Provider value={calendarStyledContextValue}>
        <EventDialogStyledContext.Provider value={dialogStyledContextValue}>
          <EventDialogProvider>
            <EventCalendarRoot className={className} {...other} ref={forwardedRef} />
          </EventDialogProvider>
        </EventDialogStyledContext.Provider>
      </EventCalendarStyledContext.Provider>
    </SchedulerStoreContext.Provider>
  );
}) as EventCalendarComponent;

EventCalendar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The ref object that allows Event Calendar manipulation.
   * Can be instantiated with `useEventCalendarApiRef()`.
   */
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      setVisibleDate: PropTypes.func,
    }),
  }),
  /**
   * Whether the event can be dragged to change its start and end dates without changing the duration.
   * @default true
   */
  areEventsDraggable: PropTypes.bool,
  /**
   * Whether the event start or end can be dragged to change its duration without changing its other date.
   * If `true`, both start and end can be resized.
   * If `false`, the events are not resizable.
   * If `"start"`, only the start can be resized.
   * If `"end"`, only the end can be resized.
   * @default true
   */
  areEventsResizable: PropTypes.oneOfType([PropTypes.oneOf(['end', 'start']), PropTypes.bool]),
  /**
   * Whether events can be dragged from outside of the calendar and dropped into it.
   * @default false
   */
  canDragEventsFromTheOutside: PropTypes.bool,
  /**
   * Whether events can be dragged from inside of the calendar and dropped outside of it.
   * If true, when the mouse leaves the calendar, the event won't be rendered inside the calendar anymore.
   * If false, when the mouse leaves the calendar, the event will be rendered in its last valid position inside the calendar.
   * @default false
   */
  canDropEventsToTheOutside: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Data source for fetching events asynchronously.
   * When provided, events are fetched through the data source instead of the `events` prop.
   */
  dataSource: PropTypes.shape({
    getEvents: PropTypes.func.isRequired,
    updateEvents: PropTypes.func.isRequired,
  }),
  /**
   * The locale object from `date-fns` used to format dates.
   * This affects day names, month names, week start day, and other locale-dependent formatting.
   * Import a locale from `date-fns/locale` and pass it to this prop.
   * @default enUS (English)
   */
  dateLocale: PropTypes.object,
  /**
   * The default preferences for the calendar.
   * To use controlled preferences, use the `preferences` prop.
   * @default { showWeekends: true, showWeekNumber: false, isSidePanelOpen: true, showEmptyDaysInAgenda: true, ampm: true }
   */
  defaultPreferences: PropTypes.shape({
    ampm: PropTypes.bool,
    isSidePanelOpen: PropTypes.bool,
    showEmptyDaysInAgenda: PropTypes.bool,
    showWeekends: PropTypes.bool,
    showWeekNumber: PropTypes.bool,
  }),
  /**
   * The view initially displayed in the calendar.
   * To render a controlled calendar, use the `view` prop.
   * @default "week"
   */
  defaultView: PropTypes.oneOf(['agenda', 'day', 'month', 'week']),
  /**
   * The date initially used to determine the visible date range.
   * To render a controlled component, use the `visibleDate` prop.
   * @default today
   */
  defaultVisibleDate: PropTypes.instanceOf(Date),
  /**
   * The IDs of the resources initially visible.
   * To render a controlled scheduler, use the `visibleResources` prop.
   * @default {} - all resources are visible
   */
  defaultVisibleResources: PropTypes.object,
  /**
   * The timezone used to display events in the scheduler.
   *
   * Accepts any valid IANA timezone name
   * (for example "America/New_York", "Europe/Paris", "Asia/Tokyo"),
   * or keywords understood by the adapter, such as
   * "default" (use the adapter's default timezone),
   * "locale" (use the user's current locale timezone),
   * or "UTC".
   *
   * This timezone only affects rendering, events keep their original data timezone.
   * @default "default"
   */
  displayTimezone: PropTypes.string,
  /**
   * The color palette used for all events.
   * Can be overridden per resource using the `eventColor` property on the resource model.
   * Can be overridden per event using the `color` property on the event model.
   * @default "teal"
   */
  eventColor: PropTypes.oneOf([
    'amber',
    'blue',
    'green',
    'grey',
    'indigo',
    'lime',
    'orange',
    'pink',
    'purple',
    'red',
    'teal',
  ]),
  eventCreation: PropTypes.oneOfType([
    PropTypes.shape({
      duration: PropTypes.number,
      interaction: PropTypes.oneOf(['click', 'double-click']),
    }),
    PropTypes.bool,
  ]),
  /**
   * The structure of the event model.
   * It defines how to read and write the properties of the event model.
   * If not provided, the event model is assumed to match the `CalendarEvent` interface.
   */
  eventModelStructure: PropTypes.object,
  /**
   * The events currently available in the calendar.
   * @default []
   */
  events: PropTypes.arrayOf(PropTypes.object),
  /**
   * Set the locale text of the Event Calendar.
   * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-scheduler/src/models/translations.ts)
   * in the GitHub repository.
   */
  localeText: PropTypes.object,
  /**
   * Callback fired when some event of the calendar change.
   */
  onEventsChange: PropTypes.func,
  /**
   * Event handler called when the preferences change.
   */
  onPreferencesChange: PropTypes.func,
  /**
   * Event handler called when the view changes.
   */
  onViewChange: PropTypes.func,
  /**
   * Event handler called when the visible date changes.
   */
  onVisibleDateChange: PropTypes.func,
  /**
   * Event handler called when the visible resources change.
   */
  onVisibleResourcesChange: PropTypes.func,
  /**
   * Preferences currently displayed in the calendar.
   */
  preferences: PropTypes.shape({
    ampm: PropTypes.bool,
    isSidePanelOpen: PropTypes.bool,
    showEmptyDaysInAgenda: PropTypes.bool,
    showWeekends: PropTypes.bool,
    showWeekNumber: PropTypes.bool,
  }),
  /**
   * Config of the preferences menu.
   * Defines which options are visible in the menu.
   * If `false`, the menu will be entirely hidden.
   * @default { toggleWeekendVisibility: true, toggleWeekNumberVisibility: true, toggleAmpm: true, toggleEmptyDaysInAgenda: true }
   */
  preferencesMenuConfig: PropTypes.oneOfType([
    PropTypes.oneOf([false]),
    PropTypes.shape({
      toggleAmpm: PropTypes.bool,
      toggleEmptyDaysInAgenda: PropTypes.bool,
      toggleWeekendVisibility: PropTypes.bool,
      toggleWeekNumberVisibility: PropTypes.bool,
    }),
  ]),
  /**
   * Whether the calendar is in read-only mode.
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * The structure of the resource model.
   * It defines how to read and write the properties of the resource model.
   * If not provided, the resource model is assumed to match the `CalendarResource` interface.
   */
  resourceModelStructure: PropTypes.object,
  /**
   * The resources the events can be assigned to.
   */
  resources: PropTypes.arrayOf(PropTypes.object),
  /**
   * Whether the component should display the current time indicator.
   * @default true
   */
  showCurrentTimeIndicator: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The view currently displayed in the calendar.
   */
  view: PropTypes.oneOf(['agenda', 'day', 'month', 'week']),
  /**
   * The views available in the calendar.
   * @default ["day", "week", "month", "agenda"]
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['agenda', 'day', 'month', 'week']).isRequired),
  /**
   * The date currently used to determine the visible date range.
   */
  visibleDate: PropTypes.instanceOf(Date),
  /**
   * The IDs of the resources currently visible.
   * A resource is visible if it is not included in this object or if it is included with `true` value.
   */
  visibleResources: PropTypes.object,
} as any;

export { EventCalendar };

interface EventCalendarComponent {
  <TEvent extends object, TResource extends object>(
    props: EventCalendarProps<TEvent, TResource> & { ref?: React.ForwardedRef<HTMLDivElement> },
  ): React.JSX.Element;
  propTypes?: any;
}
