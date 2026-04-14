import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatBox } from './types.chat-box';

const allowedProps = ['classes', 'currentUser', 'density', 'features', 'initialActiveConversationId', 'initialComposerValue', 'initialConversations', 'initialMessages', 'members', 'slotProps', 'slots', 'storeClass', 'streamFlushInterval', 'suggestions', 'suggestionsAutoSubmit', 'variant'];

export default function Page() {
  return (
    <TypesPageShell name="ChatBox" allowedProps={allowedProps}>
      <TypesChatBox />
    </TypesPageShell>
  );
}
