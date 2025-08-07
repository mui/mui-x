---
productId: x-tree-view
title: Rich Tree View - Lazy loading
components: RichTreeViewPro, TreeItem
packageName: '@mui/x-tree-view-pro'
githubLabel: 'scope: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Lazy loading [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Lazy load the data from your Tree View.

## Basic usage

To dynamically load data from the server, including lazy-loading of children, you must create a data source and pass the dataSource prop to the Rich Tree View.

The data source also requires the `getChildrenCount()` attribute to handle tree data:

`getChildrenCount()`: Returns the number of children for the item. If the children count is not available for some reason, but there are some children, returns -1.

The `items` prop serves as an initial state.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  randomInt,
  randomName,
  randomId,
  randomBoolean,
} from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { initialItems, ItemType } from './items';

const fetchData = async (): Promise<ItemType[]> => {
  const length: number = randomInt(2, 10);
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

export default function LazyLoadingInitialState() {
  return (
    <Box sx={{ width: '300px' }}>
      <RichTreeViewPro
        items={initialItems}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems: fetchData,
        }}
      />
    </Box>
  );
}

```

If you want to dynamically load all items of the Tree View, you can pass and empty array to the `items` prop, and the `getTreeItems` method will be called on the first render.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import {
  randomInt,
  randomName,
  randomId,
  randomBoolean,
} from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

type ItemType = TreeViewBaseItem<{
  id: string;
  label: string;
  childrenCount?: number;
}>;

function getSliderAriaValueText(value: number) {
  return `${value}°C`;
}

export default function BasicLazyLoading() {
  const [latency, setLatency] = React.useState(1000);

  const handleSliderChange = (_event: Event, newLatency: number | number[]) => {
    setLatency(newLatency as number);
  };

  const fetchData = async (): Promise<ItemType[]> => {
    const length: number = randomInt(5, 10);
    const rows = Array.from({ length }, () => ({
      id: randomId(),
      label: randomName({}, {}),
      ...(randomBoolean() ? { childrenCount: length } : {}),
    }));

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(rows);
      }, latency);
    });
  };

  return (
    <Box sx={{ width: '300px' }}>
      <Box sx={{ width: 250 }}>
        <Typography id="latency-slider" gutterBottom>
          Loading latency: {latency} (ms)
        </Typography>
        <Slider
          value={latency}
          onChange={handleSliderChange}
          aria-labelledby="latency-slider"
          min={500}
          max={10000}
          shiftStep={1000}
          step={500}
          marks
          getAriaValueText={getSliderAriaValueText}
          valueLabelDisplay="auto"
        />
      </Box>
      <RichTreeViewPro
        items={[]}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems: fetchData,
        }}
      />
    </Box>
  );
}

```

### Using react-query

The following demo uses `fetchQuery` from `react-query` to load data.

```tsx
import * as React from 'react';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import {
  randomInt,
  randomName,
  randomId,
  randomBoolean,
} from '@mui/x-data-grid-generator';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

type ItemType = TreeViewBaseItem<{
  id: string;
  label: string;
  childrenCount?: number;
}>;

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
    <RichTreeViewPro
      items={items}
      dataSource={{
        getChildrenCount: (item) => item?.childrenCount as number,
        getTreeItems: fetchTreeItems,
      }}
    />
  );
}

export default function FetchingWithReactQuery() {
  return (
    <QueryClientProvider client={queryClient}>
      <FetchChildren />
    </QueryClientProvider>
  );
}

```

## Data caching

### Custom cache

To provide a custom cache, use `dataSourceCache` prop, which could be either written from scratch or based on another cache library.
This prop accepts a generic interface of type `DataSourceCache`.

The following demo uses `QueryClient` from `react-query` as a data source cache.

```tsx
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

```

### Customize the cache lifetime

The `DataSourceCacheDefault` has a default Time To Live (`ttl`) of 5 minutes. To customize it, pass the ttl option in milliseconds to the `DataSourceCacheDefault` constructor, and then pass it as the `dataSourceCache` prop.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { randomInt, randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { DataSourceCacheDefault } from '@mui/x-tree-view/utils';

const fetchData = async (): Promise<
  TreeViewBaseItem<{
    id: string;
    label: string;
    childrenCount?: number;
  }>[]
> => {
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

const lowTTLCache = new DataSourceCacheDefault({ ttl: 1000 * 10 }); // 10 seconds

export default function LowTTLCache() {
  return (
    <Box sx={{ width: '300px' }}>
      <RichTreeViewPro
        items={[]}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems: fetchData,
        }}
        dataSourceCache={lowTTLCache}
      />
    </Box>
  );
}

```

## Error management

```tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { initialItems, ItemType } from './items';

export default function ErrorManagement() {
  const [failRequests, setFailRequests] = React.useState(false);
  const fetchData = async (): Promise<ItemType[]> => {
    const rows = Array.from({ length: 10 }, () => ({
      id: randomId(),
      label: randomName({}, {}),
      childrenCount: 10,
    }));

    // make the promise fail conditionally
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (failRequests) {
          reject(new Error('Error fetching data'));
        } else {
          resolve(rows);
        }
      }, 1000);
    });
  };

  return (
    <Stack spacing={2} sx={{ width: '300px' }}>
      <Button
        onClick={() => setFailRequests((prev) => !prev)}
        variant="outlined"
        fullWidth
      >
        {failRequests ? 'Resolve requests' : 'Fail Requests'}
      </Button>
      <RichTreeViewPro
        items={initialItems}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems: fetchData,
        }}
      />
    </Stack>
  );
}

```

## Lazy loading and label editing

To store the updated item labels on your server use the `onItemLabelChange` callback function.

Changes to the label are not automatically updated in the `dataSourceCache` and will need to be updated manually. The demo below shows you how to update the cache once a label is changed so the changes are reflected in the tree.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { randomInt, randomName, randomId } from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';
import { DataSourceCacheDefault } from '@mui/x-tree-view/utils';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

const fetchData = async (): Promise<
  TreeViewBaseItem<{
    id: string;
    label: string;
    childrenCount?: number;
  }>[]
> => {
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
  const apiRef = useTreeViewApiRef();

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
    <Box sx={{ width: '300px' }}>
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
    </Box>
  );
}

```
