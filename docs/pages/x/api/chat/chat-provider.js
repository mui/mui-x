import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatProvider } from './types.chat-provider';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatProvider" allowedProps={allowedProps}>
      <TypesChatProvider />
    </TypesPageShell>
  );
}
