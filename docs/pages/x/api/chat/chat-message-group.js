import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatMessageGroup } from './types.chat-message-group';

const allowedProps = ['groupKey'];

export default function Page() {
  return (
    <TypesPageShell name="ChatMessageGroup" allowedProps={allowedProps}>
      <TypesChatMessageGroup />
    </TypesPageShell>
  );
}
