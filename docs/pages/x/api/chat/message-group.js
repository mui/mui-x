import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMessageGroup } from './types.message-group';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="MessageGroup" allowedProps={allowedProps}>
      <TypesMessageGroup />
    </TypesPageShell>
  );
}
