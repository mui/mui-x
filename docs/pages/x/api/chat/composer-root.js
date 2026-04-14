import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesComposerRoot } from './types.composer-root';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ComposerRoot" allowedProps={allowedProps}>
      <TypesComposerRoot />
    </TypesPageShell>
  );
}
