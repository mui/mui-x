import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesComposerToolbar } from './types.composer-toolbar';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ComposerToolbar" allowedProps={allowedProps}>
      <TypesComposerToolbar />
    </TypesPageShell>
  );
}
