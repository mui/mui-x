import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDateTimeRangePickerTabs } from './types.date-time-range-picker-tabs';

const allowedProps = ['classes', 'dateIcon', 'hidden', 'sx', 'timeIcon'];

export default function Page() {
  return (
    <TypesPageShell name="DateTimeRangePickerTabs" allowedProps={allowedProps}>
      <TypesDateTimeRangePickerTabs />
    </TypesPageShell>
  );
}
