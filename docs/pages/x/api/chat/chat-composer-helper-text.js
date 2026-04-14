import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatComposerHelperText } from './types.chat-composer-helper-text';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatComposerHelperText" allowedProps={allowedProps}>
      <TypesChatComposerHelperText />
    </TypesPageShell>
  );
}
