import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridApi } from './types.grid-api';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridApi" allowedProps={allowedProps}>
      <TypesGridApi />
    </TypesPageShell>
  );
}
