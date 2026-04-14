import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesConversationHeaderActions } from './types.conversation-header-actions';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ConversationHeaderActions" allowedProps={allowedProps}>
      <TypesConversationHeaderActions />
    </TypesPageShell>
  );
}
