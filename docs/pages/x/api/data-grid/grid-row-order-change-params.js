import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridRowOrderChangeParams } from './types.grid-row-order-change-params';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridRowOrderChangeParams" allowedProps={allowedProps}>
      <TypesGridRowOrderChangeParams />
    </TypesPageShell>
  );
}
