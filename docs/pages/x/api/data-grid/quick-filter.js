import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesQuickFilter } from './types.quick-filter';

const allowedProps = ['className', 'debounceMs', 'defaultExpanded', 'expanded', 'formatter', 'onExpandedChange', 'parser', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="QuickFilter" allowedProps={allowedProps}>
      <TypesQuickFilter />
    </TypesPageShell>
  );
}
