import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridSingleSelectColDef } from './types.grid-single-select-col-def';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridSingleSelectColDef" allowedProps={allowedProps}>
      <TypesGridSingleSelectColDef />
    </TypesPageShell>
  );
}
