---
productId: x-tree-view
components: RichTreeView, TreeItem
githubLabel: 'scope: tree view'
packageName: '@mui/x-tree-view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
packageName: '@mui/x-tree-view'
---

# Rich Tree View - Label editing

Learn how to edit the label of Tree View items.

## Enable label editing

You can use the `isItemEditable` prop to enable editing.
If set to `true`, this prop will enable label editing on all items:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from './products';

export default function LabelEditingAllItems() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 260 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        isItemEditable
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}

```

:::success
If an item is editable, the editing state can be toggled by double clicking on it, or by pressing <kbd class="key">Enter</kbd> on the keyboard when the item is in focus.

Once an item is in editing state, the value of the label can be edited. Pressing <kbd class="key">Enter</kbd> again or bluring the item will save the new value. Pressing <kbd class="key">Esc</kbd> will cancel the action and restore the item to its original state.

:::

## Limit editing to some items

If you pass a method to `isItemEditable`, only the items for which the method returns `true` will be editable:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from './editableProducts';

export default function LabelEditingSomeItems() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 260 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        isItemEditable={(item) => Boolean(item?.editable)}
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}

```

### Limit editing to leaves

You can limit the editing to just the leaves of the tree.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

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
    label: 'Date and Time pickers',
    children: [
      {
        id: 'pickers-community',
        label: '@mui/x-date-pickers',
      },
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

export default function EditLeaves() {
  const apiRef = useTreeViewApiRef();
  return (
    <Box sx={{ minHeight: 352, minWidth: 260 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        apiRef={apiRef}
        isItemEditable={(item) =>
          apiRef.current!.getItemOrderedChildrenIds(item.id).length === 0
        }
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}

```

## Track item label change

Use the `onItemLabelChange` prop to trigger an action when the label of an item changes.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from './products';

export default function EditingCallback() {
  const [lastEditedItem, setLastEditedItem] = React.useState<{
    itemId: string;
    label: string;
  } | null>(null);

  return (
    <Stack spacing={2} sx={{ width: 400 }}>
      {lastEditedItem ? (
        <Typography>
          The label of item with id <em>{lastEditedItem!.itemId}</em> has been edited
          to <em>{lastEditedItem!.label}</em>
        </Typography>
      ) : (
        <Typography>No item has been edited yet</Typography>
      )}
      <Box sx={{ minHeight: 352, minWidth: 260 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          isItemEditable
          defaultExpandedItems={['grid', 'pickers']}
          onItemLabelChange={(itemId, label) => setLastEditedItem({ itemId, label })}
        />
      </Box>
    </Stack>
  );
}

```

## Change the default behavior

By default, blurring the Tree Item saves the new value if there is one.
To modify this behavior, use the `slotProps` of the Tree Item.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { UseTreeItemLabelInputSlotOwnProps } from '@mui/x-tree-view/useTreeItem';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { interactions } = useTreeItemUtils({
    itemId: props.itemId,
    children: props.children,
  });

  const handleInputBlur: UseTreeItemLabelInputSlotOwnProps['onBlur'] = (event) => {
    interactions.handleCancelItemLabelEditing(event);
  };

  return (
    <TreeItem
      {...props}
      ref={ref}
      slotProps={{
        labelInput: {
          onBlur: handleInputBlur,
        },
      }}
    />
  );
});

export default function CustomBehavior() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 260 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
        isItemEditable
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}

```

## Validation

You can override the event handlers of the `labelInput` and implement a custom validation logic using the interaction methods from `useTreeItemUtils`.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { UseTreeItemLabelInputSlotOwnProps } from '@mui/x-tree-view/useTreeItem';
import { TreeItemLabelInput } from '@mui/x-tree-view/TreeItemLabelInput';
import { MUI_X_PRODUCTS } from './products';

const ERRORS = {
  REQUIRED: 'The label cannot be empty',
  INVALID: 'The label cannot contain digits',
};

interface CustomLabelInputProps extends UseTreeItemLabelInputSlotOwnProps {
  error: null | keyof typeof ERRORS;
}

function CustomLabelInput(props: Omit<CustomLabelInputProps, 'ref'>) {
  const { error, ...other } = props;

  return (
    <React.Fragment>
      <TreeItemLabelInput {...other} />
      {error ? (
        <Tooltip title={ERRORS[error]}>
          <ErrorOutlineIcon color="error" />
        </Tooltip>
      ) : (
        <Tooltip title="All good!">
          <CheckCircleOutlineIcon color="success" />
        </Tooltip>
      )}
    </React.Fragment>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const [error, setError] = React.useState<null | keyof typeof ERRORS>(null);
  const { interactions } = useTreeItemUtils({
    itemId: props.itemId,
    children: props.children,
  });
  const validateLabel = (label: string) => {
    if (!label) {
      setError('REQUIRED');
    } else if (/\d/.test(label)) {
      setError('INVALID');
    } else {
      setError(null);
    }
  };

  const handleInputBlur: UseTreeItemLabelInputSlotOwnProps['onBlur'] = (event) => {
    if (error) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleInputKeyDown: UseTreeItemLabelInputSlotOwnProps['onKeyDown'] = (
    event,
  ) => {
    event.defaultMuiPrevented = true;
    const target = event.target as HTMLInputElement;

    if (event.key === 'Enter' && target.value) {
      if (error) {
        return;
      }
      setError(null);
      interactions.handleSaveItemLabel(event, target.value);
    } else if (event.key === 'Escape') {
      setError(null);
      interactions.handleCancelItemLabelEditing(event);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    validateLabel(event.target.value);
  };

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{ labelInput: CustomLabelInput }}
      slotProps={{
        labelInput: {
          onBlur: handleInputBlur,
          onKeyDown: handleInputKeyDown,
          onChange: handleInputChange,
          error,
        } as CustomLabelInputProps,
      }}
    />
  );
});

export default function Validation() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 260 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
        isItemEditable
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}

```

## Enable editing using only icons

The demo below shows how to entirely override the editing behavior, and implement it using icons.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckIcon from '@mui/icons-material/Check';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import { TreeItem, TreeItemLabel, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeItemLabelInput } from '@mui/x-tree-view/TreeItemLabelInput';
import {
  UseTreeItemLabelInputSlotOwnProps,
  UseTreeItemLabelSlotOwnProps,
} from '@mui/x-tree-view/useTreeItem';
import { MUI_X_PRODUCTS } from './products';

interface CustomLabelProps extends UseTreeItemLabelSlotOwnProps {
  editable: boolean;
  editing: boolean;
  toggleItemEditing: () => void;
}

function CustomLabel({
  editing,
  editable,
  children,
  toggleItemEditing,
  ...other
}: CustomLabelProps) {
  return (
    <TreeItemLabel
      {...other}
      editable={editable}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        justifyContent: 'space-between',
      }}
    >
      {children}
      {editable && (
        <IconButton
          size="small"
          onClick={toggleItemEditing}
          sx={{ color: 'text.secondary' }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      )}
    </TreeItemLabel>
  );
}

