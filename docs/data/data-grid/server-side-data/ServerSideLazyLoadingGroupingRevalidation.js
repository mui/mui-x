import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { alpha } from '@mui/material/styles';

const PRICE_ROUNDING_FACTOR = 100;
const STOCKS_PER_INDUSTRY = 18;

const SECTORS = [
  { id: 'tech', name: 'Technology', code: 'TC' },
  { id: 'finance', name: 'Financial Services', code: 'FS' },
  { id: 'energy', name: 'Energy', code: 'EN' },
  { id: 'healthcare', name: 'Healthcare', code: 'HC' },
  { id: 'consumer', name: 'Consumer Discretionary', code: 'CD' },
  { id: 'industrials', name: 'Industrials', code: 'IN' },
  { id: 'utilities', name: 'Utilities', code: 'UT' },
  { id: 'materials', name: 'Materials', code: 'MT' },
  { id: 'real-estate', name: 'Real Estate', code: 'RE' },
  { id: 'communications', name: 'Communications', code: 'CM' },
];

const INDUSTRIES = [
  'Large Cap',
  'Mid Cap',
  'Small Cap',
  'International',
  'High Dividend',
  'Growth',
  'Value',
  'Infrastructure',
];

const getTick = () => Math.floor(Date.now() / 2_000);

function getLeafMetrics(sectorIndex, industryIndex, stockIndex, tick) {
  const seed = sectorIndex * 151 + industryIndex * 43 + stockIndex * 17;
  const basePrice = 35 + (seed % 650);
  const baseVolume =
    800_000 +
    ((sectorIndex * 790_000 + industryIndex * 310_000 + stockIndex * 95_000) %
      48_000_000);
  const drift = Math.sin((tick + seed) * 0.65) * 0.018;
  const volumeDrift = Math.cos((tick + seed) * 0.47) * 0.14;

  return {
    price:
      Math.round(basePrice * (1 + drift) * PRICE_ROUNDING_FACTOR) /
      PRICE_ROUNDING_FACTOR,
    volume: Math.round(baseVolume * (1 + volumeDrift)),
  };
}

function getFlatStockRows(tick) {
  const rows = [];

  SECTORS.forEach((sector, sectorIndex) => {
    INDUSTRIES.forEach((industry, industryIndex) => {
      for (let stockIndex = 0; stockIndex < STOCKS_PER_INDUSTRY; stockIndex += 1) {
        const stockNumber = stockIndex + 1;
        const symbol = `${sector.code}${industryIndex + 1}${stockNumber}`;
        const metrics = getLeafMetrics(
          sectorIndex,
          industryIndex,
          stockNumber,
          tick,
        );

        rows.push({
          id: `stock-${symbol}`,
          name: `${sector.name} ${industry} ${stockNumber}`,
          sector: sector.name,
          industry,
          symbol,
          price: metrics.price,
          volume: metrics.volume,
          childrenCount: 0,
        });
      }
    });
  });

  return rows;
}

function getGroupingValue(row, field) {
  return String(row[field] ?? '');
}

function getGroupRowId(groupFields, groupKeys, groupValue) {
  const path = groupKeys.map((key, index) => `${groupFields[index]}:${key}`);
  path.push(`${groupFields[groupKeys.length]}:${groupValue}`);

  return `group-${path
    .map((part) => part.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase())
    .join('-')}`;
}

function getGroupRowsChildrenCount(rows, groupFields, depth) {
  const nextGroupingField = groupFields[depth];

  if (!nextGroupingField) {
    return rows.length;
  }

  return new Set(rows.map((row) => getGroupingValue(row, nextGroupingField))).size;
}

function getGroupedStockRows(rows, groupFields, groupKeys) {
  const groupingField = groupFields[groupKeys.length];

  if (!groupingField) {
    return rows;
  }

  const groupedRows = new Map();

  rows.forEach((row) => {
    const groupValue = getGroupingValue(row, groupingField);
    const groupRows = groupedRows.get(groupValue);

    if (groupRows) {
      groupRows.push(row);
    } else {
      groupedRows.set(groupValue, [row]);
    }
  });

  return Array.from(groupedRows, ([groupValue, groupRows]) => {
    const priceAccumulator = groupRows.reduce(
      (sum, row) => sum + Number(row.price),
      0,
    );
    const volumeAccumulator = groupRows.reduce(
      (sum, row) => sum + Number(row.volume),
      0,
    );
    const groupingValue = groupRows[0][groupingField];

    return {
      id: getGroupRowId(groupFields, groupKeys, groupValue),
      group: groupValue,
      name: groupValue,
      sector: groupingField === 'sector' ? groupValue : '',
      industry: groupingField === 'industry' ? groupValue : '',
      symbol: groupingField === 'symbol' ? groupValue : '',
      price:
        Math.round((priceAccumulator / groupRows.length) * PRICE_ROUNDING_FACTOR) /
        PRICE_ROUNDING_FACTOR,
      volume: volumeAccumulator,
      childrenCount: getGroupRowsChildrenCount(
        groupRows,
        groupFields,
        groupKeys.length + 1,
      ),
      [groupingField]: groupingValue,
    };
  });
}

