import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridToolbarQuickFilter } from './types.grid-toolbar-quick-filter';

const allowedProps = ['debounceMs', 'quickFilterFormatter', 'quickFilterParser'];

export default function Page() {
  return (
    <TypesPageShell name="GridToolbarQuickFilter" allowedProps={allowedProps}>
      <TypesGridToolbarQuickFilter />
    </TypesPageShell>
  );
}
