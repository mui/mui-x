import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPickersLayout } from './types.pickers-layout';

const allowedProps = ['classes', 'slotProps', 'slots', 'sx'];

export default function Page() {
  return (
    <TypesPageShell name="PickersLayout" allowedProps={allowedProps}>
      <TypesPickersLayout />
    </TypesPageShell>
  );
}
