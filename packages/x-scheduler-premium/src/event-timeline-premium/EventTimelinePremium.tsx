'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { useLicenseVerifier, Watermark } from '@mui/x-license/internals';
import composeClasses from '@mui/utils/composeClasses';
import {
  useExtractEventTimelinePremiumParameters,
  useEventTimelinePremium,
} from '@mui/x-scheduler-headless-premium/use-event-timeline-premium';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useInitializeApiRef } from '@mui/x-scheduler-headless/internals';
import { useId } from '@base-ui/utils/useId';
import {
  eventDialogSlots,
  EventDialogStyledContext,
  EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
} from '@mui/x-scheduler/internals';
import { EventTimelinePremiumProps } from './EventTimelinePremium.types';
import { EventTimelinePremiumContent } from './content';
import {
  EventTimelinePremiumClasses,
  getEventTimelinePremiumUtilityClass,
} from './eventTimelinePremiumClasses';
import { EventTimelinePremiumStyledContext } from './EventTimelinePremiumStyledContext';

const packageInfo = {
  releaseDate: '__RELEASE_INFO__',
  version: process.env.MUI_VERSION!,
  name: 'x-scheduler-premium' as const,
};
const watermark = <Watermark packageInfo={packageInfo} />;

const useUtilityClasses = (classes: Partial<EventTimelinePremiumClasses> | undefined) => {
  const slots = {
    root: ['root'],
    content: ['content'],
    grid: ['grid'],
    topRow: ['topRow'],
    header: ['header'],
    headerRow: ['headerRow'],
    headerCell: ['headerCell'],
    headerCellLabel: ['headerCellLabel'],
    titleHeaderCell: ['titleHeaderCell'],
    eventsHeaderCell: ['eventsHeaderCell'],
    eventsHeaderCellContent: ['eventsHeaderCellContent'],
    titleSubGrid: ['titleSubGrid'],
    eventsSubGridWrapper: ['eventsSubGridWrapper'],
    eventsSubGrid: ['eventsSubGrid'],
    eventsSubGridRow: ['eventsSubGridRow'],
    titleCellRow: ['titleCellRow'],
    titleCell: ['titleCell'],
    titleCellLegendColor: ['titleCellLegendColor'],
    currentTimeIndicator: ['currentTimeIndicator'],
    currentTimeIndicatorCircle: ['currentTimeIndicatorCircle'],
    event: ['event'],
    eventPlaceholder: ['eventPlaceholder'],
    eventResizeHandler: ['eventResizeHandler'],
    eventLinesClamp: ['eventLinesClamp'],
    eventRecurringIcon: ['eventRecurringIcon'],
    ...eventDialogSlots,
  };

  return composeClasses(slots, getEventTimelinePremiumUtilityClass, classes);
};

const EventTimelinePremiumRoot = styled('div', {
  name: 'MuiEventTimeline',
  slot: 'Root',
})(({ theme }) => ({
  boxSizing: 'border-box',
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  height: '100%',
  minHeight: 0,
  overflow: 'hidden',
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body2.fontSize,
}));

