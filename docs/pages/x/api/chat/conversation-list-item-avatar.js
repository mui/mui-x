import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesConversationListItemAvatar } from './types.conversation-list-item-avatar';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ConversationListItemAvatar" allowedProps={allowedProps}>
      <TypesConversationListItemAvatar />
    </TypesPageShell>
  );
}
