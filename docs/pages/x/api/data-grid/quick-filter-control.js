import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesQuickFilterControl } from './types.quick-filter-control';

const allowedProps = ['className', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="QuickFilterControl" allowedProps={allowedProps}>
      <TypesQuickFilterControl />
    </TypesPageShell>
  );
}
