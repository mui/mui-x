import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDatePickerToolbar } from './types.date-picker-toolbar';

const allowedProps = ['classes', 'hidden', 'sx', 'toolbarFormat', 'toolbarPlaceholder'];

export default function Page() {
  return (
    <TypesPageShell name="DatePickerToolbar" allowedProps={allowedProps}>
      <TypesDatePickerToolbar />
    </TypesPageShell>
  );
}
