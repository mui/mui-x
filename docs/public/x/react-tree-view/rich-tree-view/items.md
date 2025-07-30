---
productId: x-tree-view
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Items

Pass data to your Tree View.

## Basic usage

The items can be defined with the `items` prop, which expects an array of objects.

:::warning
The `items` prop should keep the same reference between two renders except if you want to apply new items.
Otherwise, the Tree View will re-generate its entire structure.
:::

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

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

export default function BasicRichTreeView() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} />
    </Box>
  );
}

```

## Item identifier

Each item must have a unique identifier.

This identifier is used internally to identify the item in the various models and to track the item across updates.

By default, the Rich Tree View component looks for a property named `id` in the data set to get that identifier:

```tsx
const ITEMS = [{ id: 'tree-view-community' }];

<RichTreeView items={ITEMS} />;
```

If the item's identifier is not called `id`, then you need to use the `getItemId` prop to tell the Rich Tree View component where it is located.

The following demo shows how to use `getItemId` to grab the unique identifier from a property named `internalId`:

```tsx
const ITEMS = [{ internalId: 'tree-view-community' }];

function getItemId(item) {
  return item.internalId;
}

<RichTreeView items={ITEMS} getItemId={getItemId} />;
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

type MuiXProduct = TreeViewBaseItem<{
  internalId: string;
  label: string;
}>;

