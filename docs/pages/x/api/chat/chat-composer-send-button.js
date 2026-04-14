import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatComposerSendButton } from './types.chat-composer-send-button';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatComposerSendButton" allowedProps={allowedProps}>
      <TypesChatComposerSendButton />
    </TypesPageShell>
  );
}
