import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesTreeItemIcon } from './types.tree-item-icon';

const allowedProps = ['slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="TreeItemIcon" allowedProps={allowedProps}>
      <TypesTreeItemIcon />
    </TypesPageShell>
  );
}
