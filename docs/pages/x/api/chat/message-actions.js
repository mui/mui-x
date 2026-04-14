import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMessageActions } from './types.message-actions';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="MessageActions" allowedProps={allowedProps}>
      <TypesMessageActions />
    </TypesPageShell>
  );
}
