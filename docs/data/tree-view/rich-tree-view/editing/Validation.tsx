import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { UseTreeItemLabelInputSlotOwnProps } from '@mui/x-tree-view/useTreeItem';
import { TreeItemLabelInput } from '@mui/x-tree-view/TreeItemLabelInput';
import { MUI_X_PRODUCTS } from './products';

const ERRORS = {
  REQUIRED: 'The label cannot be empty',
  INVALID: 'The label cannot contain digits',
};

interface CustomLabelInputProps extends UseTreeItemLabelInputSlotOwnProps {
  error: null | keyof typeof ERRORS;
}

function CustomLabelInput(props: Omit<CustomLabelInputProps, 'ref'>) {
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

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const [error, setError] = React.useState<null | keyof typeof ERRORS>(null);
  const { interactions } = useTreeItemUtils({
    itemId: props.itemId,
    children: props.children,
  });
  const validateLabel = (label: string) => {
    if (!label) {
      setError('REQUIRED');
    } else if (/\d/.test(label)) {
      setError('INVALID');
    } else {
      setError(null);
    }
  };

  const handleInputBlur: UseTreeItemLabelInputSlotOwnProps['onBlur'] = (event) => {
    if (error) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleInputKeyDown: UseTreeItemLabelInputSlotOwnProps['onKeyDown'] = (
    event,
  ) => {
    event.defaultMuiPrevented = true;
    const target = event.target as HTMLInputElement;

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        } as CustomLabelInputProps,
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
