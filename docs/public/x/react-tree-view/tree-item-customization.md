---
productId: x-tree-view
title: Tree Item Customization
components: SimpleTreeView, RichTreeView, TreeItem, TreeItemIcon, TreeItemProvider
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Tree Item Customization

Learn how to customize the Tree Item component.

## Anatomy

Each Tree Item component is shaped by a series of composable slots.
Hover over them in the demo below to see each slot.

<span class="only-light-mode" style="border: 1px solid rgb(232, 234, 238); border-radius:12px">
  <img src="/static/x/tree-view-illustrations/tree-item-light.png" width="1632" height="644" alt="Tree Item anatomy" loading="lazy" style="display: block;">
</span>
<span class="only-dark-mode" style="border: 1px solid rgb(29, 33, 38); border-radius:12px">
  <img src="/static/x/tree-view-illustrations/tree-item-dark.png" width="1632" height="644" alt="Tree Item anatomy" loading="lazy" style="display: block;">
</span>

### Content

Use the content slot to customize the content of the Tree Item or replace it with a custom component.

#### Slot props

The `slotProps` prop lets you pass props to the content component.
The demo below shows how to pass an `sx` handler to the content of the Tree Item:

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeItem,
  TreeItemProps,
  TreeItemSlotProps,
} from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slotProps={
        {
          content: {
            sx: { border: '1px solid' },
          },
        } as TreeItemSlotProps
      }
    />
  );
});

export default function ContentSlotProps() {
  return (
    <Stack sx={{ minHeight: 200, minWidth: 350 }} spacing={2}>
      <RichTreeView
        defaultExpandedItems={['pickers']}
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Stack>
  );
}

```

#### Slot

The demo below shows how to replace the content slot with a custom component.

```tsx
import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from './products';

const CustomContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
  borderRadius: theme.shape.borderRadius,
  border: '1px solid',
  display: 'flex',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
  '&[data-disabled]': {
    opacity: 0.5,
    backgroundColor: theme.palette.action.disabledBackground,
  },
  '&[data-selected]': {
    backgroundColor: alpha(theme.palette.primary.main, 0.4),
  },
}));

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        content: CustomContent,
      }}
    />
  );
});

export default function ContentSlot() {
  return (
    <Stack sx={{ minHeight: 200, minWidth: 350 }} spacing={2}>
      <RichTreeView
        defaultExpandedItems={['pickers']}
        defaultSelectedItems={'grid'}
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
        isItemDisabled={(item) => Boolean(item?.disabled)}
      />
    </Stack>
  );
}

```

### Label

Use the label slot to customize the Tree Item label or replace it with a custom component.

#### Slot props

The `slotProps` prop lets you pass props to the label component.
The demo below shows how to pass an `id` attribute to the Tree Item label:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slotProps={{
        label: {
          id: `${props.itemId}-label`,
        },
      }}
    />
  );
});

export default function LabelSlotProps() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['grid', 'pickers']}
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}

```

#### Slot

The demo below shows how to replace the label slot with a custom component.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';

type TreeItemWithLabel = {
  id: string;
  label: string;
  secondaryLabel?: string;
};

export const MUI_X_PRODUCTS: TreeViewBaseItem<TreeItemWithLabel>[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      {
        id: 'grid-community',
        label: '@mui/x-data-grid',
        secondaryLabel: 'Community package',
      },
      {
        id: 'grid-pro',
        label: '@mui/x-data-grid-pro',
        secondaryLabel: 'Pro package',
      },
      {
        id: 'grid-premium',
        label: '@mui/x-data-grid-premium',
        secondaryLabel: 'Premium package',
      },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time pickers',

    children: [
      {
        id: 'pickers-community',
        label: '@mui/x-date-pickers',
        secondaryLabel: 'Community package',
      },
      {
        id: 'pickers-pro',
        label: '@mui/x-date-pickers-pro',
        secondaryLabel: 'Pro package',
      },
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

interface CustomLabelProps {
  children: string;
  className: string;
  secondaryLabel: string;
}

function CustomLabel({ children, className, secondaryLabel }: CustomLabelProps) {
  return (
    <div className={className}>
      <Typography>{children}</Typography>
      {secondaryLabel && (
        <Typography variant="caption" color="secondary">
          {secondaryLabel}
        </Typography>
      )}
    </div>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const item = useTreeItemModel<TreeItemWithLabel>(props.itemId)!;

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        label: { secondaryLabel: item?.secondaryLabel || '' } as CustomLabelProps,
      }}
    />
  );
});

