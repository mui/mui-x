import * as React from 'react';
import { GridGetRowsResponse, GridRowModel } from '@mui/x-data-grid-pro';
import type { StockData } from '../types/stocks';
import { COMPANY_NAMES } from '../data/stockConstants';

const generateHistoricalData = (basePrice: number, days: number = 30) => {
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const variation = (Math.random() - 0.5) * (basePrice * 0.02);
    const price = basePrice + variation;

    data.push({
      date: date.toISOString(),
      price: Number(price.toFixed(2)),
    });
  }

  return data;
};

const generatePredictionData = (lastPrice: number, days: number = 7) => {
  const data = [];
  const now = new Date();

  for (let i = 1; i <= days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);

    const variation = (Math.random() - 0.5) * (lastPrice * 0.01);
    const price = lastPrice + variation;

    data.push({
      date: date.toISOString(),
      price: Number(price.toFixed(2)),
    });
  }

  return data;
};

const generateMockStockData = (): StockData[] => {
  const data = Object.entries(COMPANY_NAMES).map(([symbol], index) => {
    const basePrice = 100 + Math.random() * 1000; // this is just going off the usual real range for prices, but we can change it to whatever
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / basePrice) * 100;
    const volume = Math.floor(Math.random() * 10000000);

    const history = generateHistoricalData(basePrice);
    const lastPrice = history[history.length - 1].price;
    const prediction = generatePredictionData(lastPrice);

    return {
      id: index,
      symbol,
      name: COMPANY_NAMES[symbol],
      logoUrl: `/static/x/data-grid/company-logos/${symbol}.svg`,
      price: Number(basePrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume,
      history,
      prediction,
    };
  });
  return data;
};

export const useMockStockServer = () => {
  const [isDataReady, setDataReady] = React.useState(false);
  const dataRef = React.useRef<{
    rows: GridRowModel[];
  } | null>(null);

  React.useEffect(() => {
    const rows = generateMockStockData();
    const data: { rows: GridRowModel[] } = {
      rows,
    };
    dataRef.current = data;
    setDataReady(true);
  }, []);

  React.useEffect(() => {
    const currentData = dataRef.current;
    if (!currentData) return;

    const interval = setInterval(() => {
      const updatedRows = currentData.rows.map((row) => {
        const priceChange = (Math.random() - 0.5) * (row.price * 0.01);
        const newPrice = Number((row.price + priceChange).toFixed(2));
        const change = Number((newPrice - row.price).toFixed(2));
        const changePercent = Number(((change / row.price) * 100).toFixed(2));

        const history = row.history.slice(1);
        history.push({
          date: new Date().toISOString(),
          price: newPrice,
        });

        return {
          ...row,
          price: newPrice,
          change,
          changePercent,
          history,
        };
      });

      currentData.rows = updatedRows;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchRows = React.useCallback(
    async (url: string): Promise<GridGetRowsResponse> => {
      if (!dataRef.current || !isDataReady) {
        return { rows: [], rowCount: 0 };
      }

      const queryString = url.startsWith('?') ? url.slice(1) : url;
      const params = new URLSearchParams(queryString);

      const page = parseInt(params.get('page') || '0', 10);
      const pageSize = parseInt(params.get('pageSize') || '25', 10);
      const sortModel = JSON.parse(params.get('sortModel') || '[]') as {
        field: keyof StockData;
        sort: 'asc' | 'desc';
      }[];
      const filterModel = JSON.parse(params.get('filterModel') || '{}') as Record<
        string,
        { value: string }
      >;

      const currentData = dataRef.current;
      if (!currentData) {
        return { rows: [], rowCount: 0 };
      }

      let rows = [...currentData.rows];

      if (sortModel.length > 0) {
        const { field, sort } = sortModel[0];
        rows.sort((a, b) => {
          const aValue = a[field];
          const bValue = b[field];
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sort === 'asc' ? aValue - bValue : bValue - aValue;
          }
          return 0;
        });
      }

      if (Object.keys(filterModel).length > 0) {
        rows = rows.filter((row) => {
          return Object.entries(filterModel).every(([field, filter]) => {
            const value = row[field as keyof StockData];
            return value?.toString().toLowerCase().includes(filter.value.toLowerCase()) ?? false;
          });
        });
      }

      const start = page * pageSize;
      const end = start + pageSize;
      const paginatedRows = rows.slice(start, end);

      return {
        rows: paginatedRows,
        rowCount: rows.length,
      };
    },
    [isDataReady],
  );

  return {
    fetchRows,
    isReady: isDataReady,
  };
};
