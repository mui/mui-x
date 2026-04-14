import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridFilterModel } from './types.grid-filter-model';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridFilterModel" allowedProps={allowedProps}>
      <TypesGridFilterModel />
    </TypesPageShell>
  );
}
