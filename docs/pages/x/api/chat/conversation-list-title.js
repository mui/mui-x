import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesConversationListTitle } from './types.conversation-list-title';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ConversationListTitle" allowedProps={allowedProps}>
      <TypesConversationListTitle />
    </TypesPageShell>
  );
}
