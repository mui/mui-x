import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesYearCalendar } from './types.year-calendar';

const allowedProps = ['classes', 'defaultValue', 'disableFuture', 'disableHighlightToday', 'disablePast', 'disabled', 'maxDate', 'minDate', 'onChange', 'readOnly', 'referenceDate', 'shouldDisableYear', 'slotProps', 'slots', 'sx', 'timezone', 'value', 'yearsOrder', 'yearsPerRow'];

export default function Page() {
  return (
    <TypesPageShell name="YearCalendar" allowedProps={allowedProps}>
      <TypesYearCalendar />
    </TypesPageShell>
  );
}
