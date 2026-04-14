import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesConversationSubtitle } from './types.conversation-subtitle';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ConversationSubtitle" allowedProps={allowedProps}>
      <TypesConversationSubtitle />
    </TypesPageShell>
  );
}
