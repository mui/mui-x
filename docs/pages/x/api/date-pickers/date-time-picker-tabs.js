import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDateTimePickerTabs } from './types.date-time-picker-tabs';

const allowedProps = ['classes', 'dateIcon', 'hidden', 'sx', 'timeIcon'];

export default function Page() {
  return (
    <TypesPageShell name="DateTimePickerTabs" allowedProps={allowedProps}>
      <TypesDateTimePickerTabs />
    </TypesPageShell>
  );
}
