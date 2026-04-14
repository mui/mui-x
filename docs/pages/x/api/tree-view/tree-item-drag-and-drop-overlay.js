import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesTreeItemDragAndDropOverlay } from './types.tree-item-drag-and-drop-overlay';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="TreeItemDragAndDropOverlay" allowedProps={allowedProps}>
      <TypesTreeItemDragAndDropOverlay />
    </TypesPageShell>
  );
}
