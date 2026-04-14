import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMessageAvatar } from './types.message-avatar';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="MessageAvatar" allowedProps={allowedProps}>
      <TypesMessageAvatar />
    </TypesPageShell>
  );
}
