import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatSuggestions } from './types.chat-suggestions';

const allowedProps = ['autoSubmit', 'suggestions'];

export default function Page() {
  return (
    <TypesPageShell name="ChatSuggestions" allowedProps={allowedProps}>
      <TypesChatSuggestions />
    </TypesPageShell>
  );
}
