import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPickersCalendarHeader } from './types.pickers-calendar-header';

const allowedProps = ['classes', 'format', 'labelId', 'slotProps', 'slots', 'sx'];

export default function Page() {
  return (
    <TypesPageShell name="PickersCalendarHeader" allowedProps={allowedProps}>
      <TypesPickersCalendarHeader />
    </TypesPageShell>
  );
}
