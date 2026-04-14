import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesQuickFilterTrigger } from './types.quick-filter-trigger';

const allowedProps = ['className', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="QuickFilterTrigger" allowedProps={allowedProps}>
      <TypesQuickFilterTrigger />
    </TypesPageShell>
  );
}
