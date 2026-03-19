import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

const PRICE_ROUNDING_FACTOR = 100;

const STOCK_TREE = [
  {
    id: 'tech',
    name: 'Technology',
    industries: [
      {
        id: 'software',
        name: 'Software',
        stocks: [
          {
            symbol: 'MSFT',
            name: 'Microsoft',
            basePrice: 430,
            baseVolume: 18_000_000,
          },
          { symbol: 'ADBE', name: 'Adobe', basePrice: 560, baseVolume: 2_900_000 },
          {
            symbol: 'CRM',
            name: 'Salesforce',
            basePrice: 310,
            baseVolume: 4_700_000,
          },
        ],
      },
      {
        id: 'internet',
        name: 'Internet Platforms',
        stocks: [
          {
            symbol: 'GOOGL',
            name: 'Alphabet',
            basePrice: 195,
            baseVolume: 24_000_000,
          },
          { symbol: 'META', name: 'Meta', basePrice: 505, baseVolume: 13_000_000 },
          { symbol: 'NFLX', name: 'Netflix', basePrice: 660, baseVolume: 5_000_000 },
        ],
      },
    ],
  },
  {
    id: 'finance',
    name: 'Financial Services',
    industries: [
      {
        id: 'banks',
        name: 'Banks',
        stocks: [
          { symbol: 'JPM', name: 'JPMorgan', basePrice: 242, baseVolume: 9_500_000 },
          {
            symbol: 'BAC',
            name: 'Bank of America',
            basePrice: 47,
            baseVolume: 44_000_000,
          },
          { symbol: 'C', name: 'Citigroup', basePrice: 74, baseVolume: 14_000_000 },
        ],
      },
      {
        id: 'payments',
        name: 'Payments',
        stocks: [
          { symbol: 'V', name: 'Visa', basePrice: 345, baseVolume: 7_000_000 },
          {
            symbol: 'MA',
            name: 'Mastercard',
            basePrice: 505,
            baseVolume: 3_300_000,
          },
          { symbol: 'PYPL', name: 'PayPal', basePrice: 82, baseVolume: 12_000_000 },
        ],
      },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    industries: [
      {
        id: 'integrated',
        name: 'Integrated Oil & Gas',
        stocks: [
          {
            symbol: 'XOM',
            name: 'Exxon Mobil',
            basePrice: 120,
            baseVolume: 15_000_000,
          },
          { symbol: 'CVX', name: 'Chevron', basePrice: 170, baseVolume: 8_300_000 },
          { symbol: 'SHEL', name: 'Shell', basePrice: 74, baseVolume: 7_400_000 },
        ],
      },
      {
        id: 'renewables',
        name: 'Renewables',
        stocks: [
          {
            symbol: 'NEE',
            name: 'NextEra Energy',
            basePrice: 76,
            baseVolume: 11_000_000,
          },
          {
            symbol: 'ENPH',
            name: 'Enphase Energy',
            basePrice: 124,
            baseVolume: 5_200_000,
          },
          {
            symbol: 'FSLR',
            name: 'First Solar',
            basePrice: 214,
            baseVolume: 2_800_000,
          },
        ],
      },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    industries: [
      {
        id: 'pharma',
        name: 'Pharmaceuticals',
        stocks: [
          { symbol: 'PFE', name: 'Pfizer', basePrice: 31, baseVolume: 36_000_000 },
          { symbol: 'MRK', name: 'Merck', basePrice: 132, baseVolume: 8_700_000 },
          {
            symbol: 'LLY',
            name: 'Eli Lilly',
            basePrice: 912,
            baseVolume: 3_800_000,
          },
        ],
      },
      {
        id: 'devices',
        name: 'Medical Devices',
        stocks: [
          { symbol: 'ABT', name: 'Abbott', basePrice: 126, baseVolume: 5_100_000 },
          { symbol: 'SYK', name: 'Stryker', basePrice: 337, baseVolume: 1_700_000 },
          {
            symbol: 'ISRG',
            name: 'Intuitive Surgical',
            basePrice: 490,
            baseVolume: 1_300_000,
          },
        ],
      },
    ],
  },
];

const stockIndexBySymbol = new Map();
let runningIndex = 0;
STOCK_TREE.forEach((sector) => {
  sector.industries.forEach((industry) => {
    industry.stocks.forEach((stock) => {
      stockIndexBySymbol.set(stock.symbol, runningIndex);
      runningIndex += 1;
    });
  });
});

const getTick = () => Math.floor(Date.now() / 2_000);

function getLeafMetrics(stock, tick) {
  const stockIndex = stockIndexBySymbol.get(stock.symbol) ?? 0;
  const drift = Math.sin((tick + stockIndex) * 0.65) * 0.018;
  const volumeDrift = Math.cos((tick + stockIndex) * 0.47) * 0.14;
  const price =
    Math.round(stock.basePrice * (1 + drift) * PRICE_ROUNDING_FACTOR) /
    PRICE_ROUNDING_FACTOR;
  const volume = Math.round(stock.baseVolume * (1 + volumeDrift));
  return { price, volume };
}

function getIndustry(sectorName, industryName) {
  return STOCK_TREE.find((sector) => sector.name === sectorName)?.industries.find(
    (industry) => industry.name === industryName,
  );
}

function getSectorSummaryRows(tick) {
  return STOCK_TREE.map((sector) => {
    let priceAccumulator = 0;
    let volumeAccumulator = 0;
    let stockCount = 0;

    sector.industries.forEach((industry) => {
      industry.stocks.forEach((stock) => {
        const metrics = getLeafMetrics(stock, tick);
        priceAccumulator += metrics.price;
        volumeAccumulator += metrics.volume;
        stockCount += 1;
      });
    });

    return {
      id: `sector-${sector.id}`,
      name: sector.name,
      symbol: '',
      price:
        Math.round((priceAccumulator / stockCount) * PRICE_ROUNDING_FACTOR) /
        PRICE_ROUNDING_FACTOR,
      volume: volumeAccumulator,
      childrenCount: sector.industries.length,
    };
  });
}

function getIndustryRows(sectorName, tick) {
  const sector = STOCK_TREE.find((candidate) => candidate.name === sectorName);
  if (!sector) {
    return [];
  }

  return sector.industries.map((industry) => {
    let priceAccumulator = 0;
    let volumeAccumulator = 0;

    industry.stocks.forEach((stock) => {
      const metrics = getLeafMetrics(stock, tick);
      priceAccumulator += metrics.price;
      volumeAccumulator += metrics.volume;
    });

    return {
      id: `industry-${sector.id}-${industry.id}`,
      name: industry.name,
      symbol: '',
      price:
        Math.round(
          (priceAccumulator / industry.stocks.length) * PRICE_ROUNDING_FACTOR,
        ) / PRICE_ROUNDING_FACTOR,
      volume: volumeAccumulator,
      childrenCount: industry.stocks.length,
    };
  });
}

function getLeafRows(sectorName, industryName, tick) {
  const industry = getIndustry(sectorName, industryName);
  if (!industry) {
    return [];
  }

  return industry.stocks.map((stock) => {
    const metrics = getLeafMetrics(stock, tick);
    return {
      id: `stock-${stock.symbol}`,
      name: stock.name,
      symbol: stock.symbol,
      price: metrics.price,
      volume: metrics.volume,
      childrenCount: 0,
    };
  });
}

function fakeTreeStockServer(params, delayMs = 120) {
  const tick = getTick();
  const groupKeys = params.groupKeys ?? [];

  if (groupKeys.length === 0) {
    const allRows = getSectorSummaryRows(tick);
    const page = params.paginationModel?.page ?? 0;
    const pageSize = params.paginationModel?.pageSize ?? 5;
    const start = page * pageSize;
    const paginatedRows = allRows.slice(start, start + pageSize);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          rows: paginatedRows,
          rowCount: allRows.length,
        });
      }, delayMs);
    });
  }

  if (groupKeys.length === 1) {
    const rows = getIndustryRows(groupKeys[0], tick);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ rows });
      }, delayMs);
    });
  }

  const rows = getLeafRows(groupKeys[0], groupKeys[1], tick);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ rows });
    }, delayMs);
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
      display="flex"
      alignItems="center"
      justifyContent={align === 'right' ? 'flex-end' : 'flex-start'}
      height="100%"
      paddingRight="10px"
      paddingLeft="10px"
      width="100%"
      fontWeight={fontWeight}
      sx={(theme) => ({
        position: 'relative',
        width: 'calc(100% + 20px)',
        left: '-10px',
        transition: 'background-color 500ms ease',
        backgroundColor: flash
          ? alpha(theme.palette.warning.main, 0.22)
          : 'transparent',
      })}
    >
      {children}
    </Typography>
  );
}

const columns = [
  {
    field: 'symbol',
    headerName: 'Ticker',
    width: 110,
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
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
    width: 150,
    renderCell: (params) => (
      <FlashOnChange changeId={params.value ?? 0} align="right">
        {params.value?.toLocaleString()}
      </FlashOnChange>
    ),
  },
];

export default function ServerSideTreeDataRevalidation() {
  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const response = await fakeTreeStockServer(params);

        return {
          rows: response.rows,
          rowCount: response.rowCount,
        };
      },
      getGroupKey: (row) => row.name,
      getChildrenCount: (row) => row.childrenCount,
    }),
    [],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPro
        treeData
        columns={columns}
        dataSource={dataSource}
        dataSourceCache={null}
        dataSourceRevalidateMs={2_000}
        pagination
        initialState={{
          pagination: { paginationModel: { pageSize: 4, page: 0 }, rowCount: 0 },
        }}
        pageSizeOptions={[4, 8]}
        disableColumnSorting
        disableColumnFilter
      />
    </div>
  );
}
