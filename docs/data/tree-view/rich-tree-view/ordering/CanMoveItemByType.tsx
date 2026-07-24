import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { useRichTreeViewProApiRef } from '@mui/x-tree-view-pro/hooks';

type Item = {
  id: string;
  label: string;
  fileType: 'folder' | 'file';
  children?: Item[];
};

const ITEMS: Item[] = [
  {
    id: 'documents',
    label: 'Documents',
    fileType: 'folder',
    children: [
      { id: 'cv', label: 'cv.pdf', fileType: 'file' },
      { id: 'cover-letter', label: 'cover-letter.pdf', fileType: 'file' },
    ],
  },
  { id: 'notes', label: 'notes.txt', fileType: 'file' },
];

export default function CanMoveItemByType() {
  const apiRef = useRichTreeViewProApiRef<Item>();

  return (
    <Box sx={{ minHeight: 270, minWidth: 300 }}>
      <RichTreeViewPro
        apiRef={apiRef}
        items={ITEMS}
        itemsReordering
        defaultExpandedItems={['documents']}
        // `newPosition.parentId` is enough to know whether the drop would nest
        // the item inside another one (`make-child`) or just reorder it among
        // its siblings, so there's no need to read the drag overlay's `action`.
        canMoveItemToNewPosition={(params) =>
          params.newPosition.parentId === null ||
          apiRef.current!.getItem(params.newPosition.parentId).fileType === 'folder'
        }
      />
    </Box>
  );
}
