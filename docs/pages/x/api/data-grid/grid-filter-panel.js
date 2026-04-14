import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridFilterPanel } from './types.grid-filter-panel';

const allowedProps = ['columnsSort', 'disableAddFilterButton', 'disableRemoveAllButton', 'filterFormProps', 'getColumnForNewFilter', 'logicOperators', 'sx'];

export default function Page() {
  return (
    <TypesPageShell name="GridFilterPanel" allowedProps={allowedProps}>
      <TypesGridFilterPanel />
    </TypesPageShell>
  );
}