export default function LabelSlot() {
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

### Checkbox

The checkbox is present on the items when `checkboxSelection` is enabled on the Tree View.

#### Slot props

You can pass props to the checkbox slot using the `slotProps` on the Tree Item 2 component.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeItem,
  TreeItemProps,
  TreeItemSlotProps,
} from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slotProps={
        {
          checkbox: {
            size: 'small',
            icon: <FavoriteBorder />,
            checkedIcon: <Favorite />,
          },
        } as TreeItemSlotProps
      }
    />
  );
});

export default function CheckboxSlotProps() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['grid', 'pickers']}
        checkboxSelection
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}

```

#### Slot

The demo below shows how to replace the checkbox slot with a custom component.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from './products';

const CustomCheckbox = React.forwardRef(function CustomCheckbox(
  props: React.InputHTMLAttributes<HTMLInputElement>,
  ref: React.Ref<HTMLInputElement>,
) {
  return <input type="checkbox" ref={ref} {...props} />;
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        checkbox: CustomCheckbox,
      }}
    />
  );
});

export default function CheckboxSlot() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['grid', 'pickers']}
        checkboxSelection
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}

```

## Basics

### Change nested item's indentation

Use the `itemChildrenIndentation` prop to change the indentation of the nested items.
By default, a nested item is indented by `12px` from its parent item.

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

export default function ItemChildrenIndentationProp() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 350 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        itemChildrenIndentation={24}
        defaultExpandedItems={['grid']}
      />
    </Box>
  );
}

```

:::success
If you are using a custom Tree Item component, and you want to override the padding,
then apply the following padding to your `content` element:

```ts
const CustomTreeItemContent = styled(TreeItemContent)(({ theme }) => ({
  // ...other styles
  paddingLeft:
      `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
}
```

:::

## Hooks

### useTreeItem

The `useTreeItem` hook lets you manage and customize individual Tree Items.
You can use it to get the properties needed for all slots, the status of any given Item, or to tap into the interactive API of the Tree View.

#### Slot properties

The `useTreeItem` hook gives you granular control over an Item's layout by providing resolvers to get the appropriate props for each slot.
This makes it possible to build a fully custom layout for your Tree Items.

The demo below shows how to get the props needed for each slot, and how to pass them correctly.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemCheckbox,
  TreeItemContent,
  TreeItemIconContainer,
  TreeItemLabel,
  TreeItemRoot,
  TreeItemProps,
  TreeItemGroupTransition,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemDragAndDropOverlay } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import { TreeItemLabelInput } from '@mui/x-tree-view/TreeItemLabelInput';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  { id, itemId, label, disabled, children }: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getLabelInputProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps()}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <TreeItemCheckbox {...getCheckboxProps()} />
          {status.editing ? (
            <TreeItemLabelInput {...getLabelInputProps()} />
          ) : (
            <TreeItemLabel {...getLabelProps()} />
          )}

          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function useTreeItemHookProperties() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        defaultExpandedItems={['grid']}
        slots={{ item: CustomTreeItem }}
        checkboxSelection
        isItemEditable
      />
    </Box>
  );
}

```

You can pass additional props to a slot—or override existing slots—by passing an object argument to the slot's props resolver, as shown below:

```jsx
<CustomTreeItemContent
  {...getContentProps({
    className: 'overridingClassName',
    newProp: 'I am passing this to the content slot'
  })}
