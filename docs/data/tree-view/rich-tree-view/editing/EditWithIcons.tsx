import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem2Utils, useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { UseTreeItem2ContentSlotOwnProps } from '@mui/x-tree-view/useTreeItem2';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import {
  TreeItem2,
  TreeItem2Label,
  TreeItem2Props,
} from '@mui/x-tree-view/TreeItem2';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import { TreeItem2LabelInput } from '@mui/x-tree-view/TreeItem2/TreeItem2';

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

function CustomLabel({
  editing,
  editable,
  children,
  toggleItemEditing,
  ...other
}: any) {
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

function CustomLabelInput({
  editing,
  resetLabelInputValue,
  setLabelInputValue,
  ...other
}: any) {
  if (!editing) {
    return null;
  }

  return (
    <React.Fragment>
      <TreeItem2LabelInput {...other} />
      <IconButton onClick={resetLabelInputValue}>
        <EditOffIcon />
      </IconButton>
      <IconButton onClick={setLabelInputValue}>
        <EditOffIcon />
      </IconButton>
    </React.Fragment>
  );
}

const CustomTreeItem2 = React.forwardRef(function MyTreeItem(
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>,
) {
  const {
    interactions: { resetLabelInputValue, setLabelInputValue, toggleItemEditing },
    status,
  } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
    label: props.label as string,
  });
  const handleContentDoubleClick: UseTreeItem2ContentSlotOwnProps['onDoubleClick'] =
    (event) => {
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
        },
        labelInput: {
          editing: status.editing,
          resetLabelInputValue,
          setLabelInputValue,
        },
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
        slots={{ item: CustomTreeItem2 }}
        apiRef={apiRef}
        isItemEditable={(item) =>
          apiRef.current!.getItemOrderedChildrenIds(item.id).length === 0
        }
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}
