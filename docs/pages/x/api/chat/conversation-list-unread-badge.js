import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesConversationListUnreadBadge } from './types.conversation-list-unread-badge';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ConversationListUnreadBadge" allowedProps={allowedProps}>
      <TypesConversationListUnreadBadge />
    </TypesPageShell>
  );
}
