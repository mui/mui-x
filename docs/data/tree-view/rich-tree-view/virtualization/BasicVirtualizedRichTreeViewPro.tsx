import Box from '@mui/material/Box';
import { TreeViewDefaultItemModelProperties } from '@mui/x-tree-view/models';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';

const items: TreeViewDefaultItemModelProperties[] = Array.from(
  { length: 100 },
  (_1, i) => ({
    id: `item-${i + 1}`,
    label: `Item ${i + 1}`,
    children: Array.from({ length: 100 }, (_2, j) => ({
      id: `item-${i + 1}-${j + 1}`,
      label: `Item ${i + 1}-${j + 1}`,
      children: Array.from({ length: 10 }, (_3, k) => ({
        id: `item-${i + 1}-${j + 1}-${k + 1}`,
        label: `Item ${i + 1}-${j + 1}-${k + 1}`,
      })),
    })),
  }),
);

const defaultExpandedItems = items.flatMap((el) => [
  el.id,
  ...(el.children ?? []).map((child) => child.id),
]);

export default function BasicVirtualizedRichTreeViewPro() {
  return (
    <Box sx={{ height: 352, minWidth: 250 }}>
      <RichTreeViewPro
        items={items}
        defaultExpandedItems={defaultExpandedItems}
        virtualization
      />
    </Box>
  );
}