const MUI_X_PRODUCTS: MuiXProduct[] = [
  {
    internalId: 'grid',
    label: 'Data Grid',
    children: [
      { internalId: 'grid-community', label: '@mui/x-data-grid' },
      { internalId: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { internalId: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    internalId: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { internalId: 'pickers-community', label: '@mui/x-date-pickers' },
      { internalId: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    internalId: 'charts',
    label: 'Charts',
    children: [{ internalId: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    internalId: 'tree-view',
    label: 'Tree View',
    children: [{ internalId: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

const getItemId = (item: MuiXProduct) => item.internalId;

export default function GetItemId() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} getItemId={getItemId} />
    </Box>
  );
}

```

:::warning
Just like the `items` prop, the `getItemId` function should keep the same JavaScript reference between two renders.
Otherwise, the Tree View will re-generate its entire structure.

It could be achieved by either defining the prop outside the component scope or by memoizing using the `React.useCallback` hook if the function reuses something from the component scope.
:::

## Item label

Each item must have a label which does not need to be unique.

By default, the Rich Tree View component looks for a property named `label` in the data set to get that label:

```tsx
const ITEMS = [{ label: '@mui/x-tree-view' }];

<RichTreeView items={ITEMS} />;
```

If the item's label is not called `label`, then you need to use the `getItemLabel` prop to tell the Rich Tree View component where it's located:

The following demo shows how to use `getItemLabel` to grab the unique identifier from a property named `name`:

```tsx
const ITEMS = [{ name: '@mui/x-tree-view' }];

function getItemLabel(item) {
  return item.name;
}

<RichTreeView items={ITEMS} getItemLabel={getItemLabel} />;
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

type MuiXProduct = TreeViewBaseItem<{
  id: string;
  name: string;
}>;

const MUI_X_PRODUCTS: MuiXProduct[] = [
  {
    id: 'grid',
    name: 'Data Grid',
    children: [
      { id: 'grid-community', name: '@mui/x-data-grid' },
      { id: 'grid-pro', name: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', name: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    name: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', name: '@mui/x-date-pickers' },
      { id: 'pickers-pro', name: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    name: 'Charts',
    children: [{ id: 'charts-community', name: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    name: 'Tree View',
    children: [{ id: 'tree-view-community', name: '@mui/x-tree-view' }],
  },
];

const getItemLabel = (item: MuiXProduct) => item.name;

export default function GetItemLabel() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} getItemLabel={getItemLabel} />
    </Box>
  );
}

```

:::warning
Just like the `items` prop, the `getItemLabel` function should keep the same JavaScript reference between two renders.
Otherwise, the Tree View will re-generate its entire structure.

It could be achieved by either defining the prop outside the component scope or by memoizing using the `React.useCallback` hook if the function reuses something from the component scope.
:::

:::warning
Unlike the Simple Tree View component, the Rich Tree View component only supports string labels, you cannot pass React nodes to it.
:::

## Item children

Each item can contain children, which are rendered as nested nodes in the tree.

By default, the Rich Tree View component looks for a property named `children` in the data set to get the children:

```tsx
const ITEMS = [
  { children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }] },
];

<RichTreeView items={ITEMS} />;
```

If the item's children are not called `children`, then you need to use the `getItemChildren` prop to tell the Rich Tree View component where they're located:

The following demo shows how to use `getItemChildren` to grab the children from a property named `nodes`:

```tsx
const ITEMS = [
  { nodes: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }] },
];

function getItemChildren(item) {
  return item.nodes;
}

<RichTreeView items={ITEMS} getItemChildren={getItemChildren} />;
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

type MuiXProduct = TreeViewBaseItem<{
  id: string;
  label: string;
  nodes?: TreeViewBaseItem[];
}>;

const MUI_X_PRODUCTS: MuiXProduct[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    nodes: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    nodes: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    nodes: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    nodes: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

const getItemChildren = (item: MuiXProduct) => item.nodes;

export default function GetItemChildren() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} getItemChildren={getItemChildren} />
    </Box>
  );
}

```

:::warning
Just like the `items` prop, the `getItemChildren` function should keep the same JavaScript reference between two renders.
Otherwise, the Tree View will re-generate its entire structure.

It could be achieved by either defining the prop outside the component scope or by memoizing using the `React.useCallback` hook if the function reuses something from the component scope.
:::

## Disabled items

Use the `isItemDisabled` prop on the Rich Tree View to disable interaction and focus on a Tree Item:

```tsx
function isItemDisabled(item) {
  return item.disabled ?? false;
}

<RichTreeView isItemDisabled={isItemDisabled} />;
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

type MuiXProduct = TreeViewBaseItem<{
  id: string;
  label: string;
  disabled?: boolean;
}>;

const MUI_X_PRODUCTS: MuiXProduct[] = [
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
    children: [{ id: 'charts-community', label: '@mui/x-charts', disabled: true }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    disabled: true,
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

const isItemDisabled = (item: MuiXProduct) => !!item.disabled;

export default function DisabledPropItem() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} isItemDisabled={isItemDisabled} />
    </Box>
  );
}

```

:::warning
Just like the `items` prop, the `isItemDisabled` function should keep the same JavaScript reference between two renders.
Otherwise, the Tree View will re-generate its entire structure.

This can be achieved by either defining the prop outside the component scope or by memoizing using the `React.useCallback` hook if the function reuses something from the component scope.
:::

### Focus disabled items

Use the `disabledItemsFocusable` prop to control if disabled Tree Items can be focused.

When this prop is set to false:

- Navigating with keyboard arrow keys will not focus the disabled items, and the next non-disabled item will be focused instead.
- Typing the first character of a disabled item's label will not move the focus to it.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- <kbd class="key">Shift</kbd> + arrow keys will skip disabled items, and the next non-disabled item will be selected instead.
- Programmatic focus will not focus disabled items.

When it's set to true:

- Navigating with keyboard arrow keys will focus disabled items.
- Typing the first character of a disabled item's label will move focus to it.
- Mouse or keyboard interaction will not expand/collapse disabled items.
- Mouse or keyboard interaction will not select disabled items.
- <kbd class="key">Shift</kbd> + arrow keys will not skip disabled items, but the disabled item will not be selected.
- Programmatic focus will focus disabled items.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

type MuiXProduct = TreeViewBaseItem<{
  id: string;
  label: string;
  disabled?: boolean;
}>;

const MUI_X_PRODUCTS: MuiXProduct[] = [
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
    children: [{ id: 'charts-community', label: '@mui/x-charts', disabled: true }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    disabled: true,
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

const isItemDisabled = (item: MuiXProduct) => !!item.disabled;

export default function DisabledItemsFocusable() {
  const [disabledItemsFocusable, setDisabledItemsFocusable] = React.useState(false);
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisabledItemsFocusable(event.target.checked);
  };

  return (
    <Stack spacing={2}>
      <FormControlLabel
        control={
          <Switch
            checked={disabledItemsFocusable}
            onChange={handleToggle}
            name="disabledItemsFocusable"
          />
        }
        label="Allow focusing disabled items"
      />
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          isItemDisabled={isItemDisabled}
          disabledItemsFocusable={disabledItemsFocusable}
        />
      </Box>
    </Stack>
  );
}

```

## Track item clicks

Use the `onItemClick` prop to track the clicked item:

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

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

export default function OnItemClick() {
  const [lastClickedItem, setLastClickedItem] = React.useState<string | null>(null);

  return (
    <Stack spacing={2}>
      <Typography>
        {lastClickedItem == null
          ? 'No item click recorded'
          : `Last clicked item: ${lastClickedItem}`}
      </Typography>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          onItemClick={(event, itemId) => setLastClickedItem(itemId)}
        />
      </Box>
    </Stack>
  );
}

```

## Imperative API

:::success
To use the `apiRef` object, you need to initialize it using the `useTreeViewApiRef` hook as follows:

```tsx
const apiRef = useTreeViewApiRef();

return <RichTreeView apiRef={apiRef} items={ITEMS}>;
```

When your component first renders, `apiRef` will be `undefined`.
After this initial render, `apiRef` holds methods to interact imperatively with the Tree View.
:::

### Get an item by ID

Use the `getItem` API method to get an item by its ID.

```ts
const item = apiRef.current.getItem(
  // The id of the item to retrieve
  itemId,
);
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
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

export default function ApiMethodGetItem() {
  const apiRef = useTreeViewApiRef();
  const [selectedItem, setSelectedItem] = React.useState<TreeViewBaseItem | null>(
    null,
  );

  const handleSelectedItemsChange = (
    event: React.SyntheticEvent | null,
    itemId: string | null,
  ) => {
    if (itemId == null) {
      setSelectedItem(null);
    } else {
      setSelectedItem(apiRef.current!.getItem(itemId));
    }
  };

  return (
    <Stack spacing={2}>
      <Typography sx={{ minWidth: 300 }}>
        Selected item: {selectedItem == null ? 'none' : selectedItem.label}
      </Typography>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          apiRef={apiRef}
          selectedItems={selectedItem?.id ?? null}
          onSelectedItemsChange={handleSelectedItemsChange}
        />
      </Box>
    </Stack>
  );
}

```

### Get an item's DOM element by ID

Use the `getItemDOMElement()` API method to get an item's DOM element by its ID.

```ts
const itemElement = apiRef.current.getItemDOMElement(
  // The id of the item to get the DOM element of
  itemId,
);
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
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

export default function ApiMethodGetItemDOMElement() {
  const apiRef = useTreeViewApiRef();
  const handleScrollToChartsCommunity = (event: React.SyntheticEvent) => {
    apiRef.current!.focusItem(event, 'charts-community');
    apiRef
      .current!.getItemDOMElement('charts-community')
      ?.scrollIntoView({ block: 'nearest' });
  };

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleScrollToChartsCommunity}>
          Focus and scroll to charts community item
        </Button>
      </div>
      <Box sx={{ height: 200, minWidth: 250, overflowY: 'scroll' }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          apiRef={apiRef}
          defaultExpandedItems={['grid', 'pickers', 'charts', 'tree-view']}
        />
      </Box>
    </Stack>
  );
}

