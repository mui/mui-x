import { randomInt, randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { TreeViewItemId } from '@mui/x-tree-view/models';
import { DataSourceCacheDefault } from '@mui/x-tree-view/utils';
import { useRichTreeViewProApiRef } from '@mui/x-tree-view-pro/hooks';

type ItemType = {
  id: string;
  label: string;
  childrenCount?: number;
  children?: ItemType[];
};

const fetchData = async (): Promise<ItemType[]> => {
  const rows = Array.from({ length: 10 }, () => ({
    id: randomId(),
    label: randomName({}, {}),
    ...(randomInt(0, 1) ? { childrenCount: 10 } : {}),
  }));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rows);
    }, 1000);
  });
};

const customCache = new DataSourceCacheDefault({}); // 10 seconds

export default function LazyLoadingAndLabelEditing() {
  const apiRef = useRichTreeViewProApiRef();

  const handleItemLabelChange = (itemId: TreeViewItemId, newLabel: string) => {
    const parentId = apiRef.current?.getParentId(itemId) || 'root';

    const cachedData = customCache.get(parentId);
    if (cachedData !== undefined && cachedData !== -1) {
      const newCache = cachedData.map((item) => {
        const newItem = item;
        if (item.id === itemId) {
          newItem.label = newLabel;
        }

        return newItem;
      });
      customCache.set(parentId, newCache);
    }
  };

  return (
    <div style={{ width: 300, height: 240 }}>
      <RichTreeViewPro
        items={[]}
        apiRef={apiRef}
        onItemLabelChange={handleItemLabelChange}
        isItemEditable
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems: fetchData,
        }}
        dataSourceCache={customCache}
      />
    </div>
  );
}
