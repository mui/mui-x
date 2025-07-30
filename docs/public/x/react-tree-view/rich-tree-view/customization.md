---
productId: x-tree-view
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Customization

Learn how to customize the Rich Tree View component.

:::success
See [Common concepts—Slots and subcomponents](/x/common-concepts/custom-components/) to learn how to use slots.
:::

## Basics

### Custom icons

Use the `collapseIcon` slot, the `expandIcon` slot and the `defaultEndIcon` prop to customize the Tree View icons.
The demo below shows how to add icons using both an existing icon library, such as [Material Icons](/material-ui/material-icons/), and creating an icon from scratch using Material UI's [SVG Icon component](/material-ui/icons/#svgicon).

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
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

const CustomTreeItem = styled(TreeItem)({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
});

function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

export default function CustomIcons() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView
        defaultExpandedItems={['grid']}
        slots={{
          expandIcon: AddBoxIcon,
          collapseIcon: IndeterminateCheckBoxIcon,
          endIcon: CloseSquare,
          item: CustomTreeItem,
        }}
        items={MUI_X_PRODUCTS}
      />
    </Box>
  );
}

```

### Custom toggle animations

Use the `groupTransition` slot on the `<TreeItem />` to pass a component that handles your animation.

The demo below is animated using Material UI's [Collapse](/material-ui/transitions/#collapse) component together with the [react-spring](https://www.react-spring.dev/) library.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { TransitionProps } from '@mui/material/transitions';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useSpring, animated } from '@react-spring/web';

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

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

export default function CustomAnimation() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView
        defaultExpandedItems={['grid']}
        slotProps={{ item: { slots: { groupTransition: TransitionComponent } } }}
        items={MUI_X_PRODUCTS}
      />
    </Box>
  );
}

```

### Custom styling

Use `treeItemClasses` to target internal elements of the Tree Item component and change their styles.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
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

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(0, 1.2),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    }),
    ...theme.applyStyles('dark', {
      color: theme.palette.primary.contrastText,
    }),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

export default function CustomStyling() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView
        defaultExpandedItems={['grid']}
        slots={{ item: CustomTreeItem }}
        items={MUI_X_PRODUCTS}
      />
    </Box>
  );
}

```

### Custom Tree Item

You can use the Tree Item's customization API to build new layouts and manage behaviors.
Learn more about the anatomy of the Tree Item components and the customization utilities provided in the [Tree Item customization doc](/x/react-tree-view/tree-item-customization/).

### Headless API

Use the `useTreeItem` hook to create your own component.
The demo below shows how to add an avatar and custom typography elements.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useTreeItem, UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemContent,
  TreeItemIconContainer,
  TreeItemGroupTransition,
  TreeItemLabel,
  TreeItemRoot,
  TreeItemCheckbox,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemDragAndDropOverlay } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';

const ITEMS: TreeViewBaseItem[] = [
  {
    id: '1',
    label: 'Amelia Hart',
    children: [{ id: '2', label: 'Jane Fisher' }],
  },
  {
    id: '3',
    label: 'Bailey Monroe',
    children: [
      { id: '4', label: 'Freddie Reed' },
      {
        id: '5',
        label: 'Georgia Johnson',
        children: [{ id: '6', label: 'Samantha Malone' }],
      },
    ],
  },
];

interface CustomTreeItemProps
  extends Omit<UseTreeItemParameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps(other)}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            <Avatar
              sx={(theme) => ({
                background: theme.palette.primary.main,
                width: 24,
                height: 24,
                fontSize: '0.8rem',
              })}
            >
              {(label as string)[0]}
            </Avatar>
            <TreeItemCheckbox {...getCheckboxProps()} />
            <TreeItemLabel {...getLabelProps()} />
          </Box>
          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function HeadlessAPI() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 250 }}>
      <RichTreeView
        defaultExpandedItems={['3']}
        items={ITEMS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}

```

## Common examples

### File explorer

The demo below shows many of the previous customization examples brought together to make the Tree View component look completely different than its default design.