```

### Get the current item tree

Use the `getItemTree` API method to get the current item tree.

```ts
const itemTree = apiRef.current.getItemTree();
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
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

export default function ApiMethodGetItemTree() {
  const apiRef = useTreeViewApiRef();

  const [items, setItems] = React.useState(MUI_X_PRODUCTS);
  const [itemOnTop, setItemOnTop] = React.useState(items[0].label);

  const handleInvertItems = () => {
    setItems((prevItems) => [...prevItems].reverse());
  };

  const handleUpdateItemOnTop = () => {
    setItemOnTop(apiRef.current!.getItemTree()[0].label);
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Button onClick={handleInvertItems}>Invert first tree</Button>
        <Button onClick={handleUpdateItemOnTop}>Update item on top</Button>
      </Stack>
      <Typography>Item on top: {itemOnTop}</Typography>
      <Box sx={{ minHeight: 352, minWidth: 300 }}>
        <RichTreeView apiRef={apiRef} items={items} />
      </Box>
    </Stack>
  );
}

```

:::info
This method is mostly useful when the Tree View has some internal updates on the items.
For now, the only features causing updates on the items is the [re-ordering](/x/react-tree-view/rich-tree-view/ordering/).
:::

### Get an item's children by ID

Use the `getItemOrderedChildrenIds` API method to get an item's children by its ID.

```ts
const childrenIds = apiRef.current.getItemOrderedChildrenIds(
  // The id of the item to retrieve the children from
  itemId,
);
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
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

