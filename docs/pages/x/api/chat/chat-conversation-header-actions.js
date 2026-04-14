import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatConversationHeaderActions } from './types.chat-conversation-header-actions';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatConversationHeaderActions" allowedProps={allowedProps}>
      <TypesChatConversationHeaderActions />
    </TypesPageShell>
  );
}
