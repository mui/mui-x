import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { useRichTreeViewProApiRef } from '@mui/x-tree-view-pro/hooks';
import { TreeViewItemId } from '@mui/x-tree-view/models';
import { DataSourceCacheDefault } from '@mui/x-tree-view/utils';

type ItemType = {
  id: string;
  label: string;
  childrenCount?: number;
  children?: ItemType[];
};

const fetchData = async (): Promise<ItemType[]> => {
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

const EMPTY_ITEMS: ItemType[] = [];

const dataSource = {
  getChildrenCount: (item: ItemType) => item?.childrenCount as number,
  getTreeItems: fetchData,
};

export default function LazyLoadingAndAddingItems() {
  const apiRef = useRichTreeViewProApiRef();
  const [selectedItem, setSelectedItem] = React.useState<TreeViewItemId | null>(
    null,
  );
  const [loadedItems, setLoadedItems] = React.useState<TreeViewItemId[]>([]);

  // The children of an item are only loaded once it has been expanded,
  // adding an item before that would be overridden by the fetch triggered on expansion.
  const canAddItem = selectedItem != null && loadedItems.includes(selectedItem);

  const addItem = (parentId: TreeViewItemId) => {
    const newItem = { id: randomId(), label: 'New item', childrenCount: 0 };
    apiRef.current!.addItems({ items: [newItem], parentId });

    // The new item is only stored in the internal state of the component,
    // add it to the cache so that it survives a collapse / expand of its parent.
    const cachedChildren = customCache.get(parentId);
    if (Array.isArray(cachedChildren)) {
      customCache.set(parentId, [...cachedChildren, newItem]);
    }
  };

  return (
    <Stack spacing={2}>
      <Button onClick={() => addItem(selectedItem!)} disabled={!canAddItem}>
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
