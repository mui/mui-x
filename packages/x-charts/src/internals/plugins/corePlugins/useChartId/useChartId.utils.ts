let globalChartDefaultId = 0;
export const createChartDefaultId = () => {
  globalChartDefaultId += 1;
  return `mui-chart-${globalChartDefaultId}`;
};
