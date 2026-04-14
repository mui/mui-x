import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridFilterOperator } from './types.grid-filter-operator';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridFilterOperator" allowedProps={allowedProps}>
      <TypesGridFilterOperator />
    </TypesPageShell>
  );
}
