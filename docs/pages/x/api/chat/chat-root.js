import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatRoot } from './types.chat-root';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatRoot" allowedProps={allowedProps}>
      <TypesChatRoot />
    </TypesPageShell>
  );
}
