import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import {
  useTreeItem,
  UseTreeItemParameters,
} from '@mui/x-tree-view/internals/useTreeItem';
import {
  TreeItemNextContent,
  TreeItemNextIconContainer,
  TreeItemNextTransitionGroup,
  TreeItemNextLabel,
  TreeItemNextRoot,
} from '@mui/x-tree-view/internals/TreeItemNext';
import { TreeItemIcon } from '@mui/x-tree-view/internals/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/internals/TreeItemProvider';

const CustomTreeItemContent = styled(TreeItemNextContent)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: Omit<UseTreeItemParameters, 'rootRef'>,
  ref: React.Ref<HTMLLIElement>,
) {
  const { id, nodeId, label, children, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
  } = useTreeItem({ id, nodeId, children, label, rootRef: ref });

  return (
    <TreeItemProvider nodeId={nodeId}>
      <TreeItemNextRoot {...getRootProps(other)}>
        <CustomTreeItemContent {...getContentProps()}>
          <TreeItemNextIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemNextIconContainer>
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
            <TreeItemNextLabel {...getLabelProps()} />
          </Box>
        </CustomTreeItemContent>
        {children && <TreeItemNextTransitionGroup {...getGroupTransitionProps()} />}
      </TreeItemNextRoot>
    </TreeItemProvider>
  );
});

export default function CustomContentTreeView() {
  return (
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <SimpleTreeView
        aria-label="icon expansion"
        sx={{ position: 'relative' }}
        defaultExpandedNodes={['3']}
      >
        <CustomTreeItem nodeId="1" label="Amelia Hart">
          <CustomTreeItem nodeId="2" label="Jane Fisher" />
        </CustomTreeItem>
        <CustomTreeItem nodeId="3" label="Bailey Monroe">
          <CustomTreeItem nodeId="4" label="Freddie Reed" />
          <CustomTreeItem nodeId="5" label="Georgia Johnson">
            <CustomTreeItem nodeId="6" label="Samantha Malone" />
          </CustomTreeItem>
        </CustomTreeItem>
      </SimpleTreeView>
    </Box>
  );
}