>
```

#### Item status

The `useTreeItem` hook also returns a `status` object that holds boolean values for each possible state of a Tree Item.

```jsx
const {
  status: { expanded, expandable, focused, selected, disabled, editable, editing },
} = useTreeItem(props);
```

You can use these statuses to apply custom styling to the item or conditionally render subcomponents.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AdjustIcon from '@mui/icons-material/Adjust';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem, UseTreeItemStatus } from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemContent,
  TreeItemRoot,
  TreeItemProps,
  TreeItemGroupTransition,
  TreeItemIconContainer,
  TreeItemLabel,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemLabelInput } from '@mui/x-tree-view/TreeItemLabelInput';
import { MUI_X_PRODUCTS } from './products';

function StatusLegend() {
  return (
    <Paper
      variant="outlined"
      elevation={2}
      sx={(theme) => ({
        padding: 2,
        background: theme.palette.grey[50],
        ...theme.applyStyles('dark', {
          background: theme.palette.grey[900],
        }),
      })}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle2">Legend</Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          {STATUS_ICONS.focused}
          <Typography variant="body2">focused</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {STATUS_ICONS.selected}
          <Typography variant="body2">selected</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {STATUS_ICONS.expandable}
          <Typography variant="body2">expandable</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {STATUS_ICONS.expanded}
          <Typography variant="body2">expanded</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {STATUS_ICONS.disabled}
          <Typography variant="body2">disabled</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {STATUS_ICONS.editable}
          <Typography variant="body2">editable</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {STATUS_ICONS.editing}
          <Typography variant="body2">editing</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {STATUS_ICONS.loading}
          <Typography variant="body2">loading</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {STATUS_ICONS.error}
          <Typography variant="body2">error</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

const STATUS_ICONS: {
  [K in keyof UseTreeItemStatus]: React.ReactNode;
} = {
  focused: <AdjustIcon color="primary" fontSize="small" />,
  selected: <CheckCircleOutlinedIcon color="success" fontSize="small" />,
  expandable: <ExpandCircleDownOutlinedIcon color="secondary" fontSize="small" />,
  expanded: <ExpandCircleDownRoundedIcon color="secondary" fontSize="small" />,
  disabled: <CancelOutlinedIcon color="action" fontSize="small" />,
  editable: <EditOutlinedIcon color="warning" fontSize="small" />,
  editing: <DrawOutlinedIcon color="info" fontSize="small" />,
  loading: <HourglassBottomOutlinedIcon color="info" fontSize="small" />,
  error: <ErrorOutlineOutlinedIcon color="info" fontSize="small" />,
};

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  { id, itemId, label, disabled, children }: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getLabelProps,
    getGroupTransitionProps,
    getIconContainerProps,
    getLabelInputProps,
    status,
  } = useTreeItem({ id, itemId, label, disabled, children, rootRef: ref });

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps()}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>

          {status.editing ? (
            <TreeItemLabelInput {...getLabelInputProps()} />
          ) : (
            <TreeItemLabel {...getLabelProps()} />
          )}

          <Stack direction="row">
            {(Object.keys(STATUS_ICONS) as [keyof UseTreeItemStatus]).map(
              (iconKey, index) => {
                if (status[iconKey]) {
                  return (
                    <Box key={index} sx={{ display: 'flex' }}>
                      {STATUS_ICONS[iconKey]}
                    </Box>
                  );
                }
                return null;
              },
            )}
          </Stack>
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function useTreeItemHookStatus() {
  return (
    <Stack spacing={6} direction={{ md: 'row' }}>
      <Box sx={{ minHeight: 200, minWidth: 350 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          defaultExpandedItems={['pickers']}
          defaultSelectedItems={'pickers'}
          slots={{ item: CustomTreeItem }}
          isItemDisabled={(item) => Boolean(item?.disabled)}
          isItemEditable={(item) => Boolean(item?.editable)}
        />
      </Box>
      <StatusLegend />
    </Stack>
  );
}

```

#### Imperative API

The `publicAPI` object provides a number of methods to programmatically interact with the Tree View.
You can use the `useTreeItem` hook to access the `publicAPI` object from within a Tree Item.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import { MUI_X_PRODUCTS } from './products';

interface CustomLabelProps {
  children: string;
  className: string;
  selectFirstChildren?: (event: React.MouseEvent) => void;
}

function CustomLabel({
  children,
  className,
  selectFirstChildren,
}: CustomLabelProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={4}
      flexGrow={1}
      className={className}
    >
      <Typography>{children}</Typography>
      {!!selectFirstChildren && (
        <Button
          size="small"
          variant="text"
          sx={{ position: 'absolute', right: 0, top: 0 }}
          onClick={selectFirstChildren}
        >
          Select child
        </Button>
      )}
    </Stack>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { publicAPI, status } = useTreeItem(props);

  const selectFirstChildren = status.expanded
    ? (event: React.MouseEvent) => {
        event.stopPropagation();
        const children = publicAPI.getItemOrderedChildrenIds(props.itemId);
        if (children.length > 0) {
          publicAPI.setItemSelection({
            event,
            itemId: children[0],
            shouldBeSelected: true,
          });
        }
      }
    : undefined;

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        label: { selectFirstChildren } as CustomLabelProps,
      }}
    />
  );
});

