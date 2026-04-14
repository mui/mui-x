import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridCellParams } from './types.grid-cell-params';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridCellParams" allowedProps={allowedProps}>
      <TypesGridCellParams />
    </TypesPageShell>
  );
}
