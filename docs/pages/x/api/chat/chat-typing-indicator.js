import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatTypingIndicator } from './types.chat-typing-indicator';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatTypingIndicator" allowedProps={allowedProps}>
      <TypesChatTypingIndicator />
    </TypesPageShell>
  );
}