export default function useTreeItemHookPublicAPI() {
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

See the **Imperative API** section on each feature page to learn more about the public API methods available on the Tree View.

:::warning
The `publicAPI` object should not be used in the render because the item won't necessarily re-render when the returned value is updated.

If you want to access the item model, you can use the `useTreeItemModel` hook.
See [Tree Item Customization—useTreeItemModel](/x/react-tree-view/tree-item-customization/#usetreeitemmodel) for more details.
:::

### `useTreeItemUtils`

The `useTreeItemUtils` hook provides a set of interaction methods for implementing custom behaviors for the Tree View.
It also returns the status of the Item.

```jsx
const { interactions, status, publicAPI } = useTreeItemUtils({
  itemId: props.itemId,
  children: props.children,
});
```

To override the Tree Item's default interactions, set `event.defaultMuiPrevented` to `true` in the event handlers and then implement your own behavior.

#### Selection

You can select an Item in a Tree View by clicking its content slot.
The demo below shows how to handle selection when the user clicks on an icon.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import CircleIcon from '@mui/icons-material/Circle';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import {
  UseTreeItemContentSlotOwnProps,
  UseTreeItemLabelSlotOwnProps,
  UseTreeItemStatus,
} from '@mui/x-tree-view/useTreeItem';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeItem,
  TreeItemProps,
  TreeItemSlotProps,
} from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from './products';

interface CustomLabelProps extends UseTreeItemLabelSlotOwnProps {
  status: UseTreeItemStatus;
  onClick: React.MouseEventHandler<HTMLElement>;
}

function CustomLabel({ children, status, onClick, ...props }: CustomLabelProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexGrow={1}
      {...props}
    >
      <Typography>{children}</Typography>
      <IconButton onClick={onClick} aria-label="select item" size="small">
        {status.selected ? (
          <CircleIcon fontSize="inherit" color="primary" />
        ) : (
          <PanoramaFishEyeIcon fontSize="inherit" color="primary" />
        )}
      </IconButton>
    </Stack>
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
  const handleContentClick: UseTreeItemContentSlotOwnProps['onClick'] = (event) => {
    event.defaultMuiPrevented = true;
  };

  const handleIconButtonClick = (event: React.MouseEvent) => {
    interactions.handleSelection(event);
  };

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel,
      }}
      slotProps={
        {
          label: { onClick: handleIconButtonClick, status },
          content: { onClick: handleContentClick },
        } as TreeItemSlotProps
      }
    />
  );
});

export default function HandleSelectionDemo() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['grid', 'pickers']}
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
        expansionTrigger="iconContainer"
      />
    </Box>
  );
}

```

#### Checkbox selection

By default, checkbox selection is skipped if an Item is disabled or if `disableSelection` is `true` on the Tree View.
You can create a custom handler for the `onChange` event on the checkbox slot to bypass these conditions.
The demo below shows how to implement custom checkbox selection behavior.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import { UseTreeItemCheckboxSlotOwnProps } from '@mui/x-tree-view/useTreeItem';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeItem,
  TreeItemProps,
  TreeItemSlotProps,
} from '@mui/x-tree-view/TreeItem';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { interactions } = useTreeItemUtils({
    itemId: props.itemId,
    children: props.children,
  });

  const doSomething = () => {
    // Do something when the checkbox is clicked
  };

  const handleCheckboxOnChange: UseTreeItemCheckboxSlotOwnProps['onChange'] = (
    event,
  ) => {
    event.defaultMuiPrevented = true;
    doSomething();
    interactions.handleCheckboxSelection(event);
  };

  return (
    <TreeItem
      {...props}
      ref={ref}
      slotProps={
        {
          checkbox: { onChange: handleCheckboxOnChange },
        } as TreeItemSlotProps
      }
    />
  );
});

export default function HandleCheckboxSelectionDemo() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['grid', 'pickers']}
        checkboxSelection
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}

```

Visit the [Rich Tree View](/x/react-tree-view/rich-tree-view/selection/) or [Simple Tree View](/x/react-tree-view/simple-tree-view/selection/) docs, respectively, for more details on the selection API.

