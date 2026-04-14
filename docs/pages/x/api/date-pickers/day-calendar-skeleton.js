import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDayCalendarSkeleton } from './types.day-calendar-skeleton';

const allowedProps = ['classes', 'sx'];

export default function Page() {
  return (
    <TypesPageShell name="DayCalendarSkeleton" allowedProps={allowedProps}>
      <TypesDayCalendarSkeleton />
    </TypesPageShell>
  );
}
