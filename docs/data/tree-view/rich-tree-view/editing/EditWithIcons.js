import * as React from 'react';

import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';

import { TreeItem2, TreeItem2Label } from '@mui/x-tree-view/TreeItem2';

import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import { TreeItem2LabelInput } from '@mui/x-tree-view/TreeItem2/TreeItem2';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

const MUI_X_PRODUCTS = [
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

function CustomLabel({ editing, editable, children, toggleItemEditing, ...other }) {
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
}) {
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

const CustomTreeItem2 = React.forwardRef(function MyTreeItem(props, ref) {
  const {
    interactions: { resetLabelInputValue, setLabelInputValue, toggleItemEditing },
    status,
  } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
    label: props.label,
  });
  const handleContentDoubleClick = (event) => {
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
          apiRef.current.getItemOrderedChildrenIds(item.id).length === 0
        }
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}
