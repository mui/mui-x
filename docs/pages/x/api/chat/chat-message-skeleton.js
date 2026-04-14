import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatMessageSkeleton } from './types.chat-message-skeleton';

const allowedProps = ['lines'];

export default function Page() {
  return (
    <TypesPageShell name="ChatMessageSkeleton" allowedProps={allowedProps}>
      <TypesChatMessageSkeleton />
    </TypesPageShell>
  );
}
