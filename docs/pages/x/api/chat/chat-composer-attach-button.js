import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatComposerAttachButton } from './types.chat-composer-attach-button';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatComposerAttachButton" allowedProps={allowedProps}>
      <TypesChatComposerAttachButton />
    </TypesPageShell>
  );
}