```tsx
import * as React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { styled, alpha } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem, UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemCheckbox,
  TreeItemIconContainer,
  TreeItemLabel,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemDragAndDropOverlay } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

type FileType = 'image' | 'pdf' | 'doc' | 'video' | 'folder' | 'pinned' | 'trash';

type ExtendedTreeItemProps = {
  fileType?: FileType;
  id: string;
  label: string;
};

const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: '1',
    label: 'Documents',
    children: [
      {
        id: '1.1',
        label: 'Company',
        children: [
          { id: '1.1.1', label: 'Invoice', fileType: 'pdf' },
          { id: '1.1.2', label: 'Meeting notes', fileType: 'doc' },
          { id: '1.1.3', label: 'Tasks list', fileType: 'doc' },
          { id: '1.1.4', label: 'Equipment', fileType: 'pdf' },
          { id: '1.1.5', label: 'Video conference', fileType: 'video' },
        ],
      },
      { id: '1.2', label: 'Personal', fileType: 'folder' },
      { id: '1.3', label: 'Group photo', fileType: 'image' },
    ],
  },
  {
    id: '2',
    label: 'Bookmarked',
    fileType: 'pinned',
    children: [
      { id: '2.1', label: 'Learning materials', fileType: 'folder' },
      { id: '2.2', label: 'News', fileType: 'folder' },
      { id: '2.3', label: 'Forums', fileType: 'folder' },
      { id: '2.4', label: 'Travel documents', fileType: 'pdf' },
    ],
  },
  { id: '3', label: 'History', fileType: 'folder' },
  { id: '4', label: 'Trash', fileType: 'trash' },
];

function DotIcon() {
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '70%',
        bgcolor: 'warning.main',
        display: 'inline-block',
        verticalAlign: 'middle',
        zIndex: 1,
        mx: 1,
      }}
    />
  );
}
declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

const TreeItemRoot = styled('li')(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  outline: 0,
  color: theme.palette.grey[400],
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

const TreeItemContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
  width: '100%',
  boxSizing: 'border-box', // prevent width + padding to overflow
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  flexDirection: 'row-reverse',
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  fontWeight: 500,
  '&[data-expanded]:not([data-focused], [data-selected]) .labelIcon': {
    color: theme.palette.primary.dark,
    ...theme.applyStyles('light', {
      color: theme.palette.primary.main,
    }),
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '16px',
      top: '44px',
      height: 'calc(100% - 48px)',
      width: '1.5px',
      backgroundColor: theme.palette.grey[700],
      ...theme.applyStyles('light', {
        backgroundColor: theme.palette.grey[300],
      }),
    },
  },
  [`&[data-focused], &[data-selected]`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    ...theme.applyStyles('light', {
      backgroundColor: theme.palette.primary.main,
    }),
  },
  '&:not([data-focused], [data-selected]):hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: 'white',
    ...theme.applyStyles('light', {
      color: theme.palette.primary.main,
    }),
  },
}));

const CustomCollapse = styled(Collapse)({
  padding: 0,
});

const AnimatedCollapse = animated(CustomCollapse);

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

const TreeItemLabelText = styled(Typography)({
  color: 'inherit',
  fontFamily: 'General Sans',
  fontWeight: 500,
});

interface CustomLabelProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  expandable?: boolean;
}

function CustomLabel({
  icon: Icon,
  expandable,
  children,
  ...other
}: CustomLabelProps) {
  return (
    <TreeItemLabel
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {Icon && (
        <Box
          component={Icon}
          className="labelIcon"
          color="inherit"
          sx={{ mr: 1, fontSize: '1.2rem' }}
        />
      )}

      <TreeItemLabelText variant="body2">{children}</TreeItemLabelText>
      {expandable && <DotIcon />}
    </TreeItemLabel>
  );
}

const getIconFromFileType = (fileType: FileType) => {
  switch (fileType) {
    case 'image':
      return ImageIcon;
    case 'pdf':
      return PictureAsPdfIcon;
    case 'doc':
      return ArticleIcon;
    case 'video':
      return VideoCameraBackIcon;
    case 'folder':
      return FolderRounded;
    case 'pinned':
      return FolderOpenIcon;
    case 'trash':
      return DeleteIcon;
    default:
      return ArticleIcon;
  }
};

interface CustomTreeItemProps
  extends Omit<UseTreeItemParameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  const item = useTreeItemModel<ExtendedTreeItemProps>(itemId)!;

  let icon;
  if (status.expandable) {
    icon = FolderRounded;
  } else if (item.fileType) {
    icon = getIconFromFileType(item.fileType);
  }

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps(other)}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <TreeItemCheckbox {...getCheckboxProps()} />
          <CustomLabel
            {...getLabelProps({
              icon,
              expandable: status.expandable && status.expanded,
            })}
          />
          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function FileExplorer() {
  return (
    <RichTreeView
      items={ITEMS}
      defaultExpandedItems={['1', '1.1']}
      defaultSelectedItems="1.1"
      sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      slots={{ item: CustomTreeItem }}
      itemChildrenIndentation={24}
    />
  );
}

```