function fakeRowGroupingStockServer(params) {
  const tick = getTick();
  const groupFields = params.groupFields ?? [];
  const groupKeys = params.groupKeys ?? [];
  const start = typeof params.start === 'number' ? params.start : 0;
  const end = typeof params.end === 'number' ? params.end : start + 9;

  if (groupKeys.length > groupFields.length) {
    return Promise.resolve({ rows: [], rowCount: 0 });
  }

  const rows = getFlatStockRows(tick).filter((row) =>
    groupKeys.every(
      (key, index) => getGroupingValue(row, groupFields[index]) === key,
    ),
  );
  const groupedRows = getGroupedStockRows(rows, groupFields, groupKeys);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        rows: groupedRows.slice(start, end + 1),
        rowCount: groupedRows.length,
      });
    }, 50);
  });
}

function FlashOnChange({ children, changeId, align = 'left', fontWeight }) {
  const [flash, setFlash] = React.useState(false);

  React.useEffect(() => {
    if (changeId === 0) {
      return undefined;
    }

    setFlash(true);
    const timeout = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(timeout);
  }, [changeId]);

  return (
    <Typography
      variant="body2"
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
          height: '100%',
          paddingRight: '10px',
          paddingLeft: '10px',
          width: '100%',
          fontWeight,
        },
        (theme) => ({
          position: 'relative',
          width: 'calc(100% + 20px)',
          left: '-10px',
          transition: 'background-color 500ms ease',
          backgroundColor: flash
            ? alpha(theme.palette.warning.main, 0.22)
            : 'transparent',
        }),
      ]}
    >
      {children}
    </Typography>
  );
}

const columns = [
  {
    field: 'name',
    headerName: 'Company',
    width: 220,
  },
  {
    field: 'sector',
    headerName: 'Sector',
    width: 180,
  },
  {
    field: 'industry',
    headerName: 'Industry',
    width: 160,
  },
  {
    field: 'symbol',
    headerName: 'Ticker',
    width: 110,
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    groupable: false,
    width: 120,
    renderCell: (params) => (
      <FlashOnChange
        changeId={params.value ?? 0}
        align="right"
        fontWeight={params.row.childrenCount === 0 ? 'bold' : undefined}
      >
        ${params.value?.toFixed(2)}
      </FlashOnChange>
    ),
  },
  {
    field: 'volume',
    headerName: 'Volume',
    type: 'number',
    groupable: false,
    width: 150,
    renderCell: (params) => (
      <FlashOnChange changeId={params.value ?? 0} align="right">
        {params.value?.toLocaleString()}
      </FlashOnChange>
    ),
  },
];

function ServerSideLazyLoadingGroupingRevalidation() {
  const apiRef = useGridApiRef();
  const [useCache, setUseCache] = React.useState(false);

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const response = await fakeRowGroupingStockServer(params);

        return {
          rows: response.rows,
          rowCount: response.rowCount,
        };
      },
      getGroupKey: (row) => row?.group ?? row?.name ?? '',
      getChildrenCount: (row) => row.childrenCount,
    }),
    [],
  );

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['sector', 'industry'],
      },
      columns: {
        columnVisibilityModel: {
          name: false,
        },
      },
      pagination: {
        paginationModel: { page: 0, pageSize: 10 },
      },
    },
  });

  return (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {useCache && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => apiRef.current?.dataSource.cache.clear()}
          >
            Clear cache
          </Button>
        )}
        <FormControlLabel
          control={
            <Switch
              checked={useCache}
              onChange={(event) => setUseCache(event.target.checked)}
              size="small"
            />
          }
          label="Use cache"
        />
      </Stack>
      <div style={{ width: '100%', height: 360 }}>
        <DataGridPremium
          key={useCache ? 'cached' : 'uncached'}
          apiRef={apiRef}
          columns={columns}
          dataSource={dataSource}
          dataSourceCache={useCache ? undefined : null}
          initialState={initialState}
          groupingColDef={{ leafField: 'name' }}
          lazyLoading
          dataSourceRevalidateMs={3_000}
          disableColumnSorting
          disableColumnFilter
        />
      </div>
    </Stack>
  );
}

export default ServerSideLazyLoadingGroupingRevalidation;
