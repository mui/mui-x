import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesTimeRangePickerTabs } from './types.time-range-picker-tabs';

const allowedProps = ['classes', 'hidden', 'sx', 'timeIcon'];

export default function Page() {
  return (
    <TypesPageShell name="TimeRangePickerTabs" allowedProps={allowedProps}>
      <TypesTimeRangePickerTabs />
    </TypesPageShell>
  );
}
