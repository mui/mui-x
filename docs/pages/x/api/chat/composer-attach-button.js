import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesComposerAttachButton } from './types.composer-attach-button';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ComposerAttachButton" allowedProps={allowedProps}>
      <TypesComposerAttachButton />
    </TypesPageShell>
  );
}
