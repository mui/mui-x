import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatMessageAvatar } from './types.chat-message-avatar';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatMessageAvatar" allowedProps={allowedProps}>
      <TypesChatMessageAvatar />
    </TypesPageShell>
  );
}
