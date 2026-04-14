import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMessageContent } from './types.message-content';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="MessageContent" allowedProps={allowedProps}>
      <TypesMessageContent />
    </TypesPageShell>
  );
}
