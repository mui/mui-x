import * as React from 'react';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import {
  randomInt,
  randomName,
  randomId,
  randomBoolean,
} from '@mui/x-data-grid-generator';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    },
  },
});

const cache = {
  set: (key, value) => {
    queryClient.setQueryData([key], value);
  },
  get: (key) => {
    return queryClient.getQueryData([key]);
  },
  clear: () => {
    queryClient.clear();
  },
};

const fetchData = async (_parentId) => {
  const length = randomInt(5, 10);
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
      experimentalFeatures={{ lazyLoading: true }}
      dataSource={{
        getChildrenCount: (item) => item?.childrenCount,
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
