import * as React from 'react';
import Box from '@mui/material/Box';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';
import { UseTreeItem2CheckboxSlotOwnProps } from '@mui/x-tree-view/useTreeItem2';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeItem2,
  TreeItem2Props,
  TreeItem2SlotProps,
} from '@mui/x-tree-view/TreeItem2';
import { MUI_X_PRODUCTS } from './products';

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>,
) {
  const { interactions } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });

  const doSomething = () => {
    // Do something when the checkbox is clicked
  };

  const handleCheckboxOnChange: UseTreeItem2CheckboxSlotOwnProps['onChange'] = (
    event,
  ) => {
    event.defaultMuiPrevented = true;
    doSomething();
    interactions.handleCheckboxSelection(event);
  };

  return (
    <TreeItem2
      {...props}
      ref={ref}
      slotProps={
        {
          checkbox: { onChange: handleCheckboxOnChange },
        } as TreeItem2SlotProps
      }
    />
  );
});

export default function HandleCheckboxSelectionDemo() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['grid', 'pickers']}
        checkboxSelection
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}
