import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { TreeViewDefaultItemModelProperties } from '@mui/x-tree-view/models';

const INITIAL_ITEMS: TreeViewDefaultItemModelProperties[] = Array.from(
  { length: 5 },
  (_1, i) => ({
    id: `item-${i + 1}`,
    label: `Item ${i + 1}`,
  }),
);

export default function FixedSizeRichTreeView() {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 350, width: '100%' }}>
        <RichTreeViewPro items={INITIAL_ITEMS} />
      </div>
    </div>
  );
}
