import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatMessageSources } from './types.chat-message-sources';

const allowedProps = ['label'];

export default function Page() {
  return (
    <TypesPageShell name="ChatMessageSources" allowedProps={allowedProps}>
      <TypesChatMessageSources />
    </TypesPageShell>
  );
}
