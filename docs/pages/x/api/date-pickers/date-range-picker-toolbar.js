import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDateRangePickerToolbar } from './types.date-range-picker-toolbar';

const allowedProps = ['classes', 'hidden', 'sx', 'toolbarFormat', 'toolbarPlaceholder'];

export default function Page() {
  return (
    <TypesPageShell name="DateRangePickerToolbar" allowedProps={allowedProps}>
      <TypesDateRangePickerToolbar />
    </TypesPageShell>
  );
}
