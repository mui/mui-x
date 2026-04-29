import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { EventDialogClasses, eventDialogClassKeys } from '@mui/x-scheduler/internals';

// Note: the per-preset header class slots (`timeHeader`, `daysHeader`, `weeksHeader`,
// `monthsHeader`, `yearsHeader` and their children) are intentionally NOT renamed along
// with the rest of the views → presets migration. They are replaced by a single set of
// generic slots (`header`, `headerRow`, `headerCell`, `headerCellLabel`) in #21827 when
// the bespoke headers are unified into a single generic header component.

export interface EventTimelinePremiumClasses extends EventDialogClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the content section element. */
  content: string;
  /** Styles applied to the grid element. */
  grid: string;
  /** Styles applied to the header row element. */
  headerRow: string;
  /** Styles applied to the title header cell element. */
  titleHeaderCell: string;
  /** Styles applied to the events header cell element. */
  eventsHeaderCell: string;
  /** Styles applied to the events header cell content element. */
  eventsHeaderCellContent: string;
  /** Styles applied to the title sub-grid element. */
  titleSubGrid: string;
  /** Styles applied to the events sub-grid wrapper element. */
  eventsSubGridWrapper: string;
  /** Styles applied to the events sub-grid element. */
  eventsSubGrid: string;
  /** Styles applied to the events sub-grid row element. */
  eventsSubGridRow: string;
  /** Styles applied to the title cell row element. */
  titleCellRow: string;
  /** Styles applied to the title cell element. */
  titleCell: string;
  /** Styles applied to the title cell legend color element. */
  titleCellLegendColor: string;
  /** Styles applied to the current time indicator element. */
  currentTimeIndicator: string;
  /** Styles applied to the current time indicator circle element. */
  currentTimeIndicatorCircle: string;
  /** Styles applied to event elements. */
  event: string;
  /** Styles applied to event placeholder elements. */
  eventPlaceholder: string;
  /** Styles applied to event resize handler elements. */
  eventResizeHandler: string;
  /** Styles applied to event lines clamp elements. */
  eventLinesClamp: string;
  /** Styles applied to event recurring icon elements. */
  eventRecurringIcon: string;
  /** Styles applied to the time header root element. */
  timeHeader: string;
  /** Styles applied to time header cell elements. */
  timeHeaderCell: string;
  /** Styles applied to the time header day label element. */
  timeHeaderDayLabel: string;
  /** Styles applied to the time header cells row element. */
  timeHeaderCellsRow: string;
  /** Styles applied to time header time cell elements. */
  timeHeaderTimeCell: string;
  /** Styles applied to time header time label elements. */
  timeHeaderTimeLabel: string;
  /** Styles applied to the days header root element. */
  daysHeader: string;
  /** Styles applied to days header cell elements. */
  daysHeaderCell: string;
  /** Styles applied to days header time elements. */
  daysHeaderTime: string;
  /** Styles applied to days header week day elements. */
  daysHeaderWeekDay: string;
  /** Styles applied to days header day number elements. */
  daysHeaderDayNumber: string;
  /** Styles applied to days header month start elements. */
  daysHeaderMonthStart: string;
  /** Styles applied to days header month start label elements. */
  daysHeaderMonthStartLabel: string;
  /** Styles applied to the weeks header root element. */
  weeksHeader: string;
  /** Styles applied to weeks header cell elements. */
  weeksHeaderCell: string;
  /** Styles applied to weeks header day label elements. */
  weeksHeaderDayLabel: string;
  /** Styles applied to the weeks header days row element. */
  weeksHeaderDaysRow: string;
  /** Styles applied to weeks header day cell elements. */
  weeksHeaderDayCell: string;
  /** Styles applied to the months header root element. */
  monthsHeader: string;
  /** Styles applied to months header year label elements. */
  monthsHeaderYearLabel: string;
  /** Styles applied to months header month label elements. */
  monthsHeaderMonthLabel: string;
  /** Styles applied to the years header root element. */
  yearsHeader: string;
  /** Styles applied to years header year label elements. */
  yearsHeaderYearLabel: string;
}

export type EventTimelinePremiumClassKey = keyof EventTimelinePremiumClasses;

export function getEventTimelinePremiumUtilityClass(slot: string) {
  return generateUtilityClass('MuiEventTimeline', slot);
}

export const eventTimelinePremiumClasses: EventTimelinePremiumClasses = generateUtilityClasses(
  'MuiEventTimeline',
  [
    'root',
    'content',
    'grid',
    'headerRow',
    'titleHeaderCell',
    'eventsHeaderCell',
    'eventsHeaderCellContent',
    'titleSubGrid',
    'eventsSubGridWrapper',
    'eventsSubGrid',
    'eventsSubGridRow',
    'titleCellRow',
    'titleCell',
    'titleCellLegendColor',
    'currentTimeIndicator',
    'currentTimeIndicatorCircle',
    'event',
    'eventPlaceholder',
    'eventResizeHandler',
    'eventLinesClamp',
    'eventRecurringIcon',
    'timeHeader',
    'timeHeaderCell',
    'timeHeaderDayLabel',
    'timeHeaderCellsRow',
    'timeHeaderTimeCell',
    'timeHeaderTimeLabel',
    'daysHeader',
    'daysHeaderCell',
    'daysHeaderTime',
    'daysHeaderWeekDay',
    'daysHeaderDayNumber',
    'daysHeaderMonthStart',
    'daysHeaderMonthStartLabel',
    'weeksHeader',
    'weeksHeaderCell',
    'weeksHeaderDayLabel',
    'weeksHeaderDaysRow',
    'weeksHeaderDayCell',
    'monthsHeader',
    'monthsHeaderYearLabel',
    'monthsHeaderMonthLabel',
    'yearsHeader',
    'yearsHeaderYearLabel',
    ...eventDialogClassKeys,
  ],
);
