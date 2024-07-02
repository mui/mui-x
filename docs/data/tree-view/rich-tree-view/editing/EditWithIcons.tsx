import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem2Utils, useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { UseTreeItem2ContentSlotOwnProps } from '@mui/x-tree-view/useTreeItem2';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';
import {
  TreeItem2,
  TreeItem2Label,
  TreeItem2Props,
} from '@mui/x-tree-view/TreeItem2';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import CheckIcon from '@mui/icons-material/Check';
import { TreeItem2LabelInput } from '@mui/x-tree-view/TreeItem2/TreeItem2';
import {
  UseTreeItem2LabelInputSlotProps,
  UseTreeItem2LabelSlotProps,
} from '@mui/x-tree-view/useTreeItem2/useTreeItem2.types';

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
type CustomLabelProps = UseTreeItem2LabelSlotProps<{
  editable: boolean;
  editing: boolean;
  toggleItemEditing: () => void;
}>;

function CustomLabel({
  editing,
  editable,
  children,
  toggleItemEditing,
  ...other
}: CustomLabelProps) {
  return (
    <TreeItem2Label {...other}>
      {children}
      {editable && (
        <IconButton onClick={toggleItemEditing}>
          <EditIcon />
        </IconButton>
      )}
    </TreeItem2Label>
  );
}

type CustomLabelInputProps = UseTreeItem2LabelInputSlotProps<{
  editing: boolean;
  handleCancelItemLabelEditing: (event: React.SyntheticEvent) => void;
  handleSaveItemLabel: (event: React.SyntheticEvent, label: string) => void;
  label: string;
}>;

const CustomLabelInput = React.forwardRef(function CustomLabelInput({
  editing,
  handleCancelItemLabelEditing,
  handleSaveItemLabel,
  label,
  ...other
}: CustomLabelInputProps) {
  const [labelInputValue, setLabelInputValue] = React.useState(label);

  if (!editing) {
    return null;
  }

  return (
    <React.Fragment>
      <TreeItem2LabelInput
        {...other}
        label={label}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLabelInputValue(event.target.value);
        }}
      />
      <IconButton tabIndex={-1} onClick={handleCancelItemLabelEditing}>
        <EditOffIcon />
      </IconButton>
      <IconButton
        onClick={(event: React.MouseEvent) => {
          handleSaveItemLabel(event, labelInputValue);
        }}
      >
        <CheckIcon />
      </IconButton>
    </React.Fragment>
  );
});

interface ExtendedTreeItemProps extends TreeItem2Props {
  focusItem: (event: React.SyntheticEvent, itemId: TreeViewItemId) => void;
  updateItemLabel: (itemId: TreeViewItemId, label: string) => void;
}

const CustomTreeItem2 = React.forwardRef(function MyTreeItem(
  { focusItem, updateItemLabel, ...props }: ExtendedTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const {
    interactions: {
      toggleItemEditing,
      handleCancelItemLabelEditing,
      handleSaveItemLabel,
    },
    status,
  } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });

  const handleContentDoubleClick: UseTreeItem2ContentSlotOwnProps['onDoubleClick'] =
    (event) => {
      event.defaultMuiPrevented = true;
    };

  const handleInputBlur: UseTreeItem2LabelInputSlotProps['onBlur'] = (event) => {
    event.defaultMuiPrevented = true;
    event.stopPropagation();
  };

  const handleInputKeyDown: UseTreeItem2LabelInputSlotProps['onKeyDown'] = (
    event,
  ) => {
    event.defaultMuiPrevented = true;
  };

  return (
    <TreeItem2
      {...props}
      ref={ref}
      slots={{ label: CustomLabel, labelInput: CustomLabelInput }}
      slotProps={{
        content: {
          onDoubleClick: handleContentDoubleClick,
        },
        label: {
          editable: status.editable,
          editing: status.editing,
          toggleItemEditing,
        } as CustomLabelProps,
        labelInput: {
          onBlur: handleInputBlur,
          onKeyDown: handleInputKeyDown,
          editing: status.editing,
          handleCancelItemLabelEditing,
          handleSaveItemLabel,
        } as CustomLabelInputProps,
      }}
    />
  );
});

export default function EditWithIcons() {
  const apiRef = useTreeViewApiRef();

  return (
    <Box sx={{ minHeight: 200, flexGrow: 1, maxWidth: 400 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem2 as any }}
        apiRef={apiRef}
        isItemEditable={(item) =>
          apiRef.current!.getItemOrderedChildrenIds(item.id).length === 0
        }
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}
