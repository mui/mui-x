import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridFilterForm } from './types.grid-filter-form';

const allowedProps = ['applyFilterChanges', 'applyMultiFilterOperatorChanges', 'columnInputProps', 'columnsSort', 'deleteFilter', 'deleteIconProps', 'disableMultiFilterOperator', 'filterColumns', 'focusElementRef', 'hasMultipleFilters', 'item', 'logicOperatorInputProps', 'logicOperators', 'operatorInputProps', 'readOnly', 'showMultiFilterOperators', 'valueInputProps'];

export default function Page() {
  return (
    <TypesPageShell name="GridFilterForm" allowedProps={allowedProps}>
      <TypesGridFilterForm />
    </TypesPageShell>
  );
}
