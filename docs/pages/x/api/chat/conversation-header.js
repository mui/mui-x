import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesConversationHeader } from './types.conversation-header';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ConversationHeader" allowedProps={allowedProps}>
      <TypesConversationHeader />
    </TypesPageShell>
  );
}
