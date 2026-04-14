import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMonthCalendar } from './types.month-calendar';

const allowedProps = ['classes', 'defaultValue', 'disableFuture', 'disableHighlightToday', 'disablePast', 'disabled', 'maxDate', 'minDate', 'monthsPerRow', 'onChange', 'readOnly', 'referenceDate', 'shouldDisableMonth', 'slotProps', 'slots', 'sx', 'timezone', 'value'];

export default function Page() {
  return (
    <TypesPageShell name="MonthCalendar" allowedProps={allowedProps}>
      <TypesMonthCalendar />
    </TypesPageShell>
  );
}
