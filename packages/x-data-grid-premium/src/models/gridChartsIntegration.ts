export interface GridChartsIntegrationContextValue {
  categories: string[];
  series: Array<{
    id: string;
    label: string;
    data: (number | null)[];
  }>;
  chartType: string;
  configuration: {
    [key: string]: any;
  };
  setCategories: (categories: string[]) => void;
  setSeries: (series: { id: string; label: string; data: (number | null)[] }[]) => void;
  setChartType: (type: string) => void;
  setConfiguration: (configuration: { [key: string]: any }) => void;
}
