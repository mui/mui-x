import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AdjustIcon from '@mui/icons-material/Adjust';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';
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
          experimentalFeatures={{
            labelEditing: true,
          }}
        />
      </Box>
      <StatusLegend />
    </Stack>
  );
}
