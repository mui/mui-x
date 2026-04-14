import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesConversationListPreview } from './types.conversation-list-preview';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ConversationListPreview" allowedProps={allowedProps}>
      <TypesConversationListPreview />
    </TypesPageShell>
  );
}
