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
        experimentalFeatures={{ labelEditing: true }}
        isItemEditable
        defaultExpandedItems={['grid', 'pickers']}
        expansionTrigger="iconContainer"
      />
    </Box>
  );
}
