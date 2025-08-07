---
productId: x-tree-view
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Selection

Handle how users can select items.

## Single selection

By default, the Tree View allows selecting a single item.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function SingleSelectTreeView() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} />
    </Box>
  );
}

```

:::success
When the Tree View uses single selection, you can select an item by clicking it,
or using the [keyboard shortcuts](/x/react-tree-view/accessibility/#on-single-select-trees).
:::

## Multi selection

Use the `multiSelect` prop to enable multi-selection.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function MultiSelectTreeView() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView multiSelect items={MUI_X_PRODUCTS} />
    </Box>
  );
}

```

:::success
When the Tree View uses multi selection, you can select multiple items using the mouse in two ways:

- To select multiple independent items, hold <kbd class="key">Ctrl</kbd> (or <kbd class="key">⌘ Command</kbd> on macOS) and click the items.
- To select a range of items, click on the first item of the range, then hold the <kbd class="key">Shift</kbd> key while clicking on the last item of the range.

You can also use the [keyboard shortcuts](/x/react-tree-view/accessibility/#on-multi-select-trees) to select items.
:::

## Disable selection

Use the `disableSelection` prop if you don't want your items to be selectable:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function DisableSelection() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView disableSelection items={MUI_X_PRODUCTS} />
    </Box>
  );
}

```

## Checkbox selection

To activate checkbox selection set `checkboxSelection={true}`:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function CheckboxSelection() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 290 }}>
      <RichTreeView checkboxSelection items={MUI_X_PRODUCTS} />
    </Box>
  );
}

```

This is also compatible with multi selection:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function CheckboxMultiSelection() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 290 }}>
      <RichTreeView multiSelect checkboxSelection items={MUI_X_PRODUCTS} />
    </Box>
  );
}

```

## Controlled selection

Use the `selectedItems` prop to control the selected items.

You can use the `onSelectedItemsChange` prop to listen to changes in the selected items and update the prop accordingly.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

const getAllItemItemIds = () => {
  const ids: TreeViewItemId[] = [];
  const registerItemId = (item: TreeViewBaseItem) => {
    ids.push(item.id);
    item.children?.forEach(registerItemId);
  };

  MUI_X_PRODUCTS.forEach(registerItemId);

  return ids;
};

export default function ControlledSelection() {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const handleSelectedItemsChange = (
    event: React.SyntheticEvent | null,
    ids: string[],
  ) => {
    setSelectedItems(ids);
  };

  const handleSelectClick = () => {
    setSelectedItems((oldSelected) =>
      oldSelected.length === 0 ? getAllItemItemIds() : [],
    );
  };

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleSelectClick}>
          {selectedItems.length === 0 ? 'Select all' : 'Unselect all'}
        </Button>
      </div>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          selectedItems={selectedItems}
          onSelectedItemsChange={handleSelectedItemsChange}
          multiSelect
        />
      </Box>
    </Stack>
  );
}

```

:::info

- The selection is **controlled** when its parent manages it by providing a `selectedItems` prop.
- The selection is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultSelectedItems` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Track item selection change

Use the `onItemSelectionToggle` prop if you want to react to an item selection change:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function TrackItemSelectionToggle() {
  const [lastSelectedItem, setLastSelectedItem] = React.useState<string | null>(
    null,
  );

  const handleItemSelectionToggle = (
    event: React.SyntheticEvent | null,
    itemId: string,
    isSelected: boolean,
  ) => {
    if (isSelected) {
      setLastSelectedItem(itemId);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography>
        {lastSelectedItem == null
          ? 'No item selection recorded'
          : `Last selected item: ${lastSelectedItem}`}
      </Typography>
      <Box sx={{ minHeight: 352, minWidth: 300 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          onItemSelectionToggle={handleItemSelectionToggle}
        />
      </Box>
    </Stack>
  );
}

```

## Automatic parents and children selection

By default, selecting a parent item does not select its children. You can override this behavior using the `selectionPropagation` prop.

Here's how it's structured:

