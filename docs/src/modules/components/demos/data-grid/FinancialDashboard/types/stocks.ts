export interface StockData {
  id: number;
  symbol: string;
  name: string;
  logoUrl: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  history: Array<{
    date: string;
    price: number;
  }>;
  prediction: Array<{
    date: string;
    price: number;
  }>;
}
