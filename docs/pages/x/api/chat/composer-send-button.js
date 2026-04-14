import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesComposerSendButton } from './types.composer-send-button';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ComposerSendButton" allowedProps={allowedProps}>
      <TypesComposerSendButton />
    </TypesPageShell>
  );
}
