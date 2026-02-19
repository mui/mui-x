import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import {
  EventDialogClasses,
  eventDialogClassKeys,
  eventDialogSlots,
} from '../internals/components/event-dialog/eventDialogClasses';

export interface EventCalendarClasses extends EventDialogClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the side panel element. */
  sidePanel: string;
  /** Styles applied to the main panel element. */
  mainPanel: string;
  /** Styles applied to the content section element. */
  content: string;
  /** Styles applied to the mini calendar root element. */
  miniCalendar: string;
  /** Styles applied to the mini calendar header element. */
  miniCalendarHeader: string;
  /** Styles applied to the mini calendar header navigation container. */
  miniCalendarNavigation: string;
  /** Styles applied to the mini calendar month label. */
  miniCalendarMonthLabel: string;
  /** Styles applied to the mini calendar weekday header row. */
  miniCalendarWeekdayHeader: string;
  /** Styles applied to individual mini calendar weekday header cells. */
  miniCalendarWeekdayCell: string;
  /** Styles applied to the mini calendar grid (body). */
  miniCalendarGrid: string;
  /** Styles applied to mini calendar week rows. */
  miniCalendarWeekRow: string;
  /** Styles applied to mini calendar day cells. */
  miniCalendarDayCell: string;
  /** Styles applied to mini calendar day buttons. */
  miniCalendarDayButton: string;
  /** Styles applied to the error container element. */
  errorContainer: string;
  /** Styles applied to the error alert element. */
  errorAlert: string;
  /** Styles applied to the error message element. */
  errorMessage: string;
  /** Styles applied to the header toolbar element. */
  headerToolbar: string;
  /** Styles applied to the header toolbar actions element. */
  headerToolbarActions: string;
  /** Styles applied to the header toolbar left side element. */
  headerToolbarLeftElement: string;
  /** Styles applied to the header toolbar label element. */
  headerToolbarLabel: string;
  /** Styles applied to the header toolbar date navigator buttons container element. */
  headerToolbarDateNavigator: string;
  /** Styles applied to the view switcher element. */
  viewSwitcher: string;
  /** Styles applied to the preferences menu element. */
  preferencesMenu: string;
  /** Styles applied to the resources legend root element. */
  resourcesLegend: string;
  /** Styles applied to the resources legend label element. */
  resourcesLegendLabel: string;
  /** Styles applied to resources legend item elements. */
  resourcesLegendItem: string;
  /** Styles applied to resources legend item name elements. */
  resourcesLegendItemName: string;
  /** Styles applied to resources legend item checkbox elements. */
  resourcesLegendItemCheckbox: string;
  /** Styles applied to the agenda view element. */
  agendaView: string;
  /** Styles applied to agenda view row elements. */
  agendaViewRow: string;
  /** Styles applied to agenda view day header cell elements. */
  agendaViewDayHeaderCell: string;
  /** Styles applied to agenda view day number cell elements. */
  agendaViewDayNumberCell: string;
  /** Styles applied to agenda view week day cell elements. */
  agendaViewWeekDayCell: string;
  /** Styles applied to agenda view week day name label elements. */
  agendaViewWeekDayNameLabel: string;
  /** Styles applied to agenda view year and month label elements. */
  agendaViewYearAndMonthLabel: string;
  /** Styles applied to the agenda view events list element. */
  agendaViewEventsList: string;
  /** Styles applied to event skeleton elements. */
  eventSkeleton: string;
  /** Styles applied to the month view root element. */
  monthView: string;
  /** Styles applied to the month view grid element. */
  monthViewGrid: string;
  /** Styles applied to the month view header element. */
  monthViewHeader: string;
  /** Styles applied to month view header cell elements. */
  monthViewHeaderCell: string;
  /** Styles applied to the month view week header cell element. */
  monthViewWeekHeaderCell: string;
  /** Styles applied to the month view body element. */
  monthViewBody: string;
  /** Styles applied to month view row elements. */
  monthViewRow: string;
  /** Styles applied to month view week number cell elements. */
  monthViewWeekNumberCell: string;
  /** Styles applied to month view cell elements. */
  monthViewCell: string;
  /** Styles applied to month view cell number elements. */
  monthViewCellNumber: string;
  /** Styles applied to month view cell number button elements. */
  monthViewCellNumberButton: string;
  /** Styles applied to month view cell events container elements. */
  monthViewCellEvents: string;
  /** Styles applied to month view more events button elements. */
  monthViewMoreEvents: string;
  /** Styles applied to month view placeholder event container elements. */
  monthViewPlaceholderContainer: string;
  /** Styles applied to the day time grid container element. */
  dayTimeGridContainer: string;
  /** Styles applied to the day time grid element. */
  dayTimeGrid: string;
  /** Styles applied to the day time grid header element. */
  dayTimeGridHeader: string;
  /** Styles applied to the day time grid header row element. */
  dayTimeGridHeaderRow: string;
  /** Styles applied to the day time grid all day events grid element. */
  dayTimeGridAllDayEventsGrid: string;
  /** Styles applied to the day time grid all day events row element. */
  dayTimeGridAllDayEventsRow: string;
  /** Styles applied to day time grid all day events cell elements. */
  dayTimeGridAllDayEventsCell: string;
  /** Styles applied to the day time grid all day events header cell element. */
  dayTimeGridAllDayEventsHeaderCell: string;
  /** Styles applied to day time grid header content elements. */
  dayTimeGridHeaderContent: string;
  /** Styles applied to day time grid header button elements. */
  dayTimeGridHeaderButton: string;
  /** Styles applied to day time grid header day name elements. */
  dayTimeGridHeaderDayName: string;
  /** Styles applied to day time grid header day number elements. */
  dayTimeGridHeaderDayNumber: string;
  /** Styles applied to the day time grid body element. */
  dayTimeGridBody: string;
  /** Styles applied to the day time grid scrollable content element. */
  dayTimeGridScrollableContent: string;
  /** Styles applied to the day time grid time axis element. */
  dayTimeGridTimeAxis: string;
  /** Styles applied to day time grid time axis cell elements. */
  dayTimeGridTimeAxisCell: string;
  /** Styles applied to day time grid time axis text elements. */
  dayTimeGridTimeAxisText: string;
  /** Styles applied to the day time grid grid element. */
  dayTimeGridGrid: string;
  /** Styles applied to day time grid column elements. */
  dayTimeGridColumn: string;
  /** Styles applied to day time grid column interactive layer elements. */
  dayTimeGridColumnInteractiveLayer: string;
  /** Styles applied to the day time grid current time indicator element. */
  dayTimeGridCurrentTimeIndicator: string;
  /** Styles applied to the day time grid current time indicator circle element. */
  dayTimeGridCurrentTimeIndicatorCircle: string;
  /** Styles applied to the day time grid current time label element. */
  dayTimeGridCurrentTimeLabel: string;
  /** Styles applied to day time grid all day events cell events container elements. */
  dayTimeGridAllDayEventsCellEvents: string;
  /** Styles applied to day time grid all day event container elements. */
  dayTimeGridAllDayEventContainer: string;
  /** Styles applied to the day time grid scrollable placeholder element. */
  dayTimeGridScrollablePlaceholder: string;
  /** Styles applied to day grid event elements. */
  dayGridEvent: string;
  /** Styles applied to day grid event placeholder elements. */
  dayGridEventPlaceholder: string;
  /** Styles applied to day grid event title elements. */
  dayGridEventTitle: string;
  /** Styles applied to day grid event time elements. */
  dayGridEventTime: string;
  /** Styles applied to day grid event recurring icon elements. */
  dayGridEventRecurringIcon: string;
  /** Styles applied to day grid event resize handler elements. */
  dayGridEventResizeHandler: string;
  /** Styles applied to day grid event card wrapper elements. */
  dayGridEventCardWrapper: string;
  /** Styles applied to day grid event card content elements. */
  dayGridEventCardContent: string;
  /** Styles applied to day grid event lines clamp elements. */
  dayGridEventLinesClamp: string;
  /** Styles applied to event color indicator elements. */
  eventColorIndicator: string;
  /** Styles applied to time grid event elements. */
  timeGridEvent: string;
  /** Styles applied to time grid event placeholder elements. */
  timeGridEventPlaceholder: string;
  /** Styles applied to time grid event skeleton elements. */
  timeGridEventSkeleton: string;
  /** Styles applied to time grid event title elements. */
  timeGridEventTitle: string;
  /** Styles applied to time grid event time elements. */
  timeGridEventTime: string;
  /** Styles applied to time grid event recurring icon elements. */
  timeGridEventRecurringIcon: string;
  /** Styles applied to time grid event resize handler elements. */
  timeGridEventResizeHandler: string;
  /** Styles applied to event item card elements. */
  eventItemCard: string;
  /** Styles applied to event item card wrapper elements. */
  eventItemCardWrapper: string;
  /** Styles applied to event item title elements. */
  eventItemTitle: string;
  /** Styles applied to event item time elements. */
  eventItemTime: string;
  /** Styles applied to event item recurring icon elements. */
  eventItemRecurringIcon: string;
  /** Styles applied to event item resource legend color elements. */
  resourceLegendColor: string;
  /** Styles applied to event item card content elements. */
  eventItemCardContent: string;
  /** Styles applied to event item lines clamp elements. */
  eventItemLinesClamp: string;
}

