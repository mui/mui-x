import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatConversationList } from './types.chat-conversation-list';

const allowedProps = ['variant'];

export default function Page() {
  return (
    <TypesPageShell name="ChatConversationList" allowedProps={allowedProps}>
      <TypesChatConversationList />
    </TypesPageShell>
  );
}
