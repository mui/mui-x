export interface GridChartsIntegrationContextValue {
  categories: { id: string; label: string; data: (string | number | null)[] }[];
  series: { id: string; label: string; data: (number | null)[] }[];
  chartType: string;
  configuration: {
    [key: string]: any;
  };
  setCategories: (
    categories: { id: string; label: string; data: (string | number | null)[] }[],
  ) => void;
  setSeries: (series: { id: string; label: string; data: (number | null)[] }[]) => void;
  setChartType: (type: string) => void;
  setConfiguration: (configuration: { [key: string]: any }) => void;
}
