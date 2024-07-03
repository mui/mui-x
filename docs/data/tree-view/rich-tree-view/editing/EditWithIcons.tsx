import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';
import { UseTreeItem2ContentSlotOwnProps } from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2,
  TreeItem2Label,
  TreeItem2Props,
} from '@mui/x-tree-view/TreeItem2';
import { IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckIcon from '@mui/icons-material/Check';
import { TreeItem2LabelInput } from '@mui/x-tree-view/TreeItem2/TreeItem2';
import {
  UseTreeItem2LabelInputSlotProps,
  UseTreeItem2LabelSlotProps,
} from '@mui/x-tree-view/useTreeItem2/useTreeItem2.types';
import { MUI_X_PRODUCTS } from './products';

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
      <IconButton
        color="error"
        size="small"
        onClick={(event: React.MouseEvent) => {
          handleSaveItemLabel(event, labelInputValue);
        }}
      >
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton
        color="success"
        size="small"
        onClick={handleCancelItemLabelEditing}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
});

const CustomTreeItem2 = React.forwardRef(function MyTreeItem(
  props: TreeItem2Props,
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
  return (
    <Box sx={{ minHeight: 200, flexGrow: 1, maxWidth: 400 }}>
      <RichTreeView
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem2 }}
        isItemEditable={(item) => Boolean(item?.editable)}
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}