export type EventCalendarClassKey = keyof EventCalendarClasses;

export function getEventCalendarUtilityClass(slot: string) {
  return generateUtilityClass('MuiEventCalendar', slot);
}

export const eventCalendarClasses: EventCalendarClasses = generateUtilityClasses(
  'MuiEventCalendar',
  [
    'root',
    'sidePanel',
    'mainPanel',
    'content',
    'miniCalendar',
    'miniCalendarHeader',
    'miniCalendarNavigation',
    'miniCalendarMonthLabel',
    'miniCalendarWeekdayHeader',
    'miniCalendarWeekdayCell',
    'miniCalendarGrid',
    'miniCalendarWeekRow',
    'miniCalendarDayCell',
    'miniCalendarDayButton',
    'errorContainer',
    'errorAlert',
    'errorMessage',
    'headerToolbar',
    'headerToolbarActions',
    'headerToolbarLeftElement',
    'headerToolbarLabel',
    'headerToolbarDateNavigator',
    'viewSwitcher',
    'preferencesMenu',
    'resourcesLegend',
    'resourcesLegendLabel',
    'resourcesLegendItem',
    'resourcesLegendItemName',
    'resourcesLegendItemCheckbox',
    'agendaView',
    'agendaViewRow',
    'agendaViewDayHeaderCell',
    'agendaViewDayNumberCell',
    'agendaViewWeekDayCell',
    'agendaViewWeekDayNameLabel',
    'agendaViewYearAndMonthLabel',
    'agendaViewEventsList',
    'eventSkeleton',
    'monthView',
    'monthViewGrid',
    'monthViewHeader',
    'monthViewHeaderCell',
    'monthViewWeekHeaderCell',
    'monthViewBody',
    'monthViewRow',
    'monthViewWeekNumberCell',
    'monthViewCell',
    'monthViewCellNumber',
    'monthViewCellNumberButton',
    'monthViewCellEvents',
    'monthViewMoreEvents',
    'monthViewPlaceholderContainer',
    'dayTimeGridContainer',
    'dayTimeGrid',
    'dayTimeGridHeader',
    'dayTimeGridHeaderRow',
    'dayTimeGridAllDayEventsGrid',
    'dayTimeGridAllDayEventsRow',
    'dayTimeGridAllDayEventsCell',
    'dayTimeGridAllDayEventsHeaderCell',
    'dayTimeGridHeaderContent',
    'dayTimeGridHeaderButton',
    'dayTimeGridHeaderDayName',
    'dayTimeGridHeaderDayNumber',
    'dayTimeGridBody',
    'dayTimeGridScrollableContent',
    'dayTimeGridTimeAxis',
    'dayTimeGridTimeAxisCell',
    'dayTimeGridTimeAxisText',
    'dayTimeGridGrid',
    'dayTimeGridColumn',
    'dayTimeGridColumnInteractiveLayer',
    'dayTimeGridCurrentTimeIndicator',
    'dayTimeGridCurrentTimeIndicatorCircle',
    'dayTimeGridCurrentTimeLabel',
    'dayTimeGridAllDayEventsCellEvents',
    'dayTimeGridAllDayEventContainer',
    'dayTimeGridScrollablePlaceholder',
    'dayGridEvent',
    'dayGridEventPlaceholder',
    'dayGridEventTitle',
    'dayGridEventTime',
    'dayGridEventRecurringIcon',
    'dayGridEventResizeHandler',
    'dayGridEventCardWrapper',
    'dayGridEventCardContent',
    'dayGridEventLinesClamp',
    'eventColorIndicator',
    'timeGridEvent',
    'timeGridEventPlaceholder',
    'timeGridEventSkeleton',
    'timeGridEventTitle',
    'timeGridEventTime',
    'timeGridEventRecurringIcon',
    'timeGridEventResizeHandler',
    'eventItemCard',
    'eventItemCardWrapper',
    'eventItemTitle',
    'eventItemTime',
    'eventItemRecurringIcon',
    'resourceLegendColor',
    'eventItemCardContent',
    'eventItemLinesClamp',
    ...eventDialogClassKeys,
  ],
);

