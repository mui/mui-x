import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatMessageContent } from './types.chat-message-content';

const allowedProps = ['afterContent', 'partProps'];

export default function Page() {
  return (
    <TypesPageShell name="ChatMessageContent" allowedProps={allowedProps}>
      <TypesChatMessageContent />
    </TypesPageShell>
  );
}
