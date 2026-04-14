import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatMessageList } from './types.chat-message-list';

const allowedProps = ['autoScroll'];

export default function Page() {
  return (
    <TypesPageShell name="ChatMessageList" allowedProps={allowedProps}>
      <TypesChatMessageList />
    </TypesPageShell>
  );
}
