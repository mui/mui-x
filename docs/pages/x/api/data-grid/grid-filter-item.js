import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridFilterItem } from './types.grid-filter-item';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridFilterItem" allowedProps={allowedProps}>
      <TypesGridFilterItem />
    </TypesPageShell>
  );
}
