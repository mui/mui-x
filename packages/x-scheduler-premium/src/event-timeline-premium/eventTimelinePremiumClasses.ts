import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface EventTimelinePremiumClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the header toolbar element. */
  headerToolbar: string;
  /** Styles applied to the content section element. */
  content: string;
  /** Styles applied to the grid element. */
  grid: string;
  /** Styles applied to the title sub-grid wrapper element. */
  titleSubGridWrapper: string;
  /** Styles applied to the title sub-grid element. */
  titleSubGrid: string;
  /** Styles applied to the title sub-grid header row element. */
  titleSubGridHeaderRow: string;
  /** Styles applied to the title sub-grid header cell element. */
  titleSubGridHeaderCell: string;
  /** Styles applied to the events sub-grid wrapper element. */
  eventsSubGridWrapper: string;
  /** Styles applied to the events sub-grid element. */
  eventsSubGrid: string;
  /** Styles applied to the events sub-grid header row element. */
  eventsSubGridHeaderRow: string;
  /** Styles applied to the events sub-grid row element. */
  eventsSubGridRow: string;
  /** Styles applied to the title cell row element. */
  titleCellRow: string;
  /** Styles applied to the title cell element. */
  titleCell: string;
  /** Styles applied to the title cell legend color element. */
  titleCellLegendColor: string;
  /** Styles applied to event elements. */
  event: string;
  /** Styles applied to event resize handler elements. */
  eventResizeHandler: string;
  /** Styles applied to the time header root element. */
  timeHeaderRoot: string;
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
  daysHeaderRoot: string;
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
  weeksHeaderRoot: string;
  /** Styles applied to weeks header cell elements. */
  weeksHeaderCell: string;
  /** Styles applied to weeks header day label elements. */
  weeksHeaderDayLabel: string;
  /** Styles applied to the weeks header days row element. */
  weeksHeaderDaysRow: string;
  /** Styles applied to weeks header day cell elements. */
  weeksHeaderDayCell: string;
  /** Styles applied to the months header root element. */
  monthsHeaderRoot: string;
  /** Styles applied to months header year label elements. */
  monthsHeaderYearLabel: string;
  /** Styles applied to months header month label elements. */
  monthsHeaderMonthLabel: string;
  /** Styles applied to the years header root element. */
  yearsHeaderRoot: string;
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
    'headerToolbar',
    'content',
    'grid',
    'titleSubGridWrapper',
    'titleSubGrid',
    'titleSubGridHeaderRow',
    'titleSubGridHeaderCell',
    'eventsSubGridWrapper',
    'eventsSubGrid',
    'eventsSubGridHeaderRow',
    'eventsSubGridRow',
    'titleCellRow',
    'titleCell',
    'titleCellLegendColor',
    'event',
    'eventResizeHandler',
    'timeHeaderRoot',
    'timeHeaderCell',
    'timeHeaderDayLabel',
    'timeHeaderCellsRow',
    'timeHeaderTimeCell',
    'timeHeaderTimeLabel',
    'daysHeaderRoot',
    'daysHeaderCell',
    'daysHeaderTime',
    'daysHeaderWeekDay',
    'daysHeaderDayNumber',
    'daysHeaderMonthStart',
    'daysHeaderMonthStartLabel',
    'weeksHeaderRoot',
    'weeksHeaderCell',
    'weeksHeaderDayLabel',
    'weeksHeaderDaysRow',
    'weeksHeaderDayCell',
    'monthsHeaderRoot',
    'monthsHeaderYearLabel',
    'monthsHeaderMonthLabel',
    'yearsHeaderRoot',
    'yearsHeaderYearLabel',
  ],
);
