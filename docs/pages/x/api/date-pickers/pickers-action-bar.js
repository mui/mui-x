import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPickersActionBar } from './types.pickers-action-bar';

const allowedProps = ['actions', 'disableSpacing', 'sx'];

export default function Page() {
  return (
    <TypesPageShell name="PickersActionBar" allowedProps={allowedProps}>
      <TypesPickersActionBar />
    </TypesPageShell>
  );
}