export default function ApiMethodGetItemOrderedChildrenIds() {
  const apiRef = useTreeViewApiRef();
  const [isSelectedItemLeaf, setIsSelectedItemLeaf] = React.useState<boolean | null>(
    null,
  );

  const handleSelectedItemsChange = (
    event: React.SyntheticEvent | null,
    itemId: string | null,
  ) => {
    if (itemId == null) {
      setIsSelectedItemLeaf(null);
    } else {
      const children = apiRef.current!.getItemOrderedChildrenIds(itemId);
      setIsSelectedItemLeaf(children.length === 0);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography>
        {isSelectedItemLeaf == null && 'No item selected'}
        {isSelectedItemLeaf === true && 'The selected item is a leaf'}
        {isSelectedItemLeaf === false && 'The selected item is a node with children'}
      </Typography>
      <Box sx={{ minHeight: 352, minWidth: 300 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          apiRef={apiRef}
          onSelectedItemsChange={handleSelectedItemsChange}
        />
      </Box>
    </Stack>
  );
}

```

### Get an item's parent id

Use the `getParentId()` API method to get the id of the item's parent.

```ts
publicAPI.getParentId(itemId);
```

```tsx
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from './products';

export default function GetParentIdPublicAPI() {
  const apiRef = useTreeViewApiRef();
  const [selectedItemParent, setSelectedItemParent] = React.useState<
    string | null
  >();

  const handleSelectedItemsChange = (
    _event: React.SyntheticEvent | null,
    id: string | null,
  ) => {
    if (id) {
      const parentId = apiRef.current?.getParentId(id);
      if (parentId) {
        setSelectedItemParent(parentId);
        return;
      }
    }
    setSelectedItemParent(null);
  };

  return (
    <Stack spacing={2}>
      {selectedItemParent ? (
        <Alert severity="info">
          Selected child of <em>{selectedItemParent}</em>
        </Alert>
      ) : (
        <Alert severity="info">No child node selected</Alert>
      )}

      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          apiRef={apiRef}
          items={MUI_X_PRODUCTS}
          defaultSelectedItems="tree-view"
          onSelectedItemsChange={handleSelectedItemsChange}
        />
      </Box>
    </Stack>
  );
}

```

### Imperatively disable an item

Use the `setIsItemDisabled` API method to imperatively toggle the items's disabled state.

```ts
publicAPI.setIsItemDisabled({
  // The id of the item to disable or enable
  itemId,
  // If `true` the item will be disabled
  // If `false` the item will be enabled
  // If not defined, the item's new disable status will be the opposite of its current one
  shouldBeDisabled: true,
});
```

```tsx
import * as React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemContent, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import {
  useTreeItem,
  UseTreeItemContentSlotOwnProps,
} from '@mui/x-tree-view/useTreeItem';
import { MUI_X_PRODUCTS } from './products';

interface CustomContentProps extends UseTreeItemContentSlotOwnProps {
  children: React.ReactNode;
  toggleItemDisabled: () => void;
  disabled: boolean;
}

function CustomContent({
  children,
  toggleItemDisabled,
  disabled,
  ...props
}: CustomContentProps) {
  return (
    <TreeItemContent {...props}>
      {children}

      <IconButton
        size="small"
        onClick={(event) => {
          event?.stopPropagation();
          toggleItemDisabled();
        }}
      >
        {disabled ? (
          <LockOutlinedIcon fontSize="small" />
        ) : (
          <LockOpenOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </TreeItemContent>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { publicAPI, status } = useTreeItem(props);

  const toggleItemDisabled = () =>
    publicAPI.setIsItemDisabled({
      itemId: props.itemId,
    });

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        content: CustomContent,
      }}
      slotProps={{
        content: {
          toggleItemDisabled,
          disabled: status.disabled,
        } as CustomContentProps,
      }}
    />
  );
});

export default function DisableTreeItemPublicAPI() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['pickers']}
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}

```
