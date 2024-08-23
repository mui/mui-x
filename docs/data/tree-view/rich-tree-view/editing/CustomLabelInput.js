import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { TreeItem2, TreeItem2Label } from '@mui/x-tree-view/TreeItem2';
import { unstable_useTreeItem2 as useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';

const StyledLabelInput = styled('input')(({ theme }) => ({
  ...theme.typography.body1,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: 'none',
  padding: '0 2px',
  boxSizing: 'border-box',
  width: 100,
  '&:focus': {
    outline: `1px solid ${theme.palette.primary.main}`,
  },
}));

export const ITEMS = [
  {
    id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    editable: true,
    children: [
      { id: '1.1', firstName: 'Elena', lastName: 'Kim', editable: true },
      { id: '1.2', firstName: 'Noah', lastName: 'Rodriguez', editable: true },
      { id: '1.3', firstName: 'Maya', lastName: 'Patel', editable: true },
    ],
  },
  {
    id: '2',
    firstName: 'Liam',
    lastName: 'Clarke',
    editable: true,
    children: [
      {
        id: '2.1',
        firstName: 'Ethan',
        lastName: 'Lee',
        editable: true,
      },
      { id: '2.2', firstName: 'Ava', lastName: 'Jones', editable: true },
    ],
  },
];

function Label({ children, ...other }) {
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        justifyContent: 'space-between',
        minHeight: 30,
      }}
    >
      {children}
    </TreeItem2Label>
  );
}

const LabelInput = React.forwardRef(function LabelInput(
  { item, handleCancelItemLabelEditing, handleSaveItemLabel, ...props },
  ref,
) {
  const [initialNameValue, setInitialNameValue] = React.useState({
    firstName: item.firstName,
    lastName: item.lastName,
  });
  const [nameValue, setNameValue] = React.useState({
    firstName: item.firstName,
    lastName: item.lastName,
  });

  const handleFirstNameChange = (event) => {
    setNameValue((prev) => ({ ...prev, firstName: event.target.value }));
  };
  const handleLastNameChange = (event) => {
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
      <StyledLabelInput
        {...props}
        onChange={handleFirstNameChange}
        value={nameValue.firstName}
        autoFocus
        type="text"
        ref={ref}
      />
      <StyledLabelInput
        {...props}
        onChange={handleLastNameChange}
        value={nameValue.lastName}
        type="text"
        ref={ref}
      />
      <IconButton
        color="success"
        size="small"
        onClick={(event) => {
          handleSaveItemLabel(event, `${nameValue.firstName} ${nameValue.lastName}`);
          save();
        }}
      >
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton
        color="error"
        size="small"
        onClick={(event) => {
          handleCancelItemLabelEditing(event);
          reset();
        }}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
});

const CustomTreeItem2 = React.forwardRef(function CustomTreeItem2(props, ref) {
  const { interactions } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });
  const { publicAPI } = useTreeItem2(props);

  const handleInputBlur = (event) => {
    event.defaultMuiPrevented = true;
  };

  const handleInputKeyDown = (event) => {
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
          handleCancelItemLabelEditing: interactions.handleCancelItemLabelEditing,
          handleSaveItemLabel: interactions.handleSaveItemLabel,
        },
      }}
    />
  );
});

export default function CustomLabelInput() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 340 }}>
      <RichTreeView
        items={ITEMS}
        slots={{ item: CustomTreeItem2 }}
        experimentalFeatures={{ labelEditing: true }}
        isItemEditable
        defaultExpandedItems={['1', '2']}
        getItemLabel={(item) => `${item.firstName} ${item.lastName}`}
      />
    </Box>
  );
}
