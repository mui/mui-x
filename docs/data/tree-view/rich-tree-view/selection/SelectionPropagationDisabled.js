import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const ITEMS = [
  {
    id: 'beverages',
    label: 'Beverages',
    children: [
      { id: 'coffee', label: 'Coffee' },
      { id: 'tea', label: 'Tea' },
      { id: 'juice', label: 'Juice (out of stock)' },
    ],
  },
  {
    id: 'snacks',
    label: 'Snacks',
    children: [
      { id: 'chips', label: 'Chips (out of stock)' },
      { id: 'nuts', label: 'Nuts (out of stock)' },
      { id: 'popcorn', label: 'Popcorn' },
    ],
  },
  {
    id: 'meals',
    label: 'Meals',
    children: [
      { id: 'pasta', label: 'Pasta' },
      { id: 'salad', label: 'Salad' },
    ],
  },
];

export default function SelectionPropagationDisabled() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 290 }}>
      <RichTreeView
        items={ITEMS}
        checkboxSelection
        multiSelect
        defaultExpandedItems={['beverages', 'snacks', 'meals']}
        selectionPropagation={{ parents: true, descendants: true }}
        isItemDisabled={(item) => item.label.includes('(out of stock)')}
      />
    </Box>
  );
}
