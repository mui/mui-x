import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesConversationRoot } from './types.conversation-root';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ConversationRoot" allowedProps={allowedProps}>
      <TypesConversationRoot />
    </TypesPageShell>
  );
}
