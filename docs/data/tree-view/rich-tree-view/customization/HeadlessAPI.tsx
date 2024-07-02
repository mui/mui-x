import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import {
  unstable_useTreeItem2 as useTreeItem2,
  UseTreeItem2Parameters,
} from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2GroupTransition,
  TreeItem2Label,
  TreeItem2Root,
  TreeItem2Checkbox,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';

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

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));

interface CustomTreeItemProps
  extends Omit<UseTreeItem2Parameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root {...getRootProps(other)}>
        <CustomTreeItemContent {...getContentProps()}>
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
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
            <TreeItem2Checkbox {...getCheckboxProps()} />
            <TreeItem2Label {...getLabelProps()} />
          </Box>
          <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </CustomTreeItemContent>
        {children && <TreeItem2GroupTransition {...getGroupTransitionProps()} />}
      </TreeItem2Root>
    </TreeItem2Provider>
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