```ts
type TreeViewSelectionPropagation = {
  descendants?: boolean; // default: false
  parents?: boolean; // default: false
};
```

When `selectionPropagation.descendants` is set to `true`:

- Selecting a parent selects all its descendants automatically.
- Deselecting a parent deselects all its descendants automatically.

When `selectionPropagation.parents` is set to `true`:

- Selecting all the descendants of a parent selects the parent automatically.
- Deselecting a descendant of a selected parent deselects the parent automatically.

The example below demonstrates the usage of the `selectionPropagation` prop.

```tsx
import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewSelectionPropagation } from '@mui/x-tree-view/models';
import { EMPLOYEES_DATASET } from '../../datasets/employees';

export default function SelectionPropagation() {
  const [selectionPropagation, setSelectionPropagation] =
    React.useState<TreeViewSelectionPropagation>({
      parents: true,
      descendants: true,
    });

  return (
    <div style={{ width: '100%' }}>
      <Stack direction="row" spacing={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectionPropagation.descendants}
              onChange={(event) =>
                setSelectionPropagation((prev) => ({
                  ...prev,
                  descendants: event.target.checked,
                }))
              }
            />
          }
          label="Auto select descendants"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectionPropagation.parents}
              onChange={(event) =>
                setSelectionPropagation((prev) => ({
                  ...prev,
                  parents: event.target.checked,
                }))
              }
            />
          }
          label="Auto select parents"
        />
      </Stack>
      <Box sx={{ height: 256, minWidth: 250, overflowY: 'auto' }}>
        <RichTreeView
          items={EMPLOYEES_DATASET}
          checkboxSelection
          multiSelect
          selectionPropagation={selectionPropagation}
          defaultExpandedItems={['8', '12']}
        />
      </Box>
    </div>
  );
}

```

:::warning
This feature only works when multi selection is enabled using `props.multiSelect`.
:::

## Imperative API

:::success
To use the `apiRef` object, you need to initialize it using the `useTreeViewApiRef` hook as follows:

```tsx
const apiRef = useTreeViewApiRef();

return <RichTreeView apiRef={apiRef} items={ITEMS}>;
```

When your component first renders, `apiRef` is `undefined`.
After this initial render, `apiRef` holds methods to interact imperatively with the Tree View.
:::

### Select or deselect an item

Use the `setItemSelection()` API method to select or deselect an item:

```ts
apiRef.current.setItemSelection({
  // The DOM event that triggered the change
  event,
  // The id of the item to select or deselect
  itemId,
  // If `true`, the other already selected items will remain selected
  // Otherwise, they will be deselected
  // This parameter is only relevant when `multiSelect` is `true`
  keepExistingSelection,
  // If `true` the item will be selected
  // If `false` the item will be deselected
  // If not defined, the item's selection status will toggled
  shouldBeSelected,
});
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function ApiMethodSetItemSelection() {
  const apiRef = useTreeViewApiRef();
  const handleSelectGridPro = (event: React.SyntheticEvent) => {
    apiRef.current?.setItemSelection({ event, itemId: 'grid-pro' });
  };

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleSelectGridPro}>Select grid pro item</Button>
      </div>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          apiRef={apiRef}
          defaultExpandedItems={['grid']}
        />
      </Box>
    </Stack>
  );
}

```

You can use the `keepExistingSelection` property to avoid losing the already selected items when using `multiSelect`:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function ApiMethodSetItemSelectionKeepExistingSelection() {
  const apiRef = useTreeViewApiRef();
  const handleSelectGridPro = (event: React.SyntheticEvent) => {
    apiRef.current?.setItemSelection({
      event,
      itemId: 'grid-pro',
      keepExistingSelection: true,
    });
  };

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleSelectGridPro}>Select grid pro item</Button>
      </div>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          apiRef={apiRef}
          defaultExpandedItems={['grid']}
          multiSelect
          defaultSelectedItems={['grid-premium']}
        />
      </Box>
    </Stack>
  );
}

```
