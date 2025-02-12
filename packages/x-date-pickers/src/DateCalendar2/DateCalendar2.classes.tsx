import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface DateCalendar2Classes {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the transition group element. */
  transitionGroup: string;
  /** Styles applied to the root element of the header. */
  headerRoot: string;
  /** Styles applied to the label container element of the header. */
  headerLabelContainer: string;
  /** Styles applied to the transition group element of the header. */
  headerLabelTransitionGroup: string;
  /** Styles applied to the label content element of the header. */
  headerLabelContent: string;
  /** Styles applied to the switch view button element of the header. */
  headerSwitchViewButton: string;
  /** Styles applied to the switch view icon element of the header. */
  headerSwitchViewIcon: string;
  /** Styles applied to the navigation element of the header. */
  headerNavigation: string;
  /** Styles applied to the navigation button element of the header. */
  headerNavigationButton: string;
  /** Styles applied to the navigation spacer element of the header. */
  headerNavigationSpacer: string;
  /** Styles applied to the root element of the day's grid. */
  daysGridRoot: string;
  /** Styles applied to the header element of the day's grid. */
  daysGridHeader: string;
  /** Styles applied to the week number header cell element of the day's grid. */
  daysGridWeekNumberHeaderCell: string;
  /** Styles applied to the header cell element of the day's grid. */
  daysGridHeaderCell: string;
  /** Styles applied to the body transition group element of the day's grid. */
  daysGridBodyTransitionGroup: string;
  /** Styles applied to the body element of the day's grid. */
  daysGridBody: string;
  /** Styles applied to the row element of the day's grid. */
  daysGridRow: string;
  /** Styles applied to the week number cell element of the day's grid. */
  daysGridWeekNumberCell: string;
  /** Styles applied to the day's cell element. */
  daysCell: string;
  /** Styles applied to the root element of the day's grid. */
  monthsGridRoot: string;
  /** Styles applied to the month's cell element */
  monthsCell: string;
  /** Styles applied to the root element of the year's grid. */
  yearsGridRoot: string;
  /** Styles applied to the year's cell element */
  yearsCell: string;
  /** Styles applied to the loading panel element */
  loadingPanel: string;
}

export const getDateCalendar2UtilityClass = (slot: string) =>
  generateUtilityClass('MuiDateCalendar2', slot);

export const dateCalendar2Classes: DateCalendar2Classes = generateUtilityClasses(
  'MuiDateCalendar2',
  [
    'root',
    'transitionGroup',
    'headerRoot',
    'headerLabelContainer',
    'headerLabelTransitionGroup',
    'headerLabelContent',
    'headerSwitchViewButton',
    'headerSwitchViewIcon',
    'headerNavigation',
    'headerNavigationButton',
    'headerNavigationSpacer',
    'daysGridRoot',
    'daysGridHeader',
    'daysGridWeekNumberHeaderCell',
    'daysGridHeaderCell',
    'daysGridBodyTransitionGroup',
    'daysGridBody',
    'daysGridRow',
    'daysGridWeekNumberCell',
    'daysCell',
    'monthsGridRoot',
    'monthsCell',
    'yearsGridRoot',
    'yearsCell',
    'loadingPanel',
  ],
);
