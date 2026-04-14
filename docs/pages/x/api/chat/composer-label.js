import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesComposerLabel } from './types.composer-label';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ComposerLabel" allowedProps={allowedProps}>
      <TypesComposerLabel />
    </TypesPageShell>
  );
}
