import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { randomId, randomName } from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { useRichTreeViewProApiRef } from '@mui/x-tree-view-pro/hooks';

import { DataSourceCacheDefault } from '@mui/x-tree-view/utils';
import * as React from 'react';

const fetchData = async () => {
  const items = Array.from({ length: 5 }, (_, index) => ({
    id: randomId(),
    label: randomName({}, {}),
    childrenCount: index < 2 ? 5 : 0,
  }));

  return new Promise((resolve) => {
    setTimeout(() => resolve(items), 500);
  });
};

const customCache = new DataSourceCacheDefault({});

const EMPTY_ITEMS = [];

const dataSource = {
  getChildrenCount: (item) => item?.childrenCount || 0,
  getTreeItems: fetchData,
};

export default function LazyLoadingAndAddingItems() {
  const apiRef = useRichTreeViewProApiRef();
  const [selectedItem, setSelectedItem] = React.useState(null);

  const [isLoading, setIsLoading] = React.useState(false);

  const canAddItem = selectedItem != null && !isLoading;

  const addItem = async (parentId) => {
    // Load the children before adding, otherwise the fetch triggered when the parent is later
    // expanded would override the item we are about to add and conflict on its id.
    const parent = apiRef.current.getItem(parentId);
    if (parent?.childrenCount && customCache.get(parentId) === undefined) {
      setIsLoading(true);
      await apiRef.current.updateItemChildren(parentId);
      setIsLoading(false);
    }

    const newItem = { id: randomId(), label: 'New item', childrenCount: 0 };
    apiRef.current.addItems({ items: [newItem], parentId });

    // The new item is only stored in the internal state of the component,
    // add it to the cache so that it survives a collapse / expand of its parent.
    const cachedChildren = customCache.get(parentId);
    customCache.set(parentId, [
      ...(Array.isArray(cachedChildren) ? cachedChildren : []),
      newItem,
    ]);

    // Reveal the new item, the cache entry above prevents the expansion from fetching over it.
    apiRef.current.setItemExpansion({ itemId: parentId, shouldBeExpanded: true });
    apiRef.current.setItemSelection({ itemId: newItem.id, shouldBeSelected: true });
  };

  return (
    <Stack spacing={2}>
      <Button onClick={() => addItem(selectedItem)} disabled={!canAddItem}>
        Add child to selected item
      </Button>
      <Box sx={{ minHeight: 240, minWidth: 300 }}>
        <RichTreeViewPro
          items={EMPTY_ITEMS}
          apiRef={apiRef}
          expansionTrigger="iconContainer"
          selectedItems={selectedItem}
          onSelectedItemsChange={(event, itemId) => setSelectedItem(itemId)}
          dataSource={dataSource}
          dataSourceCache={customCache}
        />
      </Box>
    </Stack>
  );
}