interface CustomLabelInputProps extends UseTreeItemLabelInputSlotOwnProps {
  handleCancelItemLabelEditing: (event: React.SyntheticEvent) => void;
  handleSaveItemLabel: (event: React.SyntheticEvent, label: string) => void;
  value: string;
}

function CustomLabelInput(props: Omit<CustomLabelInputProps, 'ref'>) {
  const { handleCancelItemLabelEditing, handleSaveItemLabel, value, ...other } =
    props;

  return (
    <React.Fragment>
      <TreeItemLabelInput {...other} value={value} />
      <IconButton
        color="success"
        size="small"
        onClick={(event: React.MouseEvent) => {
          handleSaveItemLabel(event, value);
        }}
      >
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton color="error" size="small" onClick={handleCancelItemLabelEditing}>
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { interactions, status } = useTreeItemUtils({
    itemId: props.itemId,
    children: props.children,
  });

  const handleContentDoubleClick: UseTreeItemLabelSlotOwnProps['onDoubleClick'] = (
    event,
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleInputBlur: UseTreeItemLabelInputSlotOwnProps['onBlur'] = (event) => {
    event.defaultMuiPrevented = true;
  };

  const handleInputKeyDown: UseTreeItemLabelInputSlotOwnProps['onKeyDown'] = (
    event,
  ) => {
    event.defaultMuiPrevented = true;
  };

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{ label: CustomLabel, labelInput: CustomLabelInput }}
      slotProps={{
        label: {
          onDoubleClick: handleContentDoubleClick,
          editable: status.editable,
          editing: status.editing,
          toggleItemEditing: interactions.toggleItemEditing,
        } as CustomLabelProps,
        labelInput: {
          onBlur: handleInputBlur,
          onKeyDown: handleInputKeyDown,
          handleCancelItemLabelEditing: interactions.handleCancelItemLabelEditing,
          handleSaveItemLabel: interactions.handleSaveItemLabel,
        } as CustomLabelInputProps,
      }}
    />
  );
});

