import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPickersShortcuts } from './types.pickers-shortcuts';

const allowedProps = ['changeImportance', 'dense', 'disablePadding', 'items', 'subheader', 'sx'];

export default function Page() {
  return (
    <TypesPageShell name="PickersShortcuts" allowedProps={allowedProps}>
      <TypesPickersShortcuts />
    </TypesPageShell>
  );
}
