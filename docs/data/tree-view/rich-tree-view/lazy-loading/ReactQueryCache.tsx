import * as React from 'react';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import {
  randomInt,
  randomName,
  randomId,
  randomBoolean,
} from '@mui/x-data-grid-generator';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataSourceCache } from '@mui/x-tree-view/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    },
  },
});

const cache: DataSourceCache = {
  set: (key: string, value) => {
    queryClient.setQueryData([key], value);
  },
  get: (key: string) => {
    return queryClient.getQueryData([key]);
  },
  clear: () => {
    queryClient.clear();
  },
};

type ItemType = TreeViewBaseItem<{
  id: string;
  label: string;
  childrenCount?: number;
}>;
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
  return (
    <RichTreeViewPro
      items={[]}
      dataSource={{
        getChildrenCount: (item) => item?.childrenCount as number,
        getTreeItems: fetchData,
      }}
      dataSourceCache={cache}
    />
  );
}

export default function ReactQueryCache() {
  return (
    <QueryClientProvider client={queryClient}>
      <FetchChildren />
    </QueryClientProvider>
  );
}
