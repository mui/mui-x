---
productId: x-tree-view
title: Simple Tree View - Focus
components: SimpleTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Simple Tree View - Focus

Learn how to focus Tree View items.

## Imperative API

:::success
To use the `apiRef` object, you need to initialize it using the `useTreeViewApiRef` hook as follows:

```tsx
const apiRef = useTreeViewApiRef();

return <SimpleTreeView apiRef={apiRef}>{children}</SimpleTreeView>;
```

When your component first renders, `apiRef` will be `undefined`.
After this initial render, `apiRef` holds methods to interact imperatively with the Tree View.
:::

### Focus a specific item

Use the `focusItem` API method to focus a specific item.

```ts
apiRef.current.focusItem(
  // The DOM event that triggered the change
  event,
  // The id of the item to focus
  itemId,
);
```

:::info
This method only works with items that are currently visible.
Calling `apiRef.focusItem()` on an item whose parent is collapsed does nothing.
:::

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

export default function ApiMethodFocusItem() {
  const apiRef = useTreeViewApiRef();
  const handleButtonClick = (event: React.SyntheticEvent) => {
    apiRef.current?.focusItem(event, 'pickers');
  };

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleButtonClick}>Focus pickers item</Button>
      </div>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <SimpleTreeView apiRef={apiRef}>
          <TreeItem itemId="grid" label="Data Grid">
            <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
            <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
            <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
          </TreeItem>
          <TreeItem itemId="pickers" label="Date and Time Pickers">
            <TreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
            <TreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
          </TreeItem>
          <TreeItem itemId="charts" label="Charts">
            <TreeItem itemId="charts-community" label="@mui/x-charts" />
          </TreeItem>
          <TreeItem itemId="tree-view" label="Tree View">
            <TreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
          </TreeItem>
        </SimpleTreeView>
      </Box>
    </Stack>
  );
}

```
