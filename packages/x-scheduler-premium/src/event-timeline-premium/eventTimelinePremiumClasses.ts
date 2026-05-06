import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { EventDialogClasses, eventDialogClassKeys } from '@mui/x-scheduler/internals';

export interface EventTimelinePremiumClasses extends EventDialogClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the content section element. */
  content: string;
  /** Styles applied to the grid element. */
  grid: string;
  /** Styles applied to the top row of the grid (contains the title and events headers). */
  headerRow: string;
  /** Styles applied to the generic header (wraps all level rows). */
  header: string;
  /** Styles applied to each level row inside the generic header. */
  headerLevelRow: string;
  /** Styles applied to each cell inside a header level row. */
  headerCell: string;
  /** Styles applied to the label element inside a header cell. */
  headerCellLabel: string;
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
    'header',
    'headerLevelRow',
    'headerCell',
    'headerCellLabel',
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
    ...eventDialogClassKeys,
  ],
);
