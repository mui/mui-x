import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesTreeItem } from './types.tree-item';

const allowedProps = ['children', 'classes', 'disableSelection', 'disabled', 'id', 'itemId', 'label', 'onBlur', 'onFocus', 'onKeyDown', 'slotProps', 'slots', 'sx'];

export default function Page() {
  return (
    <TypesPageShell name="TreeItem" allowedProps={allowedProps}>
      <TypesTreeItem />
    </TypesPageShell>
  );
}
