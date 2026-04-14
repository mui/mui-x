import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesTimeRangePickerToolbar } from './types.time-range-picker-toolbar';

const allowedProps = ['classes', 'hidden', 'sx', 'toolbarPlaceholder'];

export default function Page() {
  return (
    <TypesPageShell name="TimeRangePickerToolbar" allowedProps={allowedProps}>
      <TypesTimeRangePickerToolbar />
    </TypesPageShell>
  );
}