const EventTimelinePremium = React.forwardRef(function EventTimelinePremium<
  TEvent extends object,
  TResource extends object,
>(
  inProps: EventTimelinePremiumProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // We don't want the plan suffix in the theme, otherwise we couldn't share the theme entry across packages
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiEventTimeline' });
  useLicenseVerifier(packageInfo);

  const {
    parameters,
    forwardedProps: { className, classes: classesProp, ...forwardedProps },
  } = useExtractEventTimelinePremiumParameters<TEvent, TResource, typeof props>(props);
  const store = useEventTimelinePremium(parameters);
  const classes = useUtilityClasses(classesProp);

  const { localeText, resourceColumnLabel, apiRef, ...other } = forwardedProps;
  useInitializeApiRef(store, apiRef);

  const schedulerId = useId();

  const mergedLocaleText = React.useMemo(
    () => ({ ...EVENT_TIMELINE_DEFAULT_LOCALE_TEXT, ...localeText }),
    [localeText],
  );

  const timelineStyledContextValue = React.useMemo(
    () => ({ schedulerId, classes, localeText: mergedLocaleText, resourceColumnLabel }),
    [schedulerId, classes, mergedLocaleText, resourceColumnLabel],
  );

  const dialogStyledContextValue = React.useMemo(
    () => ({ schedulerId, classes, localeText: mergedLocaleText }),
    [schedulerId, classes, mergedLocaleText],
  );

  return (
    <SchedulerStoreContext.Provider value={store as any}>
      <EventTimelinePremiumStyledContext.Provider value={timelineStyledContextValue}>
        <EventDialogStyledContext.Provider value={dialogStyledContextValue}>
          <EventTimelinePremiumRoot
            ref={forwardedRef}
            className={clsx(classes.root, className)}
            {...other}
          >
            <EventTimelinePremiumContent />
            {watermark}
          </EventTimelinePremiumRoot>
        </EventDialogStyledContext.Provider>
      </EventTimelinePremiumStyledContext.Provider>
    </SchedulerStoreContext.Provider>
  );
}) as EventTimelinePremiumComponent;

EventTimelinePremium.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The ref object that allows Event Timeline manipulation.
   * Can be instantiated with `useEventTimelinePremiumApiRef()`.
   */
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      goToNextVisibleDate: PropTypes.func,
      goToPreviousVisibleDate: PropTypes.func,
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
   * The default preferences for the timeline.
   * To use controlled preferences, use the `preferences` prop.
   * @default { ampm: true }
   */
  defaultPreferences: PropTypes.shape({
    ampm: PropTypes.bool,
  }),
  /**
   * The preset initially displayed in the timeline.
   * To render a controlled timeline, use the `preset` prop.
   * @default "dayAndHour"
   */
  defaultPreset: PropTypes.oneOf([
    'dayAndHour',
    'dayAndMonth',
    'dayAndWeek',
    'monthAndYear',
    'year',
  ]),
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
   * Set the locale text of the Event Timeline.
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
   * Event handler called when the preset changes.
   */
  onPresetChange: PropTypes.func,
  /**
   * Event handler called when the visible date changes.
   */
  onVisibleDateChange: PropTypes.func,
  /**
   * Event handler called when the visible resources change.
   */
  onVisibleResourcesChange: PropTypes.func,
  /**
   * Preferences currently displayed in the timeline.
   */
  preferences: PropTypes.shape({
    ampm: PropTypes.bool,
  }),
  /**
   * The preset currently displayed in the timeline.
   */
  preset: PropTypes.oneOf(['dayAndHour', 'dayAndMonth', 'dayAndWeek', 'monthAndYear', 'year']),
  /**
   * The presets available in the timeline.
   * The order is canonical (from most-zoomed-in to most-zoomed-out) and enforced internally,
   * so a future zoom API (`zoomIn()` / `zoomOut()`) behaves consistently regardless of the order
   * in which the presets are provided.
   * @default ["dayAndHour", "dayAndMonth", "dayAndWeek", "monthAndYear", "year"]
   */
  presets: PropTypes.arrayOf(
    PropTypes.oneOf(['dayAndHour', 'dayAndMonth', 'dayAndWeek', 'monthAndYear', 'year']).isRequired,
  ),
  /**
   * Whether the calendar is in read-only mode.
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * The label displayed in the resource column header.
   * When provided, this takes priority over `localeText.timelineResourceTitleHeader`.
   */
  resourceColumnLabel: PropTypes.string,
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
   * The date currently used to determine the visible date range.
   */
  visibleDate: PropTypes.instanceOf(Date),
  /**
   * The IDs of the resources currently visible.
   * A resource is visible if it is not included in this object or if it is included with `true` value.
   */
  visibleResources: PropTypes.object,
} as any;

export { EventTimelinePremium };

interface EventTimelinePremiumComponent {
  <TEvent extends object, TResource extends object>(
    props: EventTimelinePremiumProps<TEvent, TResource> & {
      ref?: React.ForwardedRef<HTMLDivElement>;
    },
  ): React.JSX.Element;
  propTypes?: any;
}
