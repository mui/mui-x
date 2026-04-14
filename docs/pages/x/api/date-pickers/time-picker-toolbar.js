import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesTimePickerToolbar } from './types.time-picker-toolbar';

const allowedProps = ['classes', 'hidden', 'sx', 'toolbarFormat', 'toolbarPlaceholder'];

export default function Page() {
  return (
    <TypesPageShell name="TimePickerToolbar" allowedProps={allowedProps}>
      <TypesTimePickerToolbar />
    </TypesPageShell>
  );
}
