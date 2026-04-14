import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMessageMeta } from './types.message-meta';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="MessageMeta" allowedProps={allowedProps}>
      <TypesMessageMeta />
    </TypesPageShell>
  );
}
