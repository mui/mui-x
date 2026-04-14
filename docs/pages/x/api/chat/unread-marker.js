import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesUnreadMarker } from './types.unread-marker';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="UnreadMarker" allowedProps={allowedProps}>
      <TypesUnreadMarker />
    </TypesPageShell>
  );
}
