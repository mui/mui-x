import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatMessageMeta } from './types.chat-message-meta';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatMessageMeta" allowedProps={allowedProps}>
      <TypesChatMessageMeta />
    </TypesPageShell>
  );
}
