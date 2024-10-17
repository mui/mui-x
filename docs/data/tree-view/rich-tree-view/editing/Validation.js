import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

import { TreeItemLabelInput } from '@mui/x-tree-view/TreeItemLabelInput';
import { MUI_X_PRODUCTS } from './products';

const ERRORS = {
  REQUIRED: 'The label cannot be empty',
  INVALID: 'The label cannot contain digits',
};

function CustomLabelInput(props) {
  const { error, ...other } = props;

  return (
    <React.Fragment>
      <TreeItemLabelInput {...other} />
      {error ? (
        <Tooltip title={ERRORS[error]}>
          <ErrorOutlineIcon color="error" />
        </Tooltip>
      ) : (
        <Tooltip title="All good!">
          <CheckCircleOutlineIcon color="success" />
        </Tooltip>
      )}
    </React.Fragment>
  );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const [error, setError] = React.useState(null);
  const { interactions } = useTreeItemUtils({
    itemId: props.itemId,
    children: props.children,
  });
  const validateLabel = (label) => {
    if (!label) {
      setError('REQUIRED');
    } else if (/\d/.test(label)) {
      setError('INVALID');
    } else {
      setError(null);
    }
  };

  const handleInputBlur = (event) => {
    if (error) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleInputKeyDown = (event) => {
    event.defaultMuiPrevented = true;
    const target = event.target;

    if (event.key === 'Enter' && target.value) {
      if (error) {
        return;
      }
      setError(null);
      interactions.handleSaveItemLabel(event, target.value);
    } else if (event.key === 'Escape') {
      setError(null);
      interactions.handleCancelItemLabelEditing(event);
    }
  };

  const handleInputChange = (event) => {
    validateLabel(event.target.value);
  };

  return (
    <TreeItem
      {...props}
      ref={ref}
      slots={{ labelInput: CustomLabelInput }}
      slotProps={{
        labelInput: {
          onBlur: handleInputBlur,
          onKeyDown: handleInputKeyDown,
          onChange: handleInputChange,
          error,
        },
      }}
    />
  );
});

export default function Validation() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 260 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
        isItemEditable
        experimentalFeatures={{ labelEditing: true }}
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}
