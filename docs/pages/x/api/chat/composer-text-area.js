import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesComposerTextArea } from './types.composer-text-area';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ComposerTextArea" allowedProps={allowedProps}>
      <TypesComposerTextArea />
    </TypesPageShell>
  );
}
