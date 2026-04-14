import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatConversationHeaderInfo } from './types.chat-conversation-header-info';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatConversationHeaderInfo" allowedProps={allowedProps}>
      <TypesChatConversationHeaderInfo />
    </TypesPageShell>
  );
}
