import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesQuickFilterClear } from './types.quick-filter-clear';

const allowedProps = ['className', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="QuickFilterClear" allowedProps={allowedProps}>
      <TypesQuickFilterClear />
    </TypesPageShell>
  );
}
