import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridColDef } from './types.grid-col-def';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridColDef" allowedProps={allowedProps}>
      <TypesGridColDef />
    </TypesPageShell>
  );
}
