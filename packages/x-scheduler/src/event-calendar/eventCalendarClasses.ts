import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface EventCalendarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the side panel element. */
  sidePanel: string;
  /** Styles applied to the main panel element. */
  mainPanel: string;
  /** Styles applied to the content section element. */
  content: string;
  /** Styles applied to the month calendar placeholder element. */
  monthCalendarPlaceholder: string;
  /** Styles applied to the error container element. */
  errorContainer: string;
  /** Styles applied to the date navigator root element. */
  dateNavigator: string;
  /** Styles applied to the date navigator label element. */
  dateNavigatorLabel: string;
  /** Styles applied to the date navigator buttons container element. */
  dateNavigatorButtonsContainer: string;
  /** Styles applied to the header toolbar element. */
  headerToolbar: string;
  /** Styles applied to the header toolbar actions element. */
  headerToolbarActions: string;
  /** Styles applied to the header toolbar primary action wrapper element. */
  headerToolbarPrimaryActionWrapper: string;
  /** Styles applied to the view switcher element. */
  viewSwitcher: string;
  /** Styles applied to the preferences menu element. */
  preferencesMenu: string;
  /** Styles applied to the resources legend root element. */
  resourcesLegend: string;
  /** Styles applied to resources legend item elements. */
  resourcesLegendItem: string;
  /** Styles applied to resources legend item color dot elements. */
  resourcesLegendItemColorDot: string;
  /** Styles applied to resources legend item name elements. */
  resourcesLegendItemName: string;
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
  /** Styles applied to the agenda view loading overlay element. */
  agendaViewLoadingOverlay: string;
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
  /** Styles applied to the month view loading overlay element. */
  monthViewLoadingOverlay: string;
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
  /** Styles applied to the day time grid loading overlay element. */
  dayTimeGridLoadingOverlay: string;
  /** Styles applied to day time grid column elements. */
  dayTimeGridColumn: string;
  /** Styles applied to day time grid column interactive layer elements. */
  dayTimeGridColumnInteractiveLayer: string;
  /** Styles applied to the day time grid current time indicator element. */
  dayTimeGridCurrentTimeIndicator: string;
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
    'monthCalendarPlaceholder',
    'errorContainer',
    'dateNavigator',
    'dateNavigatorLabel',
    'dateNavigatorButtonsContainer',
    'headerToolbar',
    'headerToolbarActions',
    'headerToolbarPrimaryActionWrapper',
    'viewSwitcher',
    'preferencesMenu',
    'resourcesLegend',
    'resourcesLegendItem',
    'resourcesLegendItemColorDot',
    'resourcesLegendItemName',
    'agendaView',
    'agendaViewRow',
    'agendaViewDayHeaderCell',
    'agendaViewDayNumberCell',
    'agendaViewWeekDayCell',
    'agendaViewWeekDayNameLabel',
    'agendaViewYearAndMonthLabel',
    'agendaViewEventsList',
    'agendaViewLoadingOverlay',
    'monthView',
    'monthViewGrid',
    'monthViewHeader',
    'monthViewHeaderCell',
    'monthViewWeekHeaderCell',
    'monthViewBody',
    'monthViewLoadingOverlay',
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
    'dayTimeGridLoadingOverlay',
    'dayTimeGridColumn',
    'dayTimeGridColumnInteractiveLayer',
    'dayTimeGridCurrentTimeIndicator',
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
  ],
);