export default function EditWithIcons() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 260 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
        isItemEditable
        defaultExpandedItems={['grid', 'pickers']}
        expansionTrigger="iconContainer"
      />
    </Box>
  );
}

```

## Create a custom labelInput

The demo below shows how to use a different component in the `labelInput` slot.

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { TreeItem, TreeItemLabel, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import {
  UseTreeItemLabelInputSlotOwnProps,
  UseTreeItemLabelSlotOwnProps,
} from '@mui/x-tree-view/useTreeItem';
import { useTreeItemUtils, useTreeItemModel } from '@mui/x-tree-view/hooks';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';

const StyledLabelInput = styled('input')(({ theme }) => ({
  ...theme.typography.body1,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: 'none',
  padding: '0 2px',
  boxSizing: 'border-box',
  width: 100,
  '&:focus': {
    outline: `1px solid ${(theme.vars || theme).palette.primary.main}`,
  },
}));

type ExtendedTreeItemProps = {
  editable?: boolean;
  id: string;
  firstName: string;
  lastName: string;
};

export const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    editable: true,
    children: [
      { id: '1.1', firstName: 'Elena', lastName: 'Kim', editable: true },
      { id: '1.2', firstName: 'Noah', lastName: 'Rodriguez', editable: true },
      { id: '1.3', firstName: 'Maya', lastName: 'Patel', editable: true },
    ],
  },
  {
    id: '2',
    firstName: 'Liam',
    lastName: 'Clarke',
    editable: true,
    children: [
      {
        id: '2.1',
        firstName: 'Ethan',
        lastName: 'Lee',
        editable: true,
      },
      { id: '2.2', firstName: 'Ava', lastName: 'Jones', editable: true },
    ],
  },
];

function Label({ children, ...other }: UseTreeItemLabelSlotOwnProps) {
  return (
    <TreeItemLabel
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        justifyContent: 'space-between',
        minHeight: 30,
      }}
    >
      {children}
    </TreeItemLabel>
  );
}

interface CustomLabelInputProps extends UseTreeItemLabelInputSlotOwnProps {
  handleCancelItemLabelEditing: (event: React.SyntheticEvent) => void;
  handleSaveItemLabel: (event: React.SyntheticEvent, label: string) => void;
  itemId: TreeViewItemId;
}

const LabelInput = React.forwardRef(function LabelInput(
  {
    itemId,
    handleCancelItemLabelEditing,
    handleSaveItemLabel,
    ...props
  }: Omit<CustomLabelInputProps, 'ref'>,
  ref: React.Ref<HTMLInputElement>,
) {
  const item = useTreeItemModel<ExtendedTreeItemProps>(itemId)!;

  const [initialNameValue, setInitialNameValue] = React.useState({
    firstName: item.firstName,
    lastName: item.lastName,
  });
  const [nameValue, setNameValue] = React.useState({
    firstName: item.firstName,
    lastName: item.lastName,
  });

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue((prev) => ({ ...prev, firstName: event.target.value }));
  };
  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue((prev) => ({ ...prev, lastName: event.target.value }));
  };

  const reset = () => {
    setNameValue(initialNameValue);
  };
  const save = () => {
    setInitialNameValue(nameValue);
  };

  return (
    <React.Fragment>
      <StyledLabelInput
        {...props}
        onChange={handleFirstNameChange}
        value={nameValue.firstName}
        autoFocus
        type="text"
        ref={ref}
      />
      <StyledLabelInput
        {...props}
        onChange={handleLastNameChange}
        value={nameValue.lastName}
        type="text"
        ref={ref}
      />
      <IconButton
        color="success"
        size="small"
        onClick={(event: React.MouseEvent) => {
          handleSaveItemLabel(event, `${nameValue.firstName} ${nameValue.lastName}`);
          save();
        }}
      >
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton
        color="error"
        size="small"
        onClick={(event: React.MouseEvent) => {
          handleCancelItemLabelEditing(event);
          reset();
        }}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { interactions } = useTreeItemUtils({
    itemId: props.itemId,
    children: props.children,
  });

  const handleInputBlur: UseTreeItemLabelInputSlotOwnProps['onBlur'] = (event) => {
    event.defaultMuiPrevented = true;
  };

  const handleInputKeyDown: UseTreeItemLabelInputSlotOwnProps['onKeyDown'] = (
    event,
  ) => {
    event.defaultMuiPrevented = true;
  };

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{ label: Label, labelInput: LabelInput }}
      slotProps={{
        labelInput: {
          itemId: props.itemId,
          onBlur: handleInputBlur,
          onKeyDown: handleInputKeyDown,
          handleCancelItemLabelEditing: interactions.handleCancelItemLabelEditing,
          handleSaveItemLabel: interactions.handleSaveItemLabel,
        } as any,
      }}
    />
  );
});

export default function CustomLabelInput() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 340 }}>
      <RichTreeView
        items={ITEMS}
        slots={{ item: CustomTreeItem }}
        isItemEditable
        defaultExpandedItems={['1', '2']}
        getItemLabel={(item) => `${item.firstName} ${item.lastName}`}
      />
    </Box>
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

### Change the label of an item

Use the `updateItemLabel()` API method to imperatively update the label of an item.

```ts
apiRef.current.updateItemLabel(
  // The id of the item to update
  itemId,
  // The new label of the item
  newLabel,
);
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from './products';

