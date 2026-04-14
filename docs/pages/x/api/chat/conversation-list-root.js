import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesConversationListRoot } from './types.conversation-list-root';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ConversationListRoot" allowedProps={allowedProps}>
      <TypesConversationListRoot />
    </TypesPageShell>
  );
}