#### Expansion

By default, a Tree Item is expanded when the user clicks on its contents.
You can change the expansion trigger using the `expansionTrigger` prop on the `iconContainer`.
For more details, see [Expansion—Limit expansion to icon container](/x/react-tree-view/rich-tree-view/expansion/#limit-expansion-to-icon-container).

Use the `handleExpansion` interaction method for deeper customization of the Item's expansion behavior.

The demo below shows how to introduce a new element that expands and collapses the Item.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemContent,
  TreeItemLabel,
  TreeItemRoot,
  TreeItemProps,
  TreeItemGroupTransition,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemDragAndDropOverlay } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  { id, itemId, label, disabled, children }: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const {
    getRootProps,
    getContentProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    getContextProviderProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  const { interactions } = useTreeItemUtils({
    itemId,
    children,
  });

  const handleClick = (event: React.MouseEvent) => {
    interactions.handleExpansion(event);
  };

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps({ sx: { position: 'relative' } })}>
        {status.expandable && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexGrow: 1,
              width: '24px',
              height: 'calc(100% - 12px)',
              position: 'absolute',
              left: '-24px',
              top: '6px',
            }}
          >
            {status.expanded ? (
              <React.Fragment>
                <IconButton
                  onClick={handleClick}
                  aria-label="collapse item"
                  size="small"
                >
                  <IndeterminateCheckBoxOutlinedIcon sx={{ fontSize: '14px' }} />
                </IconButton>
                <Box sx={{ flexGrow: 1, borderLeft: '1px solid' }} />
              </React.Fragment>
            ) : (
              <IconButton
                onClick={handleClick}
                aria-label="Expand item"
                size="small"
              >
                <AddBoxOutlinedIcon sx={{ fontSize: '14px' }} />
              </IconButton>
            )}
          </Box>
        )}

        <TreeItemContent {...getContentProps()}>
          <TreeItemLabel {...getLabelProps()} />

          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function HandleExpansionDemo() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        defaultExpandedItems={['grid']}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}

```

#### Label editing

The `useTreeItemUtils` hook provides the following interaction methods relevant to label editing behavior:

```jsx
const {
  interactions: {
    toggleItemEditing,
    handleCancelItemLabelEditing,
    handleSaveItemLabel,
  },
} = useTreeItemUtils({
  itemId: props.itemId,
  children: props.children,
});
```

See [Editing—enable editing using only icons](/x/react-tree-view/rich-tree-view/editing/#enable-editing-using-only-icons) for more details on customizing this behavior.

### `useTreeItemModel`

The `useTreeItemModel` hook lets you access the item model (the object passed to `props.items`):

```jsx
const item = useTreeItemModel(itemId);
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';

type TreeItemWithLabel = {
  id: string;
  label: string;
  secondaryLabel?: string;
};

export const MUI_X_PRODUCTS: TreeViewBaseItem<TreeItemWithLabel>[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      {
        id: 'grid-community',
        label: '@mui/x-data-grid',
        secondaryLabel: 'Community package',
      },
      {
        id: 'grid-pro',
        label: '@mui/x-data-grid-pro',
        secondaryLabel: 'Pro package',
      },
      {
        id: 'grid-premium',
        label: '@mui/x-data-grid-premium',
        secondaryLabel: 'Premium package',
      },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time pickers',

    children: [
      {
        id: 'pickers-community',
        label: '@mui/x-date-pickers',
        secondaryLabel: 'Community package',
      },
      {
        id: 'pickers-pro',
        label: '@mui/x-date-pickers-pro',
        secondaryLabel: 'Pro package',
      },
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

interface CustomLabelProps {
  children: string;
  className: string;
  secondaryLabel: string;
}

function CustomLabel({ children, className, secondaryLabel }: CustomLabelProps) {
  return (
    <div className={className}>
      <Typography>{children}</Typography>
      {secondaryLabel && (
        <Typography variant="caption" color="secondary">
          {secondaryLabel}
        </Typography>
      )}
    </div>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const item = useTreeItemModel<TreeItemWithLabel>(props.itemId)!;

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        label: { secondaryLabel: item?.secondaryLabel || '' } as CustomLabelProps,
      }}
    />
  );
});

export default function LabelSlot() {
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
