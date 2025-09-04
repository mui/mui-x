import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useApplyPropagationToSelectedItemsOnMount } from '@mui/x-tree-view/hooks';
import { EMPLOYEES_DATASET } from '../../datasets/employees';

const selectionPropagation = { parents: true, descendants: true };

export default function SelectionPropagationMount() {
  const defaultSelectedItems = useApplyPropagationToSelectedItemsOnMount({
    items: EMPLOYEES_DATASET,
    selectionPropagation,
    selectedItems: ['10', '11', '13', '14'],
  });

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView
        items={EMPLOYEES_DATASET}
        checkboxSelection
        multiSelect
        selectionPropagation={selectionPropagation}
        defaultSelectedItems={defaultSelectedItems}
        defaultExpandedItems={['1', '8', '9', '12']}
      />
    </Box>
  );
}
