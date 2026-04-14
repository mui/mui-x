import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridListViewColDef } from './types.grid-list-view-col-def';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridListViewColDef" allowedProps={allowedProps}>
      <TypesGridListViewColDef />
    </TypesPageShell>
  );
}
