import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesConversationListItem } from './types.conversation-list-item';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ConversationListItem" allowedProps={allowedProps}>
      <TypesConversationListItem />
    </TypesPageShell>
  );
}
