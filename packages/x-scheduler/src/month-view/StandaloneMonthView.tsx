'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { StandaloneMonthViewProps } from './MonthView.types';
import { EventCalendarProvider } from '../internals/components/EventCalendarProvider';
import { EventDialogProvider } from '../internals/components/event-dialog';
import { MonthView } from './MonthView';

/**
 * A Month View that can be used outside of the Event Calendar.
 */
const StandaloneMonthView = React.forwardRef(function StandaloneMonthView<
  TEvent extends object,
  TResource extends object,
>(
  props: StandaloneMonthViewProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { parameters, forwardedProps } = useExtractEventCalendarParameters<
    TEvent,
    TResource,
    typeof props
  >(props);

  return (
    <EventCalendarProvider {...parameters}>
      <EventDialogProvider>
        <MonthView ref={forwardedRef} {...forwardedProps} />
      </EventDialogProvider>
    </EventCalendarProvider>
  );
}) as StandaloneMonthViewComponent;

StandaloneMonthView.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
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
   * The date initially used to determine the visible date range in each view.
   * To render a controlled calendar, use the `visibleDate` prop.
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
   * The date currently used to determine the visible date range in each view.
   */
  visibleDate: PropTypes.instanceOf(Date),
  /**
   * The IDs of the resources currently visible.
   * A resource is visible if it is not included in this object or if it is included with `true` value.
   */
  visibleResources: PropTypes.object,
} as any;

export { StandaloneMonthView };

interface StandaloneMonthViewComponent {
  <TEvent extends object, TResource extends object>(
    props: StandaloneMonthViewProps<TEvent, TResource> & {
      ref?: React.ForwardedRef<HTMLDivElement>;
    },
  ): React.JSX.Element;
  propTypes?: any;
}
