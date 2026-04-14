import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatMessageActions } from './types.chat-message-actions';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatMessageActions" allowedProps={allowedProps}>
      <TypesChatMessageActions />
    </TypesPageShell>
  );
}
