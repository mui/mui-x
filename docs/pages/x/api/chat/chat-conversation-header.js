import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatConversationHeader } from './types.chat-conversation-header';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatConversationHeader" allowedProps={allowedProps}>
      <TypesChatConversationHeader />
    </TypesPageShell>
  );
}