export default function ApiMethodUpdateItemLabel() {
  const [isLabelUpdated, setIsLabelUpdated] = React.useState(false);
  const apiRef = useTreeViewApiRef();

  const handleUpdateLabel = () => {
    if (isLabelUpdated) {
      apiRef.current!.updateItemLabel('grid', 'Data Grid');
      setIsLabelUpdated(false);
    } else {
      apiRef.current!.updateItemLabel('grid', 'New Label');
      setIsLabelUpdated(true);
    }
  };

  return (
    <Stack spacing={2}>
      <Stack spacing={2} direction="row">
        <Button onClick={handleUpdateLabel}>
          {isLabelUpdated ? 'Reset Data Grid label' : 'Change Data Grid label'}
        </Button>
      </Stack>
      <Box sx={{ minHeight: 352, minWidth: 260 }}>
        <RichTreeView items={MUI_X_PRODUCTS} apiRef={apiRef} />
      </Box>
    </Stack>
  );
}

```

### Change edition mode of an item

Use the `setEditedItem()` API method to set which item is being edited.

```ts
apiRef.current.setEditedItem(
  // The id of the item to edit, or `null` to exit editing mode
  itemId,
);
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

export default function ApiMethodSetEditedItem() {
  const [items, setItems] = React.useState([
    { id: '1', label: 'Jane Doe', editable: true },
  ]);
  const apiRef = useTreeViewApiRef();

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

```

## Editing lazy loaded children

To store the updated item labels on your server use the `onItemLabelChange` callback function.

Changes to the label are not automatically updated in the `dataSourceCache` and will need to be updated manually.

```tsx
const handleItemLabelChange = (itemId: TreeViewItemId, newLabel: string) => {
  // update your cache here
};

<RichTreeViewPro
  items={[]}
  onItemLabelChange={handleItemLabelChange}
  isItemEditable
  dataSource={{
    getChildrenCount: (item) => item?.childrenCount as number,
    getTreeItems: fetchData,
  }}
  {...otherProps}
/>;
```

Visit the dedicated page for [lazy loading](/x/react-tree-view/rich-tree-view/lazy-loading/#lazy-loading-and-label-editing) to read more.
