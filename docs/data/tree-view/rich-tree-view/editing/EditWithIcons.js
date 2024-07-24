import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';
import { TreeItem2, TreeItem2Label } from '@mui/x-tree-view/TreeItem2';
import { IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckIcon from '@mui/icons-material/Check';
import { TreeItem2LabelInput } from '@mui/x-tree-view/TreeItem2/TreeItem2';

import { MUI_X_PRODUCTS } from './products';

function CustomLabel({ editing, editable, children, toggleItemEditing, ...other }) {
  return (
    <TreeItem2Label
      {...other}
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
    </TreeItem2Label>
  );
}

const CustomLabelInput = function CustomLabelInput(props) {
  const { handleCancelItemLabelEditing, handleSaveItemLabel, label, ...other } =
    props;
  const [labelInputValue, setLabelInputValue] = React.useState(label);

  return (
    <React.Fragment>
      <TreeItem2LabelInput
        {...other}
        label={label}
        onChange={(event) => {
          setLabelInputValue(event.target.value);
        }}
      />
      <IconButton
        color="success"
        size="small"
        onClick={(event) => {
          handleSaveItemLabel(event, labelInputValue);
        }}
      >
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton color="error" size="small" onClick={handleCancelItemLabelEditing}>
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
};

const CustomTreeItem2 = React.forwardRef(function CustomTreeItem2(props, ref) {
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

  const handleContentDoubleClick = (event) => {
    event.defaultMuiPrevented = true;
  };

  const handleInputBlur = (event) => {
    event.defaultMuiPrevented = true;
    event.stopPropagation();
  };

  const handleInputKeyDown = (event) => {
    event.defaultMuiPrevented = true;
  };

  return (
    <TreeItem2
      {...props}
      ref={ref}
      slots={{ label: CustomLabel, labelInput: CustomLabelInput }}
      slotProps={{
        label: {
          onDoubleClick: handleContentDoubleClick,
          editable: status.editable,
          editing: status.editing,
          toggleItemEditing,
        },
        labelInput: {
          onBlur: handleInputBlur,
          onKeyDown: handleInputKeyDown,
          handleCancelItemLabelEditing,
          handleSaveItemLabel,
        },
      }}
    />
  );
});

export default function EditWithIcons() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem2 }}
        isItemEditable={(item) => Boolean(item?.editable)}
        defaultExpandedItems={['grid', 'pickers']}
        expansionTrigger="iconContainer"
      />
    </Box>
  );
}
