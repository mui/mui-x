import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from './products';

export default function ApiMethodAddItems() {
  const apiRef = useRichTreeViewApiRef<(typeof MUI_X_PRODUCTS)[number]>();
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const nextIdRef = React.useRef(1);

  const addItem = (parentId: string | null) => {
    const id = `new-item-${nextIdRef.current}`;
    nextIdRef.current += 1;

    apiRef.current!.addItems({
      items: [{ id, label: 'New item', editable: true }],
      parentId,
    });

    if (parentId != null) {
      apiRef.current!.setItemExpansion({ itemId: parentId, shouldBeExpanded: true });
    }

    // Let the user name the new item right away
    apiRef.current!.setEditedItem(id);
  };

  return (
    <Stack spacing={2}>
      <Stack spacing={2} direction="row">
        <Button onClick={() => addItem(null)}>Add root item</Button>
        <Button
          onClick={() => addItem(selectedItem)}
          disabled={selectedItem == null}
        >
          Add child to selected item
        </Button>
      </Stack>
      <Box sx={{ minHeight: 352, minWidth: 260 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          apiRef={apiRef}
          isItemEditable={(item) => Boolean(item.editable)}
          selectedItems={selectedItem}
          onSelectedItemsChange={(event, itemId) => setSelectedItem(itemId)}
        />
      </Box>
    </Stack>
  );
}
