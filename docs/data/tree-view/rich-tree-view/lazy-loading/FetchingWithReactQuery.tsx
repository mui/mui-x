import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import {
  randomInt,
  randomName,
  randomId,
  randomBoolean,
} from '@mui/x-data-grid-generator';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

type ItemType = {
  id: string;
  label: string;
  childrenCount?: number;
  children?: ItemType[];
};

const items: ItemType[] = [];

const fetchData = async (_parentId?: string): Promise<ItemType[]> => {
  const length: number = randomInt(5, 10);
  const rows = Array.from({ length }, () => ({
    id: randomId(),
    label: randomName({}, {}),
    ...(randomBoolean() ? { childrenCount: length } : {}),
  }));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rows);
    }, 1000);
  });
};

export function FetchChildren() {
  const myQueryClient = useQueryClient();

  const fetchTreeItems = async (parentId?: string) => {
    const queryKey = parentId ? ['treeItems', parentId] : ['treeItems', 'root'];
    const data = await myQueryClient.fetchQuery({
      queryKey,
      queryFn: () => fetchData(parentId),
    });
    return data;
  };

  return (
    <div style={{ width: 300, height: 240 }}>
      <RichTreeViewPro
        items={items}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems: fetchTreeItems,
        }}
      />
    </div>
  );
}

export default function FetchingWithReactQuery() {
  return (
    <QueryClientProvider client={queryClient}>
      <FetchChildren />
    </QueryClientProvider>
  );
}
