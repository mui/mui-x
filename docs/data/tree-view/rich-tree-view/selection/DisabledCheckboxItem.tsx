import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

type Item = {
  id: string;
  label: string;
  disabled?: boolean;
  children?: Item[];
};

const MUI_X_PRODUCTS: Item[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium', disabled: true },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
];

const isItemDisabled = (item: Item) => !!item.disabled;

export default function DisabledCheckboxItem() {
  return (
    <Box sx={{ minHeight: 270, minWidth: 290 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        defaultExpandedItems={['grid']}
        checkboxSelection
        isItemDisabled={isItemDisabled}
      />
    </Box>
  );
}
