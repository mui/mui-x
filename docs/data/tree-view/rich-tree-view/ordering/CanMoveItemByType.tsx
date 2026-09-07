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
        // Only allow drops where the new parent is a folder.
        // `newPosition.parentId` is `null` when the item is dropped at the root.
        canMoveItemToNewPosition={(params) =>
          params.newPosition.parentId !== null &&
          apiRef.current!.getItem(params.newPosition.parentId).fileType === 'folder'
        }
      />
    </Box>
  );
}
