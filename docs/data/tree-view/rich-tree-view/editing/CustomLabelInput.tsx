import * as React from 'react';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  TreeItem2,
  TreeItem2Label,
  TreeItem2Props,
} from '@mui/x-tree-view/TreeItem2';
import {
  UseTreeItem2LabelInputSlotProps,
  UseTreeItem2LabelSlotProps,
} from '@mui/x-tree-view/useTreeItem2/useTreeItem2.types';
import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2/useTreeItem2';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks/useTreeItem2Utils';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { EMPLOYEES, Employee } from './employees';

function Label({ children, ...other }: UseTreeItem2LabelSlotProps) {
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
    </TreeItem2Label>
  );
}

type CustomLabelInputProps = UseTreeItem2LabelInputSlotProps<{
  handleCancelItemLabelEditing: (event: React.SyntheticEvent) => void;
  handleSaveItemLabel: (event: React.SyntheticEvent, label: string) => void;
  item: TreeViewBaseItem<Employee>;
}>;

function LabelInput({
  item,
  handleCancelItemLabelEditing,
  handleSaveItemLabel,
}: Omit<CustomLabelInputProps, 'ref'>) {
  const [initialNameValue, setInitialNameValue] = React.useState({
    firstName: item.firstName,
    lastName: item.lastName,
  });
  const [nameValue, setNameValue] = React.useState({
    firstName: item.firstName,
    lastName: item.lastName,
  });

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue((prev) => ({ ...prev, firstName: event.target.value }));
  };
  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue((prev) => ({ ...prev, lastName: event.target.value }));
  };

  const reset = () => {
    setNameValue(initialNameValue);
  };
  const save = () => {
    setInitialNameValue(nameValue);
  };

  return (
    <React.Fragment>
      <input
        onChange={handleFirstNameChange}
        value={nameValue.firstName as string}
        autoFocus
        type="text"
      />
      <input
        onChange={handleLastNameChange}
        value={nameValue.lastName as string}
        type="text"
      />
      <IconButton
        color="success"
        size="small"
        onClick={(event: React.MouseEvent) => {
          handleSaveItemLabel(event, `${nameValue.firstName} ${nameValue.lastName}`);
          save();
        }}
      >
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton
        color="error"
        size="small"
        onClick={(event: React.MouseEvent) => {
          handleCancelItemLabelEditing(event);
          reset();
        }}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
}

const CustomTreeItem2 = React.forwardRef(function CustomTreeItem2(
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>,
) {
  const {
    interactions: { handleCancelItemLabelEditing, handleSaveItemLabel },
  } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });
  const { publicAPI } = useTreeItem2(props);

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
      slots={{ label: Label, labelInput: LabelInput }}
      slotProps={{
        labelInput: {
          item: publicAPI.getItem(props.itemId),
          onBlur: handleInputBlur,
          onKeyDown: handleInputKeyDown,
          handleCancelItemLabelEditing,
          handleSaveItemLabel,
        } as any,
      }}
    />
  );
});

export default function CustomLabelInput() {
  return (
    <Box sx={{ minHeight: 224, minWidth: 260 }}>
      <RichTreeView
        items={EMPLOYEES}
        slots={{ item: CustomTreeItem2 }}
        isItemEditable={(item) => Boolean(item?.editable)}
        defaultExpandedItems={['1', '2']}
        getItemLabel={(item) => `${item.firstName} ${item.lastName}`}
      />
    </Box>
  );
}
