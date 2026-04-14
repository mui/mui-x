import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesTreeItemProvider } from './types.tree-item-provider';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="TreeItemProvider" allowedProps={allowedProps}>
      <TypesTreeItemProvider />
    </TypesPageShell>
  );
}
