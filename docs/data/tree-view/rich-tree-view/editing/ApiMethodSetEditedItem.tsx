import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';

export default function ApiMethodSetEditedItem() {
  const [items, setItems] = React.useState([
    { id: '1', label: 'Jane Doe', editable: true },
  ]);
  const apiRef = useRichTreeViewApiRef();

  const handleAddFolder = () => {
    const newId = String(items.length + 1);
    const newItem = { id: newId, label: '', editable: true };

    setItems((prev) => [...prev, newItem]);

    requestAnimationFrame(() => {
      apiRef.current!.setEditedItem(newId);
    });
  };

  const handleItemLabelChange = (itemId: string, newLabel: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, label: newLabel } : item,
      ),
    );
  };

  return (
    <Stack spacing={2}>
      <Stack spacing={2} direction="row">
        <Button onClick={handleAddFolder}>+ Add Folder</Button>
      </Stack>
      <Box sx={{ minHeight: 352, minWidth: 260 }}>
        <RichTreeView
          items={items}
          apiRef={apiRef}
          isItemEditable={(item) => item.editable}
          onItemLabelChange={handleItemLabelChange}
        />
      </Box>
    </Stack>
  );
}
