import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatMessageSource } from './types.chat-message-source';

const allowedProps = ['href', 'index', 'title'];

export default function Page() {
  return (
    <TypesPageShell name="ChatMessageSource" allowedProps={allowedProps}>
      <TypesChatMessageSource />
    </TypesPageShell>
  );
}
