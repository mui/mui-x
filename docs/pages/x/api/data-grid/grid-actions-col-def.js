import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridActionsColDef } from './types.grid-actions-col-def';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridActionsColDef" allowedProps={allowedProps}>
      <TypesGridActionsColDef />
    </TypesPageShell>
  );
}
