import * as React from 'react';
import { GridGetRowsResponse, GridRowModel } from '@mui/x-data-grid-pro';
import type { StockData } from '../types/stocks';
import { COMPANY_NAMES } from '../data/stockConstants';

/**
 * Returns a price evolution simulation before a given date
 * @param basePrice The price before the returned array
 * @param size The number of element in the returned array
 * @param stepMs The gap between each item in milliseconds
 * @param baseDate The end date of the array
 */
const generateHistoricalData = (
  basePrice: number,
  size: number = 30,
  stepMs: number = 1000,
  baseDate?: Date,
) => {
  const data = [];
  const now = baseDate ?? new Date();
  let price = basePrice;

  for (let step = size; step > 0; step -= 1) {
    const date = new Date(now.getTime() - step * stepMs);

    const variation = (Math.random() - 0.5) * (price * 0.03);
    price += variation;

    data.push({
      date: date.toISOString(),
      price: Number(price.toFixed(2)),
    });
  }

  return data;
};

const generatePredictionData = (
  lastPrice: number,
  size: number = 7,
  stepMs: number = 1000,
  baseDate?: Date,
) => {
  const data = [];
  const now = baseDate ?? new Date();

  let price = lastPrice;
  for (let step = 1; step <= size; step += 1) {
    const date = new Date(now.getTime() + step * stepMs);

    const variation = (Math.random() - 0.5) * (price * 0.03);
    price += variation;

    data.push({
      date: date.toISOString(),
      price: Number(price.toFixed(2)),
    });
  }

  return data;
};

const UPDATE_STEP = 1000; // One point per second.
const DATA_STEP = 100; // One point per second.
const DATA_SIZE = 1000; // Number of data point in the price.

const generateMockStockData = (): StockData[] => {
  const data = Object.entries(COMPANY_NAMES).map(([symbol], index) => {
    const basePrice = 100 + Math.random() * 1000; // this is just going off the usual real range for prices, but we can change it to whatever
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / basePrice) * 100;
    const volume = Math.floor(Math.random() * 10000000);

    const now = new Date();
    now.setMilliseconds(0);
    const history = generateHistoricalData(basePrice, DATA_SIZE, DATA_STEP, now);
    const lastPrice = history[history.length - 1].price;
    const prediction = generatePredictionData(lastPrice, 10, DATA_STEP, now);

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
    if (!currentData) {
      return undefined;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const historyMinDate = new Date(now.getTime() - DATA_SIZE * DATA_STEP);

      const updatedRows = currentData.rows.map((row) => {
        // Keep the part of history that is still in the requested time window.
        const firstValidIndex = row.history.findIndex(
          (historyRecord: { date: string }) => historyRecord.date >= historyMinDate.toISOString(),
        );
        const keptHistory =
          firstValidIndex === -1 ? [] : row.history.slice(firstValidIndex, row.history.length);

        // Generate the additional data.
        const lastPrice =
          keptHistory.length === 0 ? row.price : keptHistory[keptHistory.length - 1].price;
        const startTime =
          keptHistory.length === 0
            ? historyMinDate
            : new Date(keptHistory[keptHistory.length - 1].date);
        const newHistory = generatePredictionData(
          lastPrice,
          DATA_SIZE - keptHistory.length,
          DATA_STEP,
          startTime,
        );

        const history = [...keptHistory, ...newHistory];

        const price = history[history.length - 1].price;
        const prevPrice = history[history.length - 2].price;
        const change = Number((price - prevPrice).toFixed(2));
        const changePercent = Number(((change / prevPrice) * 100).toFixed(2));

        return {
          ...row,
          price,
          change,
          changePercent,
          history,
        };
      });

      currentData.rows = updatedRows;
    }, UPDATE_STEP);

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
