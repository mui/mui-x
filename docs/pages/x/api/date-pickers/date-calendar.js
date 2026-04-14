import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDateCalendar } from './types.date-calendar';

const allowedProps = ['autoFocus', 'classes', 'dayOfWeekFormatter', 'defaultValue', 'disableFuture', 'disableHighlightToday', 'disablePast', 'disabled', 'displayWeekNumber', 'fixedWeekNumber', 'focusedView', 'loading', 'maxDate', 'minDate', 'monthsPerRow', 'onChange', 'onFocusedViewChange', 'onMonthChange', 'onViewChange', 'onYearChange', 'openTo', 'readOnly', 'reduceAnimations', 'referenceDate', 'renderLoading', 'shouldDisableDate', 'shouldDisableMonth', 'shouldDisableYear', 'showDaysOutsideCurrentMonth', 'slotProps', 'slots', 'sx', 'timezone', 'value', 'view', 'views', 'yearsOrder', 'yearsPerRow'];

export default function Page() {
  return (
    <TypesPageShell name="DateCalendar" allowedProps={allowedProps}>
      <TypesDateCalendar />
    </TypesPageShell>
  );
}
