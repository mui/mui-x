import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMessageRoot } from './types.message-root';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="MessageRoot" allowedProps={allowedProps}>
      <TypesMessageRoot />
    </TypesPageShell>
  );
}
