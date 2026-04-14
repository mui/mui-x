import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesConversationTitle } from './types.conversation-title';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ConversationTitle" allowedProps={allowedProps}>
      <TypesConversationTitle />
    </TypesPageShell>
  );
}
