import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatConversationTitle } from './types.chat-conversation-title';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatConversationTitle" allowedProps={allowedProps}>
      <TypesChatConversationTitle />
    </TypesPageShell>
  );
}
