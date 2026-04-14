import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatMessageAuthorLabel } from './types.chat-message-author-label';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatMessageAuthorLabel" allowedProps={allowedProps}>
      <TypesChatMessageAuthorLabel />
    </TypesPageShell>
  );
}