const slots = {
  root: ['root'],
  sidePanel: ['sidePanel'],
  mainPanel: ['mainPanel'],
  content: ['content'],
  miniCalendar: ['miniCalendar'],
  miniCalendarHeader: ['miniCalendarHeader'],
  miniCalendarNavigation: ['miniCalendarNavigation'],
  miniCalendarMonthLabel: ['miniCalendarMonthLabel'],
  miniCalendarWeekdayHeader: ['miniCalendarWeekdayHeader'],
  miniCalendarWeekdayCell: ['miniCalendarWeekdayCell'],
  miniCalendarGrid: ['miniCalendarGrid'],
  miniCalendarWeekRow: ['miniCalendarWeekRow'],
  miniCalendarDayCell: ['miniCalendarDayCell'],
  miniCalendarDayButton: ['miniCalendarDayButton'],
  errorContainer: ['errorContainer'],
  errorAlert: ['errorAlert'],
  errorMessage: ['errorMessage'],
  headerToolbar: ['headerToolbar'],
  headerToolbarActions: ['headerToolbarActions'],
  headerToolbarLeftElement: ['headerToolbarLeftElement'],
  headerToolbarLabel: ['headerToolbarLabel'],
  headerToolbarDateNavigator: ['headerToolbarDateNavigator'],
  viewSwitcher: ['viewSwitcher'],
  preferencesMenu: ['preferencesMenu'],
  resourcesLegend: ['resourcesLegend'],
  resourcesLegendLabel: ['resourcesLegendLabel'],
  resourcesLegendItem: ['resourcesLegendItem'],
  resourcesLegendItemName: ['resourcesLegendItemName'],
  resourcesLegendItemCheckbox: ['resourcesLegendItemCheckbox'],
  agendaView: ['agendaView'],
  agendaViewRow: ['agendaViewRow'],
  agendaViewDayHeaderCell: ['agendaViewDayHeaderCell'],
  agendaViewDayNumberCell: ['agendaViewDayNumberCell'],
  agendaViewWeekDayCell: ['agendaViewWeekDayCell'],
  agendaViewWeekDayNameLabel: ['agendaViewWeekDayNameLabel'],
  agendaViewYearAndMonthLabel: ['agendaViewYearAndMonthLabel'],
  agendaViewEventsList: ['agendaViewEventsList'],
  eventSkeleton: ['eventSkeleton'],
  monthView: ['monthView'],
  monthViewGrid: ['monthViewGrid'],
  monthViewHeader: ['monthViewHeader'],
  monthViewHeaderCell: ['monthViewHeaderCell'],
  monthViewWeekHeaderCell: ['monthViewWeekHeaderCell'],
  monthViewBody: ['monthViewBody'],
  monthViewRow: ['monthViewRow'],
  monthViewWeekNumberCell: ['monthViewWeekNumberCell'],
  monthViewCell: ['monthViewCell'],
  monthViewCellNumber: ['monthViewCellNumber'],
  monthViewCellNumberButton: ['monthViewCellNumberButton'],
  monthViewCellEvents: ['monthViewCellEvents'],
  monthViewMoreEvents: ['monthViewMoreEvents'],
  monthViewPlaceholderContainer: ['monthViewPlaceholderContainer'],
  dayTimeGridContainer: ['dayTimeGridContainer'],
  dayTimeGrid: ['dayTimeGrid'],
  dayTimeGridHeader: ['dayTimeGridHeader'],
  dayTimeGridHeaderRow: ['dayTimeGridHeaderRow'],
  dayTimeGridAllDayEventsGrid: ['dayTimeGridAllDayEventsGrid'],
  dayTimeGridAllDayEventsRow: ['dayTimeGridAllDayEventsRow'],
  dayTimeGridAllDayEventsCell: ['dayTimeGridAllDayEventsCell'],
  dayTimeGridAllDayEventsHeaderCell: ['dayTimeGridAllDayEventsHeaderCell'],
  dayTimeGridHeaderContent: ['dayTimeGridHeaderContent'],
  dayTimeGridHeaderButton: ['dayTimeGridHeaderButton'],
  dayTimeGridHeaderDayName: ['dayTimeGridHeaderDayName'],
  dayTimeGridHeaderDayNumber: ['dayTimeGridHeaderDayNumber'],
  dayTimeGridBody: ['dayTimeGridBody'],
  dayTimeGridScrollableContent: ['dayTimeGridScrollableContent'],
  dayTimeGridTimeAxis: ['dayTimeGridTimeAxis'],
  dayTimeGridTimeAxisCell: ['dayTimeGridTimeAxisCell'],
  dayTimeGridTimeAxisText: ['dayTimeGridTimeAxisText'],
  dayTimeGridGrid: ['dayTimeGridGrid'],
  dayTimeGridColumn: ['dayTimeGridColumn'],
  dayTimeGridColumnInteractiveLayer: ['dayTimeGridColumnInteractiveLayer'],
  dayTimeGridCurrentTimeIndicator: ['dayTimeGridCurrentTimeIndicator'],
  dayTimeGridCurrentTimeIndicatorCircle: ['dayTimeGridCurrentTimeIndicatorCircle'],
  dayTimeGridCurrentTimeLabel: ['dayTimeGridCurrentTimeLabel'],
  dayTimeGridAllDayEventsCellEvents: ['dayTimeGridAllDayEventsCellEvents'],
  dayTimeGridAllDayEventContainer: ['dayTimeGridAllDayEventContainer'],
  dayTimeGridScrollablePlaceholder: ['dayTimeGridScrollablePlaceholder'],
  dayGridEvent: ['dayGridEvent'],
  dayGridEventPlaceholder: ['dayGridEventPlaceholder'],
  dayGridEventTitle: ['dayGridEventTitle'],
  dayGridEventTime: ['dayGridEventTime'],
  dayGridEventRecurringIcon: ['dayGridEventRecurringIcon'],
  dayGridEventResizeHandler: ['dayGridEventResizeHandler'],
  dayGridEventCardWrapper: ['dayGridEventCardWrapper'],
  dayGridEventCardContent: ['dayGridEventCardContent'],
  dayGridEventLinesClamp: ['dayGridEventLinesClamp'],
  eventColorIndicator: ['eventColorIndicator'],
  timeGridEvent: ['timeGridEvent'],
  timeGridEventPlaceholder: ['timeGridEventPlaceholder'],
  timeGridEventSkeleton: ['timeGridEventSkeleton'],
  timeGridEventTitle: ['timeGridEventTitle'],
  timeGridEventTime: ['timeGridEventTime'],
  timeGridEventRecurringIcon: ['timeGridEventRecurringIcon'],
  timeGridEventResizeHandler: ['timeGridEventResizeHandler'],
  eventItemCard: ['eventItemCard'],
  eventItemCardWrapper: ['eventItemCardWrapper'],
  eventItemTitle: ['eventItemTitle'],
  eventItemTime: ['eventItemTime'],
  eventItemRecurringIcon: ['eventItemRecurringIcon'],
  resourceLegendColor: ['resourceLegendColor'],
  eventItemCardContent: ['eventItemCardContent'],
  eventItemLinesClamp: ['eventItemLinesClamp'],
  ...eventDialogSlots,
};

/**
 * Computes the utility classes for EventCalendar components.
 * Exported so both EventCalendar and EventCalendarPremium can use it.
 */
export const useEventCalendarUtilityClasses = (
  classes: Partial<EventCalendarClasses> | undefined,
): EventCalendarClasses => {
  return composeClasses(slots, getEventCalendarUtilityClass, classes);
};
