import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDateTimeRangePickerToolbar } from './types.date-time-range-picker-toolbar';

const allowedProps = ['classes', 'hidden', 'sx', 'toolbarFormat', 'toolbarPlaceholder'];

export default function Page() {
  return (
    <TypesPageShell name="DateTimeRangePickerToolbar" allowedProps={allowedProps}>
      <TypesDateTimeRangePickerToolbar />
    </TypesPageShell>
  );
}
