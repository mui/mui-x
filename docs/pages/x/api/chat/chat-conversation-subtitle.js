import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatConversationSubtitle } from './types.chat-conversation-subtitle';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatConversationSubtitle" allowedProps={allowedProps}>
      <TypesChatConversationSubtitle />
    </TypesPageShell>
  );
}
