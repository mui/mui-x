import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDateRangeCalendar } from './types.date-range-calendar';

const allowedProps = ['autoFocus', 'availableRangePositions', 'calendars', 'classes', 'currentMonthCalendarPosition', 'dayOfWeekFormatter', 'defaultRangePosition', 'defaultValue', 'disableAutoMonthSwitching', 'disableDragEditing', 'disableFuture', 'disableHighlightToday', 'disablePast', 'disabled', 'displayWeekNumber', 'fixedWeekNumber', 'focusedView', 'loading', 'maxDate', 'minDate', 'onChange', 'onFocusedViewChange', 'onMonthChange', 'onRangePositionChange', 'onViewChange', 'openTo', 'rangePosition', 'readOnly', 'reduceAnimations', 'referenceDate', 'renderLoading', 'shouldDisableDate', 'showDaysOutsideCurrentMonth', 'slotProps', 'slots', 'sx', 'timezone', 'value', 'view', 'views'];

export default function Page() {
  return (
    <TypesPageShell name="DateRangeCalendar" allowedProps={allowedProps}>
      <TypesDateRangeCalendar />
    </TypesPageShell>
  );
}
