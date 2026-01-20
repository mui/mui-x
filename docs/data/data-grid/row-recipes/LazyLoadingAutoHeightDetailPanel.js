import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {
  randomEmail,
  randomInt,
  randomCommodity,
  randomPrice,
  randomTraderName,
  randomId,
} from '@mui/x-data-grid-generator';
import { DataGridPro } from '@mui/x-data-grid-pro';

const DetailPanelDataCache = React.createContext(new Map());

async function getProducts(orderId) {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  const quantity = randomInt(30, 50);
  return [...Array(quantity)].map((_, index) => ({
    id: index,
    orderId,
    name: randomCommodity(),
    quantity: randomInt(1, 5),
    unitPrice: randomPrice(1, 1000),
  }));
}

// Wrapper component that tracks detail panel height via ResizeObserver

function DetailPanelWrapper({ rowId, onHeightChange, children }) {
  const ref = React.useRef(null);
  const isLoadedRef = React.useRef(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) {
      return () => {};
    }

    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      if (height > 0) {
        onHeightChange(rowId, height, isLoadedRef.current);
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [rowId, onHeightChange]);

  const handleLoaded = React.useCallback(() => {
    isLoadedRef.current = true;
  }, []);

  const childrenWithLoaded = React.isValidElement(children)
    ? React.cloneElement(children, { onLoaded: handleLoaded })
    : children;

  return <div ref={ref}>{childrenWithLoaded}</div>;
}

function DetailPanelContent({ row: rowProp, onLoaded }) {
  const [isLoading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState([]);

  const detailPanelDataCache = React.useContext(DetailPanelDataCache);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!detailPanelDataCache.has(rowProp.id)) {
        console.log('fetching detail panel content for row', rowProp.id);
        const response = await getProducts(rowProp.id);
        // Store the data in cache so that when detail panel unmounts due to virtualization, the data is not lost
        detailPanelDataCache.set(rowProp.id, response);
      }

      const result = detailPanelDataCache.get(rowProp.id);

      if (!isMounted) {
        return;
      }

      setProducts(result);
      setLoading(false);
      onLoaded?.();
    })();

    return () => {
      isMounted = false;
    };
  }, [rowProp.id, detailPanelDataCache, onLoaded]);

  return (
    <Stack
      sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">{`Order #${rowProp.id}`}</Typography>
          <DataGridPro
            density="compact"
            loading={isLoading}
            columns={[
              { field: 'name', headerName: 'Product', flex: 1 },
              {
                field: 'quantity',
                headerName: 'Quantity',
                align: 'center',
                type: 'number',
              },
              { field: 'unitPrice', headerName: 'Unit Price', type: 'number' },
              {
                field: 'total',
                headerName: 'Total',
                type: 'number',
                valueGetter: (value, row) => row.quantity * row.unitPrice,
              },
            ]}
            rows={products}
            sx={{ flex: 1 }}
            hideFooter
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

const columns = [
  { field: 'customer', headerName: 'Customer', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
];

function getRow() {
  return {
    id: randomId(),
    customer: randomTraderName(),
    email: randomEmail(),
  };
}

const rows = [];
for (let i = 0; i < 30; i += 1) {
  rows.push(getRow());
}

export default function LazyLoadingAutoHeightDetailPanel() {
  const detailPanelDataCache = React.useRef(new Map()).current;

  // Height cache for detail panels - prevents scroll jumps when panels remount
  const [detailPanelHeights, setDetailPanelHeights] = React.useState(new Map());

  // Height change handler - if the grid is not loaded yet, ignore reduction of the height to prevent scroll jumps.
  // Once the content is loaded, accept all height changes including reductions (e.g., from filtering).
  const handleDetailPanelHeightChange = React.useCallback(
    (rowId, height, isLoaded) => {
      setDetailPanelHeights((prev) => {
        const currentHeight = prev.get(rowId);
        if (!isLoaded && currentHeight !== undefined && height <= currentHeight) {
          return prev;
        }
        const next = new Map(prev);
        next.set(rowId, height);
        return next;
      });
    },
    [],
  );

  const handleDetailPanelExpansionChange = React.useCallback(
    (newExpandedRowIds) => {
      // Only keep cached data for detail panels that are still expanded
      for (const [id] of detailPanelDataCache) {
        if (!newExpandedRowIds.has(id)) {
          detailPanelDataCache.delete(id);
        }
      }

      // Clear height cache for closed panels
      setDetailPanelHeights((prev) => {
        const next = new Map(prev);
        let changed = false;
        for (const rowId of prev.keys()) {
          if (!newExpandedRowIds.has(rowId)) {
            next.delete(rowId);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    },
    [detailPanelDataCache],
  );

  const getDetailPanelContent = React.useCallback(
    (params) => (
      <DetailPanelWrapper
        rowId={params.row.id}
        onHeightChange={handleDetailPanelHeightChange}
      >
        <DetailPanelContent row={params.row} />
      </DetailPanelWrapper>
    ),
    [handleDetailPanelHeightChange],
  );

  const getDetailPanelHeight = React.useCallback(
    (params) => {
      const cachedHeight = detailPanelHeights.get(params.row.id);
      return cachedHeight ?? 'auto';
    },
    [detailPanelHeights],
  );

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DetailPanelDataCache.Provider value={detailPanelDataCache}>
        <DataGridPro
          columns={columns}
          rows={rows}
          getDetailPanelHeight={getDetailPanelHeight}
          getDetailPanelContent={getDetailPanelContent}
          onDetailPanelExpandedRowIdsChange={handleDetailPanelExpansionChange}
        />
      </DetailPanelDataCache.Provider>
    </Box>
  );
}
