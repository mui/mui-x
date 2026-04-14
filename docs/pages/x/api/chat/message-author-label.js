import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMessageAuthorLabel } from './types.message-author-label';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="MessageAuthorLabel" allowedProps={allowedProps}>
      <TypesMessageAuthorLabel />
    </TypesPageShell>
  );
}
