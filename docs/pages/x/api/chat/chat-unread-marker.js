import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatUnreadMarker } from './types.chat-unread-marker';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatUnreadMarker" allowedProps={allowedProps}>
      <TypesChatUnreadMarker />
    </TypesPageShell>
  );
}
