import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatMessageInlineMeta } from './types.chat-message-inline-meta';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatMessageInlineMeta" allowedProps={allowedProps}>
      <TypesChatMessageInlineMeta />
    </TypesPageShell>
  );
}
