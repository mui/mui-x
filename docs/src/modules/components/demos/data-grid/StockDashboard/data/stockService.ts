import { StockData } from '../types/stocks';

let stockData: Record<string, StockData> = {};

const loadInitialData = async () => {
  try {
    const response = await fetch('/data/stock_data.json');
    stockData = await response.json();
  } catch (error) {
    console.error('Error loading stock data:', error);
    throw error;
  }
};

const simulatePriceChange = (price: number, volatility: number = 0.02): number => {
  const change = (Math.random() - 0.5) * volatility * price;
  return price + change;
};

export const getStockData = (symbol: string): StockData => {
  const stock = stockData[symbol];
  if (!stock) {
    throw new Error(`Stock ${symbol} not found`);
  }

  const newPrice = simulatePriceChange(stock.price);
  const priceChange = newPrice - stock.price;
  const priceChangePercent = (priceChange / stock.price) * 100;

  return {
    ...stock,
    price: newPrice,
    change: priceChange,
    changePercent: priceChangePercent,
  };
};

export const getAllStocks = (): StockData[] => {
  return Object.values(stockData).map((stock) => getStockData(stock.symbol));
};

loadInitialData();

export const WATCHED_SYMBOLS = Object.keys(stockData);
