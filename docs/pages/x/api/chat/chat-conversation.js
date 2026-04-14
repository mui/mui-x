import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatConversation } from './types.chat-conversation';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatConversation" allowedProps={allowedProps}>
      <TypesChatConversation />
    </TypesPageShell>
  );
}
