import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

type ExtendedTreeItemProps = {
  editable?: boolean;
  id: string;
  label: string;
};

const MUI_X_PRODUCTS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'I am editable',
    editable: true,
    children: [
      {
        id: 'pickers-community',
        label: 'also editable',
        editable: true,
      },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
];

export default function EditLeaves() {
  const apiRef = useTreeViewApiRef();
  return (
    <Box sx={{ minHeight: 200, flexGrow: 1, maxWidth: 400 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        slots={{ item: TreeItem2 }}
        apiRef={apiRef}
        isItemEditable={(item) =>
          apiRef.current!.getItemOrderedChildrenIds(item.id).length === 0
        }
        defaultExpandedItems={['grid', 'pickers']}
        expansionTrigger="iconContainer"
      />
    </Box>
  );
}
