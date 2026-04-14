import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesToolbar } from './types.toolbar';

const allowedProps = ['render'];

export default function Page() {
  return (
    <TypesPageShell name="Toolbar" allowedProps={allowedProps}>
      <TypesToolbar />
    </TypesPageShell>
  );
}
