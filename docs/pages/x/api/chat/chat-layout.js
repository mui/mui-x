import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatLayout } from './types.chat-layout';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatLayout" allowedProps={allowedProps}>
      <TypesChatLayout />
    </TypesPageShell>
  );
}
