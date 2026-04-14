import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPickersRangeCalendarHeader } from './types.pickers-range-calendar-header';

const allowedProps = ['calendars', 'classes', 'format', 'labelId', 'month', 'monthIndex', 'slotProps', 'slots', 'sx'];

export default function Page() {
  return (
    <TypesPageShell name="PickersRangeCalendarHeader" allowedProps={allowedProps}>
      <TypesPickersRangeCalendarHeader />
    </TypesPageShell>
  );
}
