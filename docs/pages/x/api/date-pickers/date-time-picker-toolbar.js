import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesDateTimePickerToolbar } from './types.date-time-picker-toolbar';

const allowedProps = ['classes', 'hidden', 'sx', 'toolbarFormat', 'toolbarPlaceholder', 'toolbarTitle'];

export default function Page() {
  return (
    <TypesPageShell name="DateTimePickerToolbar" allowedProps={allowedProps}>
      <TypesDateTimePickerToolbar />
    </TypesPageShell>
  );
}
