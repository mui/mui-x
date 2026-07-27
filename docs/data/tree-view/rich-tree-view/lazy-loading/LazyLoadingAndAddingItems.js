import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { useRichTreeViewProApiRef } from '@mui/x-tree-view-pro/hooks';

import { DataSourceCacheDefault } from '@mui/x-tree-view/utils';

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
  getChildrenCount: (item) => item?.childrenCount,
  getTreeItems: fetchData,
};

export default function LazyLoadingAndAddingItems() {
  const apiRef = useRichTreeViewProApiRef();
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [loadedItems, setLoadedItems] = React.useState([]);

  // Only add items to a parent whose children are known: an item that was already expanded (loaded),
  // or a leaf that has none. Adding to a not-yet-loaded item would be overridden by the fetch on expansion.
  const isLeaf =
    selectedItem != null &&
    apiRef.current?.getItem(selectedItem)?.childrenCount === 0;
  const canAddItem =
    selectedItem != null && (isLeaf || loadedItems.includes(selectedItem));

  const addItem = (parentId) => {
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
          onItemsLazyLoaded={({ parentId }) =>
            setLoadedItems((prev) => (parentId == null ? prev : [...prev, parentId]))
          }
          dataSource={dataSource}
          dataSourceCache={customCache}
        />
      </Box>
    </Stack>
  );
}
