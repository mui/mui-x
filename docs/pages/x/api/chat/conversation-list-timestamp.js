import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesConversationListTimestamp } from './types.conversation-list-timestamp';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ConversationListTimestamp" allowedProps={allowedProps}>
      <TypesConversationListTimestamp />
    </TypesPageShell>
  );
}
