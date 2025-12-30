import Box from '@mui/material/Box';

import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';

const items = Array.from({ length: 100 }, (_, index) => ({
  id: `product-${index + 1}`,
  label: `Product ${index + 1}`,
  children: Array.from({ length: 5 }, (_2, childIndex) => ({
    id: `product-${index + 1}-feature-${childIndex + 1}`,
    label: `Feature ${childIndex + 1} of Product ${index + 1}`,
  })),
}));

const defaultExpandedItems = items.map((el) => el.id);

export default function BasicVirtualizedRichTreeViewPro() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeViewPro
        items={items}
        defaultExpandedItems={defaultExpandedItems}
        virtualization
      />
    </Box>
  );
}
