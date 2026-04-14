import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesComposerHelperText } from './types.composer-helper-text';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ComposerHelperText" allowedProps={allowedProps}>
      <TypesComposerHelperText />
    </TypesPageShell>
  );
}
