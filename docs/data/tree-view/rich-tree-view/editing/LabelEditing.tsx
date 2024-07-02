import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

type ExtendedTreeItemProps = {
  editable?: boolean;
  id: string;
  label: string;
};

const MUI_X_PRODUCTS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    editable: true,
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid', editable: true },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro', editable: true },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium', editable: true },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and time pickers',
    editable: true,
    children: [
      {
        id: 'pickers-community',
        label: '@mui/x-date-pickers',
        editable: true,
      },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro', editable: true },
    ],
  },
];

export default function LabelEditing() {
  return (
    <Box sx={{ minHeight: 200, flexGrow: 1, maxWidth: 400 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        slots={{ item: TreeItem2 }}
        isItemEditable={(item) => Boolean(item?.editable)}
        defaultExpandedItems={['grid', 'pickers']}
        checkboxSelection
        expansionTrigger="iconContainer"
      />
    </Box>
  );
}
